# Importar las librerías necesarias
import os
import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.pipeline import make_pipeline
from imblearn.over_sampling import SMOTE  # Añadir SMOTE para sobremuestreo

# Función para entrenar y guardar el pipeline
def entrenar_y_guardar_pipeline(pipeline, X_train, y_train, pipeline_file):
    pipeline.fit(X_train, y_train)
    with open(pipeline_file, 'wb') as file:
        pickle.dump((pipeline, X_train, y_train), file)

# Función para cargar el pipeline y predecir
def cargar_pipeline_y_predecir(datos_directos, pipeline_file):
    df_nuevos_datos = cargar_datos_2(datos_directos)
    df_nuevos_datos = preprocesar_datos_2(df_nuevos_datos)
    df_nuevos_datos.drop(['Nombre', 'Fecha_Hora'], axis=1, inplace=True)

    with open(pipeline_file, 'rb') as file:
        pipeline, X_train_prev, y_train_prev = pickle.load(file)

    predicciones = pipeline.predict(df_nuevos_datos)
    valor_prediccion = 1 if predicciones[0] else 0

    print(f"\nPredicción para el movimiento: {'Fraude' if predicciones[0] else 'No Fraude'}")
    # reentrenar_y_guardar_pipeline(df_nuevos_datos, pipeline_file, pipeline, valor_prediccion, X_train_prev, y_train_prev)

# Función para reentrenar y guardar el pipeline
def reentrenar_y_guardar_pipeline(nuevos_datos, pipeline_file, pipeline, valor_prediccion, X_train_prev, y_train_prev):
    X_nuevos = nuevos_datos
    y_nuevos = np.array([valor_prediccion])

    X_train = pd.concat([X_train_prev, X_nuevos], ignore_index=True)
    y_train = np.concatenate([y_train_prev, y_nuevos])

    pipeline.fit(X_train, y_train)

    with open(pipeline_file, 'wb') as file:
        pickle.dump((pipeline, X_train, y_train), file)

# Función para cargar datos
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
            try:
                clave, valor = linea.strip().split(': ', 1)
                fragmentos.append(valor)
            except ValueError:
                print("Error: la línea no sigue el formato esperado:", linea)
        if fragmentos:
            datos_procesados.append(tuple(fragmentos))

    return pd.DataFrame(datos_procesados, columns=['ID', 'Nombre', 'Fecha_Hora', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 
                                                   'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto', 'Fraude'])

# Función para preprocesar los datos
def preprocesar_datos(df):
    label_encoders = {}
    for column in ['Direccion', 'Tipo_Producto', 'Cuenta']:
        label_encoders[column] = LabelEncoder()
        df[column] = label_encoders[column].fit_transform(df[column])

    df['Fraude'] = df['Fraude'].apply(lambda x: 0 if x == 'No_Fraude' else 1)
    df['Fecha_Hora'] = pd.to_datetime(df['Fecha_Hora'], errors='coerce', format='%Y-%m-%d %H:%M:%S')
    df = df.dropna(subset=['Fecha_Hora'])

    df['Anho'] = df['Fecha_Hora'].dt.year
    df['Mes'] = df['Fecha_Hora'].dt.month
    df['Dia'] = df['Fecha_Hora'].dt.day
    df['Hora'] = df['Fecha_Hora'].dt.hour
    df['Minuto'] = df['Fecha_Hora'].dt.minute
    df['Segundo'] = df['Fecha_Hora'].dt.second

    return df

# Función para evaluar el modelo
def evaluar_modelo(modelo, X_test, y_test):
    y_pred = modelo.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)

    print("Accuracy:", accuracy)
    print("Precision:", precision)
    print("Recall:", recall)
    print("F1-score:", f1)
    print("Matriz de Confusión:\n", conf_matrix)

pipeline_file = "pipelineEsc2.pkl"

# Cargar y preprocesar los datos
# archivos = ["ArchivosAdicionales/datos_pedidos_fraude_Esc2.txt"]
# dfs = [cargar_datos(archivo) for archivo in archivos]
# df = pd.concat(dfs, ignore_index=True)
# df = preprocesar_datos(df)

# # Separar datos en características y etiquetas
# features = ['ID', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 
#             'Tipo_Producto', 'Anho', 'Mes', 'Dia', 'Hora', 'Minuto', 'Segundo']
# X = df[features]
# y = df['Fraude']

# # Aplicar SMOTE para balancear las clases
# smote = SMOTE(random_state=42)
# X_resampled, y_resampled = smote.fit_resample(X, y)

# # Dividir datos en conjunto de entrenamiento y prueba
# X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

# # Crear y entrenar el modelo con balanceo de clases
# pipeline = make_pipeline(StandardScaler(), RandomForestClassifier(class_weight='balanced'))
# pipeline.fit(X_train, y_train)

# # Guardar el modelo en un archivo
# with open(pipeline_file, 'wb') as file:
#     pickle.dump((pipeline, X_train, y_train), file)



# Evaluar el modelo
# evaluar_modelo(pipeline, X_test, y_test)



# Función para cargar datos directos
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

    return pd.DataFrame(datos_procesados, columns=['ID', 'Nombre', 'Fecha_Hora', 'Direccion', 'CantidadCambioEntrega', 'Precio', 
                                                   'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto'])

# Función para preprocesar datos directos
def preprocesar_datos_2(df):
    df = df.copy()
    label_encoders = {}
    for column in ['Direccion', 'Tipo_Producto', 'Cuenta']:
        label_encoders[column] = LabelEncoder()
        df[column] = label_encoders[column].fit_transform(df[column])

    df['Fecha_Hora'] = pd.to_datetime(df['Fecha_Hora'], errors='coerce', format='%Y-%m-%d %H:%M:%S')
    df = df.dropna(subset=['Fecha_Hora'])

    df['Anho'] = df['Fecha_Hora'].dt.year
    df['Mes'] = df['Fecha_Hora'].dt.month
    df['Dia'] = df['Fecha_Hora'].dt.day
    df['Hora'] = df['Fecha_Hora'].dt.hour
    df['Minuto'] = df['Fecha_Hora'].dt.minute
    df['Segundo'] = df['Fecha_Hora'].dt.second

    return df

# Ejemplo de predicción con nuevos datos
datos_directos = [
    "ID: 3",
    "Nombre y Apellido del Comprador: Pepito Alvez",
    "Fecha de Creación del Pedido: 2024-05-26 23:29:20",
    "Lugar de Entrega: Direccion 1",
    "Cantidad de cambios de lugar de entrega durante el ultimo mes: 1",
    "Costo total del Pedido: 50000",
    "Método de Pago (Número de Cuenta Encriptado): pm_1P7KAtG77lj0glGvxvqiL2c6",
    "Numeros de cambios del método de pago: 2",
    "Cantidad de Productos en el Pedido: 2",
    "Tipo de Producto (con mayor valor): Juguetes"
]

cargar_pipeline_y_predecir(datos_directos, pipeline_file)