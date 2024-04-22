# modelo.py
import os
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
    
    # df['Anho'] = df['Fecha_Hora'].dt.year
    # df['Mes'] = df['Fecha_Hora'].dt.month
    # df['Dia'] = df['Fecha_Hora'].dt.day
    # df['Hora'] = df['Fecha_Hora'].dt.hour
    # df['Minuto'] = df['Fecha_Hora'].dt.minute
    # df['Segundo'] = df['Fecha_Hora'].dt.second
    
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
    
    # df.loc[:, 'Anho'] = df['Fecha_Hora'].dt.year
    # df.loc[:, 'Mes'] = df['Fecha_Hora'].dt.month
    # df.loc[:, 'Dia'] = df['Fecha_Hora'].dt.day
    # df.loc[:, 'Hora'] = df['Fecha_Hora'].dt.hour
    # df.loc[:, 'Minuto'] = df['Fecha_Hora'].dt.minute
    # df.loc[:, 'Segundo'] = df['Fecha_Hora'].dt.second
    
    return df

def cargar_pipeline_y_predecir(datos_directos):
    # Cargar los datos directos y preprocesarlos
    datos_directos_string = convertir_datos_directos(datos_directos)
    df_nuevos_datos = cargar_datos_2(datos_directos_string)
    df_nuevos_datos = preprocesar_datos_2(df_nuevos_datos)
    df_nuevos_datos.drop(['Nombre', 'Fecha_Hora'], axis=1, inplace=True)
    
    predicciones = Entrenamiento(df_nuevos_datos)
    
    for indice, prediccion in enumerate(predicciones):
        if(prediccion):
            return "Fraude"
        else:
            return "No Fraude"
        
def Entrenamiento(df_nuevos_datos):
    # # Cargar y preprocesar los datos
    # ruta_archivo = os.path.abspath("ArchivosAdicionales/datos_pedidos_fraude.txt")
    pipeline_file = "pipeline.pkl"
    # df = cargar_datos(ruta_archivo)
    # df = preprocesar_datos(df)

    # # Separar datos en características (X) y etiquetas (y)
    # features = ['ID', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto', 'Anho', 'Mes', 'Dia', 'Hora', 'Minuto', 'Segundo']
    # X = df[features]
    # y = df['Fraude']

    # # Dividir datos en conjunto de entrenamiento y prueba
    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # # Crear y entrenar el modelo
    # pipeline = make_pipeline(StandardScaler(), RandomForestClassifier())
    # pipeline.fit(X_train, y_train)
    
    with open(pipeline_file, 'rb') as file:
        pipeline = pickle.load(file)
    
    predicciones = pipeline.predict(df_nuevos_datos)
    return predicciones
    
def convertir_datos_directos(datos_directos_string):
    lineas = datos_directos_string.split('\n')
    
    lineas = [linea.strip() for linea in lineas if linea.strip()]
    
    return lineas