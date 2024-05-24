# modelo.py
import os
import numpy as np
import pandas as pd
import pickle
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, learning_curve, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

def cargar_datos(nombre_archivo):
    with open(nombre_archivo, 'r', encoding='latin1') as archivo:
        datos_procesados = []
        fragmentos = []
        for linea in archivo:
            if linea.strip() == '':
                if fragmentos:
                    datos_procesados.append(tuple(fragmentos))
                    fragmentos = []
                continue
            clave, valor = linea.strip().split(': ', 1)
            fragmentos.append(valor)
        if fragmentos:
            datos_procesados.append(tuple(fragmentos))
        
    return pd.DataFrame(datos_procesados, columns=['ID', 'Nombre', 'Fecha_Hora', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto', 'Fraude'])

# Función para preprocesar los datos
def preprocesar_datos(df):
    label_encoders = {}
    for column in ['Direccion', 'Tipo_Producto']:
        label_encoders[column] = LabelEncoder()
        df[column] = label_encoders[column].fit_transform(df[column])
    
    # Convertir la columna 'Fraude' a valores binarios (0 y 1)
    df['Fraude'] = df['Fraude'].apply(lambda x: 0 if x == 'No_Fraude' else 1)
    
    # Conversión de la columna 'Fecha_Hora' a tipo datetime
    df['Fecha_Hora'] = pd.to_datetime(df['Fecha_Hora'], errors='coerce', format='%Y-%m-%d %H:%M:%S')
    # Eliminación de filas con valores faltantes en 'Fecha_Hora'
    df = df.dropna(subset=['Fecha_Hora'])
    
    return df

def cargar_datos_2(datos):
    datos_procesados = []
    fragmentos = []
    for linea in datos:
        if linea.strip() == '':
            if fragmentos:
                datos_procesados.append(tuple(fragmentos))
                fragmentos = []
            continue
        clave, valor = linea.strip().split(': ', 1)
        fragmentos.append(valor)
    if fragmentos:
        datos_procesados.append(tuple(fragmentos))

    return pd.DataFrame(datos_procesados, columns=['ID','Nombre', 'Fecha_Hora', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto'])

def preprocesar_datos_2(df):
    df = df.copy()  # Crear una copia del DataFrame para evitar SettingWithCopyWarning
    label_encoders = {}
    for column in ['Direccion', 'Tipo_Producto', 'Cuenta']:
        label_encoders[column] = LabelEncoder()
        df[column] = label_encoders[column].fit_transform(df[column])
    
    # Conversión de la columna 'Fecha_Hora' a tipo datetime
    df['Fecha_Hora'] = pd.to_datetime(df['Fecha_Hora'], errors='coerce', format='%Y-%m-%d %H:%M:%S')
    # Eliminación de filas con valores faltantes en 'Fecha_Hora'
    df = df.dropna(subset=['Fecha_Hora'])
    
    df.loc[:, 'Anho'] = df['Fecha_Hora'].dt.year
    df.loc[:, 'Mes'] = df['Fecha_Hora'].dt.month
    df.loc[:, 'Dia'] = df['Fecha_Hora'].dt.day
    df.loc[:, 'Hora'] = df['Fecha_Hora'].dt.hour
    df.loc[:, 'Minuto'] = df['Fecha_Hora'].dt.minute
    df.loc[:, 'Segundo'] = df['Fecha_Hora'].dt.second
    
    return df

def cargar_pipeline_y_predecir(datos_directos):
    FECHAS_FESTIVAS = [
        (12, 24), # 24/12
        (12, 25), # 25/12
        (12, 26), # 26/12
        (12, 30), # 30/12
        (12, 31), # 31/12
        (1, 1),   # 1/01
        (7, 28),  # 28/07
        (7, 27),  # 27/07
        (7, 29),  # 29/07
        (2, 14),   # 14/02
        (2, 13),   # 13/02
        (2, 15),   # 15/02
    ]
    # Cargar los datos directos y preprocesarlos
    datos_directos_string = convertir_datos_directos(datos_directos)
    df_nuevos_datos = cargar_datos_2(datos_directos_string)
    df_nuevos_datos = preprocesar_datos_2(df_nuevos_datos)
    
    fecha_pedido = df_nuevos_datos['Fecha_Hora'].iloc[0]
    if (fecha_pedido.month, fecha_pedido.day) in FECHAS_FESTIVAS:
        pipeline_file = "pipelineEsc3.pkl"
    else:
        pipeline_file = random.choice(["pipeline.pkl", "pipelineEsc2.pkl"])
    
    df_nuevos_datos.drop(['Nombre', 'Fecha_Hora'], axis=1, inplace=True)
    
    # # predicciones = Entrenamiento(df_nuevos_datos)
    with open(pipeline_file, 'rb') as file:
        pipeline = pickle.load(file)
    
    predicciones = pipeline.predict(df_nuevos_datos)
    
    valor_prediccion = 1 if predicciones[0] else 0
    
    reentrenar_y_guardar_pipeline(df_nuevos_datos, pipeline_file, pipeline, valor_prediccion)
    
    if(predicciones[0]):
        return "Fraude"
    else:
        return "No Fraude"

def reentrenar_y_guardar_pipeline(nuevos_datos, pipeline_file, pipeline, valor_prediccion):
    X_nuevos = nuevos_datos
    y_nuevos = np.array([valor_prediccion])
    
    pipeline.fit(X_nuevos, y_nuevos)
    
    with open(pipeline_file, 'wb') as file:
        pickle.dump(pipeline, file)
        
def Entrenamiento(df_nuevos_datos):
    pipeline_file = "pipeline.pkl"
    
    with open(pipeline_file, 'rb') as file:
        pipeline = pickle.load(file)
    
    predicciones = pipeline.predict(df_nuevos_datos)
    return predicciones
    
def convertir_datos_directos(datos_directos_string):
    lineas = datos_directos_string.split('\n')
    
    lineas = [linea.strip() for linea in lineas if linea.strip()]
    
    return lineas