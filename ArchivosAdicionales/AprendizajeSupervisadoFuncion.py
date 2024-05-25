import os
import numpy as np
import pandas as pd
import pickle
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, learning_curve, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

def entrenar_y_guardar_pipeline(pipeline, X_train, y_train, pipeline_file):
    # Entrenar el modelo
    # pipeline = make_pipeline(StandardScaler(), RandomForestClassifier())
    pipeline.fit(X_train, y_train)
    
    # Guardar el modelo en un archivo
    with open(pipeline_file, 'wb') as file:
        pickle.dump(pipeline, file)

def cargar_pipeline_y_predecir(datos_directos, pipeline_file):
    # Cargar los datos directos y preprocesarlos
    df_nuevos_datos = cargar_datos_2(datos_directos)
    df_nuevos_datos = preprocesar_datos_2(df_nuevos_datos)
    # df_nuevos_datos.drop(['Nombre'], axis=1, inplace=True)
    df_nuevos_datos.drop(['Nombre', 'Fecha_Hora'], axis=1, inplace=True)
    
    # Cargar el pipeline desde el archivo
    with open(pipeline_file, 'rb') as file:
        pipeline, X_train_prev, y_train_prev = pickle.load(file)
    
    # Realizar predicciones con el pipeline cargado
    predicciones = pipeline.predict(df_nuevos_datos)
    
    valor_prediccion = 1 if predicciones[0] else 0
    
    # Imprimir las predicciones
    print(f"\nPredicción para el movimiento: {'Fraude' if predicciones[0] else 'No Fraude'}")
    
    reentrenar_y_guardar_pipeline(df_nuevos_datos, pipeline_file, pipeline, valor_prediccion, X_train_prev, y_train_prev)
    
def reentrenar_y_guardar_pipeline(nuevos_datos, pipeline_file, pipeline, valor_prediccion, X_train_prev, y_train_prev):
    X_nuevos = nuevos_datos
    y_nuevos = np.array([valor_prediccion])
    
    # Agregar los nuevos datos a los datos de entrenamiento previos
    X_train = pd.concat([X_train_prev, X_nuevos], ignore_index=True)
    y_train = np.concatenate([y_train_prev, y_nuevos])
    
    # Reentrenar el pipeline con los datos combinados
    pipeline.fit(X_train, y_train)
    
    # Guardar el pipeline y los datos de entrenamiento actualizados
    with open(pipeline_file, 'wb') as file:
        pickle.dump((pipeline, X_train, y_train), file)

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

def evaluar_modelo(modelo, X_test, y_test):
    y_pred = modelo.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='micro')
    recall = recall_score(y_test, y_pred, average='micro')
    f1 = f1_score(y_test, y_pred, average='micro')
    conf_matrix = confusion_matrix(y_test, y_pred)
    cv_scores = cross_val_score(modelo, X, y, cv=5, scoring='accuracy')

    print("Accuracy:", accuracy)
    print("Precision:", precision)
    print("Recall:", recall)
    print("F1-score:", f1)
    print("Matriz de Confusión:\n", conf_matrix)
    print("Cross-validation scores:", cv_scores)
    print("Mean cross-validation score:", cv_scores.mean())

# Función para graficar la curva de aprendizaje
def plot_learning_curve(estimator, title, X, y, ylim=None, cv=None,
                        n_jobs=None, train_sizes=np.linspace(.1, 1.0, 5)):
    plt.figure()
    plt.title(title)
    if ylim is not None:
        plt.ylim(*ylim)
    plt.xlabel("Training examples")
    plt.ylabel("Score")
    train_sizes, train_scores, test_scores = learning_curve(
        estimator, X, y, cv=cv, n_jobs=n_jobs, train_sizes=train_sizes)
    train_scores_mean = np.mean(train_scores, axis=1)
    train_scores_std = np.std(train_scores, axis=1)
    test_scores_mean = np.mean(test_scores, axis=1)
    test_scores_std = np.std(test_scores, axis=1)
    plt.grid()

    plt.fill_between(train_sizes, train_scores_mean - train_scores_std,
                     train_scores_mean + train_scores_std, alpha=0.1,
                     color="r")
    plt.fill_between(train_sizes, test_scores_mean - test_scores_std,
                     test_scores_mean + test_scores_std, alpha=0.1, color="g")
    plt.plot(train_sizes, train_scores_mean, 'o-', color="r",
             label="Training score")
    plt.plot(train_sizes, test_scores_mean, 'o-', color="g",
             label="Cross-validation score")

    plt.legend(loc="best")
    return plt

pipeline_file = "pipelineEsc2.pkl"

# Cargar y preprocesar los datos
# ruta_archivo = os.path.abspath("ArchivosAdicionales/datos_pedidos_fraude_Esc1.txt")

archivos = [
    "ArchivosAdicionales/datos_pedidos_fraude_Esc2.txt",
]
# df = cargar_datos(ruta_archivo)
dfs = []
for archivo in archivos:
    df_temp = cargar_datos(archivo)
    dfs.append(df_temp)
df = pd.concat(dfs, ignore_index=True)

df = preprocesar_datos(df)

# # Separar datos en características (X) y etiquetas (y)
# features = ['ID', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto']
features = ['ID', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto', 'Anho', 
            'Mes', 'Dia', 'Hora', 'Minuto', 'Segundo']
X = df[features]
y = df['Fraude']

# Dividir datos en conjunto de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Crear y entrenar el modelo
pipeline = make_pipeline(StandardScaler(), RandomForestClassifier())
pipeline.fit(X_train, y_train)

# pipeline2 = make_pipeline(StandardScaler(), DecisionTreeClassifier())
# pipeline2.fit(X_train, y_train)

# pipeline3 = make_pipeline(StandardScaler(), GradientBoostingClassifier())
# pipeline3.fit(X_train, y_train)
    
# Guardar el modelo en un archivo
with open(pipeline_file, 'wb') as file:
    pickle.dump((pipeline, X_train, y_train), file)
    
    

# entrenar_y_guardar_pipeline(pipeline, X_train, y_train, pipeline_file)

# evaluar_modelo(pipeline, X_test, y_test)
# evaluar_modelo(pipeline2, X_test, y_test)
# evaluar_modelo(pipeline3, X_test, y_test)

# title = "Learning Curves (Random Forest)"
# plot_learning_curve(pipeline, title, X_train, y_train, cv=5, n_jobs=-1)
# plt.show()

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

    return pd.DataFrame(datos_procesados, columns=['ID', 'Nombre', 'Fecha_Hora', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto'])

def preprocesar_datos_2(df):
    df = df.copy()
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

datos_directos = [
    "ID: 3",
    "Nombre y Apellido del Comprador: Pepito Alvez",
    "Fecha de Creación del Pedido: 2024-05-26 23:29:20",
    "Lugar de Entrega: Direccion 1",
    "Cantidad de cambios de lugar de entrega durante el ultimo mes: 1",
    "Costo total del Pedido: 21",
    "Método de Pago (Número de Cuenta Encriptado): pm_1P7KAtG77lj0glGvxvqiL2c6",
    "Numeros de cambios del método de pago: 1",
    "Cantidad de Productos en el Pedido: 1",
    "Tipo de Producto (con mayor valor): Juguetes"
]

cargar_pipeline_y_predecir(datos_directos, pipeline_file)