import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline

import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import learning_curve

# Definimos una función para leer el archivo y procesar los datos
def procesar_archivo(nombre_archivo):
    
    datos_procesados = []

    with open(nombre_archivo, 'r') as archivo:
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

    return datos_procesados

# Para verificar los valores
def imprimir_datos(datos):
    for fragmento in datos:
        print(fragmento)

ruta_archivo = os.path.abspath("ArchivosAdicionales/datos_pedidos_fraude.txt")

datos_procesados = procesar_archivo(ruta_archivo)
# imprimir_datos(datos_procesados)

df = pd.DataFrame(datos_procesados, columns=['Nombre', 'Fecha_Hora', 'Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto', 'Fraude'])

label_encoders = {}

for column in ['Direccion', 'Tipo_Producto', 'Fraude']:
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

# # Se verifica los puntos importantes
features = ['Direccion', 'CantidadCambioEntrega', 'Precio', 'Cuenta', 'CantidaCambioCuenta', 'Cantidad_Productos', 'Tipo_Producto', 'Anho', 'Mes', 'Dia', 'Hora', 'Minuto', 'Segundo']
X = df[features]
y = df['Fraude']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = RandomForestClassifier()
model.fit(X_train_scaled, y_train)

y_pred = model.predict(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='micro')
recall = recall_score(y_test, y_pred, average='micro')
f1 = f1_score(y_test, y_pred, average='micro')
conf_matrix = confusion_matrix(y_test, y_pred)

print("Accuracy:", accuracy)
print("Precision:", precision)
print("Recall:", recall)
print("F1-score:", f1)
print("Matriz de Confusión:\n", conf_matrix)

pipeline = make_pipeline(StandardScaler(), RandomForestClassifier())
cv_scores = cross_val_score(pipeline, X, y, cv=5, scoring='accuracy')

print("Cross-validation scores:", cv_scores)
print("Mean cross-validation score:", cv_scores.mean())

def plot_learning_curve(estimator, title, X, y, ylim=None, cv=None,
                        n_jobs=None, train_sizes=np.linspace(.1, 1.0, 5)):
    """
    Plotea las curvas de aprendizaje.

    Parameters
    ----------
    estimator : object type that implements the "fit" and "predict" methods
        An object of that type which is cloned for each validation.

    title : string
        Title for the chart.

    X : array-like, shape (n_samples, n_features)
        Training vector, where n_samples is the number of samples and
        n_features is the number of features.

    y : array-like, shape (n_samples) or (n_samples, n_features), optional
        Target relative to X for classification or regression;
        None for unsupervised learning.

    ylim : tuple, shape (ymin, ymax), optional
        Defines minimum and maximum yvalues plotted.

    cv : int, cross-validation generator or an iterable, optional
        Determines the cross-validation splitting strategy.
        Possible inputs for cv are:
          - None, to use the default 5-fold cross-validation,
          - integer, to specify the number of folds.
          - :term:`CV splitter`,
          - An iterable yielding (train, test) splits as arrays of indices.

        For integer/None inputs, if ``y`` is binary or multiclass,
        :class:`StratifiedKFold` used. If the estimator is not a classifier
        or if ``y`` is neither binary nor multiclass, :class:`KFold` is used.

        Refer :ref:`User Guide <cross_validation>` for the various
        cross-validators that can be used here.

    n_jobs : int or None, optional (default=None)
        Number of jobs to run in parallel.
        ``None`` means 1 unless in a :obj:`joblib.parallel_backend` context.
        ``-1`` means using all processors. See :term:`Glossary <n_jobs>`
        for more details.

    train_sizes : array-like, shape (n_ticks,), dtype float or int
        Relative or absolute numbers of training examples that will be used to
        generate the learning curve. If the dtype is float, it is regarded as a
        fraction of the maximum size of the training set (that is determined
        by the selected validation method), i.e. it has to be within (0, 1].
        Otherwise it is interpreted as absolute sizes of the training sets.
        Note that for classification the number of samples usually have to
        be big enough to contain at least one sample from each class.
        (default: np.linspace(0.1, 1.0, 5))
    """
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

title = "Learning Curves (Random Forest)"
cv = 5
estimator = RandomForestClassifier()
plot_learning_curve(estimator, title, X_train_scaled, y_train, cv=cv, n_jobs=-1)
plt.show()