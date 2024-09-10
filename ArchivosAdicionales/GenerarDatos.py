import random
import hashlib
from faker import Faker

fake = Faker()

# Generamos nombres de compradores aleatorios y direcciones de entrega
nombres_compradores = [fake.name() for _ in range(15)]
direcciones_entrega = [fake.address() for _ in range(15)]

def encriptar_numero_cuenta(numero_cuenta):
    # Función para encriptar el número de cuenta usando SHA-256
    sha256 = hashlib.sha256()
    sha256.update(str(numero_cuenta).encode('utf-8'))
    return sha256.hexdigest()

# Inicializamos el diccionario de números de cuenta con números de cuenta aleatorios
numeros_cuenta = {nombre: encriptar_numero_cuenta(random.randint(1000000000, 9999999999)) for nombre in nombres_compradores}

def generar_datos_aleatorios(num_pedidos):
    with open("ArchivosAdicionales/datos_pedidos.txt", "w") as archivo:
        for _ in range(num_pedidos):
            # Elegimos un nombre de comprador aleatorio
            nombre_apellido = random.choice(nombres_compradores)
            
            # Si el comprador decide cambiar su número de cuenta (con una probabilidad del 10%)
            if random.random() < 0.1:
                numeros_cuenta[nombre_apellido] = encriptar_numero_cuenta(random.randint(1000000000, 9999999999))
            
            # Si el comprador decide cambiar su dirección de entrega (con una probabilidad del 10%)
            if random.random() < 0.1:
                direcciones_entrega[nombres_compradores.index(nombre_apellido)] = fake.address()
            
            # Obtenemos el número de cuenta encriptado y la dirección de entrega correspondientes al nombre de comprador
            numero_cuenta = numeros_cuenta[nombre_apellido]
            direccion_entrega = direcciones_entrega[nombres_compradores.index(nombre_apellido)]

            # Generamos otros datos aleatorios
            fecha_creacion_pedido = fake.date_time_between(start_date='-30d', end_date='now')
            costo_pedido = round(random.uniform(10, 500), 2)
            cantidad_productos = random.randint(1, 10)
            tipo_producto = random.choice(['Electrodomésticos', 'Vestimenta', 'Muebles', 'Limpieza', 'Tecnología',
                                           'Libros/Artículos', 'Herramientas', 'Belleza/Salud', 'Joyeria/Accesorios', 'Decoración', 'Juguetes'])

            # Escribir los datos en el archivo
            archivo.write("Nombre y Apellido del Comprador: {}\n".format(nombre_apellido))
            archivo.write("Fecha de Creación del Pedido: {}\n".format(fecha_creacion_pedido))
            archivo.write("Lugar de Entrega: {}\n".format(direccion_entrega))
            archivo.write("Costo del Pedido: {}\n".format(costo_pedido))
            archivo.write("Método de Pago (Número de Cuenta Encriptado): {}\n".format(numero_cuenta))
            archivo.write("Cantidad de Productos del Pedido: {}\n".format(cantidad_productos))
            archivo.write("Tipo de Producto: {}\n".format(tipo_producto))
            archivo.write("\n")

# Generar 200 pedidos aleatorios
generar_datos_aleatorios(200)