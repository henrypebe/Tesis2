from flask import Flask, jsonify, request
from flask_cors import CORS
from modelo import cargar_pipeline_y_predecir

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/predecir', methods=['POST'])
def predecir():
    datos_directos = request.json['datos_directos']

    # Llamar a la función cargar_pipeline_y_predecir
    resultado = cargar_pipeline_y_predecir(datos_directos)

    return jsonify(resultado)

if __name__ == '__main__':
    app.run(debug=True)