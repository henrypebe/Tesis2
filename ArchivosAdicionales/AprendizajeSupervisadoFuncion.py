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

def entrenar_y_guardar_pipeline(X_train, y_train, pipeline_file):
    # Entrenar el modelo
    pipeline = make_pipeline(StandardScaler(), RandomForestClassifier())
    pipeline.fit(X_train, y_train)
    
    # Guardar el modelo en un archivo
    with open(pipeline_file, 'wb') as file:
        pickle.dump(pipeline, file)

def cargar_pipeline_y_predecir(datos_directos, pipeline_file):
    # Cargar los datos directos y preprocesarlos
    df_nuevos_datos = cargar_datos_2(datos_directos)
    df_nuevos_datos = preprocesar_datos_2(df_nuevos_datos)
    df_nuevos_datos.drop(['Nombre', 'Fecha_Hora'], axis=1, inplace=True)
    
    # Cargar el pipeline desde el archivo
    with open(pipeline_file, 'rb') as file:
        pipeline = pickle.load(file)
    
    # Realizar predicciones con el pipeline cargado
    predicciones = pipeline.predict(df_nuevos_datos)
    
    # Imprimir las predicciones
    for indice, prediccion in enumerate(predicciones):
        print(f"\nPredicción para el movimiento : {'Fraude' if prediccion else 'No Fraude'}")

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
    
    df['Anho'] = df['Fecha_Hora'].dt.year
    df['Mes'] = df['Fecha_Hora'].dt.month
    df['Dia'] = df['Fecha_Hora'].dt.day
    df['Hora'] = df['Fecha_Hora'].dt.hour
    df['Minuto'] = df['Fecha_Hora'].dt.minute
    df['Segundo'] = df['Fecha_Hora'].dt.second
    
    return df

# # Cargar y preprocesar los datos
ruta_archivo = os.path.abspath("ArchivosAdicionales/datos_pedidos_fraude.txt")
pipeline_file = "pipeline.pkl"
df = cargar_datos(ruta_archivo)
df = preprocesar_datos(df)

# Separar datos en características (X) y etiquetas (y)
features = ['ID', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto', 'Anho', 'Mes', 'Dia', 'Hora', 'Minuto', 'Segundo']
X = df[features]
y = df['Fraude']

# Dividir datos en conjunto de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Crear y entrenar el modelo
pipeline = make_pipeline(StandardScaler(), RandomForestClassifier())
pipeline.fit(X_train, y_train)

entrenar_y_guardar_pipeline(X_train, y_train, pipeline_file)

# def cargar_datos_2(datos):
#     datos_procesados = []
#     fragmentos = []
#     for linea in datos:
#         if linea.strip() == '':
#             if fragmentos:
#                 datos_procesados.append(tuple(fragmentos))
#                 fragmentos = []
#             continue
#         clave, valor = linea.strip().split(': ', 1)
#         fragmentos.append(valor)
#     if fragmentos:
#         datos_procesados.append(tuple(fragmentos))

#     return pd.DataFrame(datos_procesados, columns=['ID','Nombre', 'Fecha_Hora', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto'])

# def preprocesar_datos_2(df):
#     df = df.copy()  # Crear una copia del DataFrame para evitar SettingWithCopyWarning
#     label_encoders = {}
#     for column in ['Direccion', 'Tipo_Producto']:
#         label_encoders[column] = LabelEncoder()
#         df[column] = label_encoders[column].fit_transform(df[column])
    
#     # Conversión de la columna 'Fecha_Hora' a tipo datetime
#     df['Fecha_Hora'] = pd.to_datetime(df['Fecha_Hora'], errors='coerce', format='%Y-%m-%d %H:%M:%S')
#     # Eliminación de filas con valores faltantes en 'Fecha_Hora'
#     df = df.dropna(subset=['Fecha_Hora'])
    
#     df.loc[:, 'Anho'] = df['Fecha_Hora'].dt.year
#     df.loc[:, 'Mes'] = df['Fecha_Hora'].dt.month
#     df.loc[:, 'Dia'] = df['Fecha_Hora'].dt.day
#     df.loc[:, 'Hora'] = df['Fecha_Hora'].dt.hour
#     df.loc[:, 'Minuto'] = df['Fecha_Hora'].dt.minute
#     df.loc[:, 'Segundo'] = df['Fecha_Hora'].dt.second
    
#     return df

# datos_directos = [
#     "ID: 84276456158716628018388007973476589694297596544125460074642747809140486938024",
#     "Nombre y Apellido del Comprador: Rachel Stanley",
#     "Fecha de Creación del Pedido: 2024-04-01 03:14:00",
#     "Lugar de Entrega: 686 Emma Station Apt. 781, Port Christianfort, MT 06211",
#     "Cantidad de cambios de lugar de entrega durante el ultimo mes: 3",
#     "Costo total del Pedido: 10",
#     "Método de Pago (Número de Cuenta Encriptado): 6567978263124321176199124994021629054013394850766151770053130685444148306190",
#     "Numeros de cambios del método de pago: 9",
#     "Cantidad de Productos en el Pedido: 10",
#     "Tipo de Producto (con mayor valor): Tecnología"
# ]

# cargar_pipeline_y_predecir(datos_directos, pipeline_file)