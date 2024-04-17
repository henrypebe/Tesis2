import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, learning_curve, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.pipeline import make_pipeline

# Función para cargar los datos desde un archivo CSV
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
    
    return pd.DataFrame(datos_procesados, columns=['Nombre', 'Fecha_Hora', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto', 'Fraude'])

# Función para preprocesar los datos
def preprocesar_datos(df):
    # Codificación de variables categóricas
    label_encoders = {}
    for column in ['Direccion', 'Tipo_Producto', 'Fraude']:
        label_encoders[column] = LabelEncoder()
        df[column] = label_encoders[column].fit_transform(df[column])
    
    # Conversión de la columna 'Fecha_Hora' a tipo datetime
    df['Fecha_Hora'] = pd.to_datetime(df['Fecha_Hora'], errors='coerce', format='%Y-%m-%d %H:%M:%S')
    # Eliminación de filas con valores faltantes en 'Fecha_Hora'
    df = df.dropna(subset=['Fecha_Hora'])
    
    # Extracción de características temporales
    df['Anho'] = df['Fecha_Hora'].dt.year
    df['Mes'] = df['Fecha_Hora'].dt.month
    df['Dia'] = df['Fecha_Hora'].dt.day
    df['Hora'] = df['Fecha_Hora'].dt.hour
    df['Minuto'] = df['Fecha_Hora'].dt.minute
    df['Segundo'] = df['Fecha_Hora'].dt.second
    
    return df

# Función para evaluar el modelo y generar métricas
def evaluar_modelo(modelo, X_test, y_test):
    y_pred = modelo.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='micro')
    recall = recall_score(y_test, y_pred, average='micro')
    f1 = f1_score(y_test, y_pred, average='micro')
    conf_matrix = confusion_matrix(y_test, y_pred)
    cv_scores = cross_val_score(pipeline, X, y, cv=5, scoring='accuracy')

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

# Cargar y preprocesar los datos
ruta_archivo = os.path.abspath("ArchivosAdicionales/datos_pedidos_fraude.txt")
df = cargar_datos(ruta_archivo)
df = preprocesar_datos(df)

# Separar datos en características (X) y etiquetas (y)
features = ['Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto', 'Anho', 'Mes', 'Dia', 'Hora', 'Minuto', 'Segundo']
X = df[features]
y = df['Fraude']

# Dividir datos en conjunto de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Crear y entrenar el modelo
pipeline = make_pipeline(StandardScaler(), RandomForestClassifier())
pipeline.fit(X_train, y_train)

# Evaluar el modelo
evaluar_modelo(pipeline, X_test, y_test)

# Curvas de aprendizaje
title = "Learning Curves (Random Forest)"
plot_learning_curve(pipeline, title, X_train, y_train, cv=5, n_jobs=-1)
plt.show()