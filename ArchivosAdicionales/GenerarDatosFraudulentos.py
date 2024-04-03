import random
import hashlib
from faker import Faker
from datetime import timedelta

fake = Faker()

def encriptar_numero_cuenta(numero_cuenta):
    sha256 = hashlib.sha256()
    sha256.update(str(numero_cuenta).encode('utf-8'))
    hash_numero = int(sha256.hexdigest(), 16)
    return hash_numero

def fecha_hora_fraudulentas():
    fecha_fake = fake.date_time_between(start_date='-30d', end_date='now')
    hora_aleatoria = random.randint(23, 27) #De las 11pm a 3am
    if hora_aleatoria >= 24:
        fecha_fake += timedelta(days=1)
        hora_aleatoria -= 24
        
    fecha_fake = fecha_fake.replace(hour=hora_aleatoria, minute=random.randint(0, 59), second=0, microsecond=0)
    return fecha_fake

def generar_datos_aleatorios_con_fraude(num_pedidos, nombres_compradores, numeros_cuenta):
    direcciones_entrega = [fake.address() for _ in range(50)]
    cambios_metodo_pago = {}

    with open("ArchivosAdicionales/datos_pedidos_fraude.txt", "w") as archivo:
        for _ in range(num_pedidos):
            nombre_apellido = random.choice(nombres_compradores)

            fecha_creacion_pedido = None

            if random.random() < 0.05:
                tipo_fraude = random.choice(['cambio_direccion', 'transaccion_inusual', 'volumen_inusual',
                                              'patron_compra_atipico', 'monto_inusual', 'cambio_metodo_pago'])

                if tipo_fraude == 'cambio_direccion':
                    direcciones_entrega[nombres_compradores.index(nombre_apellido)] = fake.address()

                elif tipo_fraude == 'volumen_inusual':
                    if random.random() < 0.05:
                        cantidad_productos = random.randint(1, 5)
                    else:
                        cantidad_productos = random.randint(25, 50)

                elif tipo_fraude == 'patron_compra_atipico':
                    fecha_creacion_pedido = fecha_hora_fraudulentas()
                    tipo_producto_mayoria = random.choice(['Electrodomésticos', 'Tecnología', 'Joyeria/Accesorios'])

                elif tipo_fraude == 'monto_inusual':
                    if random.random() < 0.05:
                        costo_pedido = round(random.uniform(1, 18), 2)
                    else:
                        costo_pedido_fraudulento = round(random.uniform(1000, 5000), 2)

                elif tipo_fraude == 'cambio_metodo_pago':
                    num_cambios_metodo_pago = cambios_metodo_pago.get(nombre_apellido, 0)
                    num_cambios_metodo_pago += 20
                    cambios_metodo_pago[nombre_apellido] = num_cambios_metodo_pago

            else:
                fecha_creacion_pedido = fake.date_time_between(start_date='-30d', end_date='now')
                costo_pedido = round(random.uniform(20, 500), 2)
                cantidad_productos = random.randint(10, 20)
                tipo_producto_mayoria = random.choice(['Electrodomésticos', 'Vestimenta', 'Muebles', 'Limpieza', 'Tecnología',
                                               'Libros/Artículos', 'Herramientas', 'Belleza/Salud', 'Joyeria/Accesorios', 'Decoración', 'Juguetes'])
                tipo_fraude = 'No_Fraude'
                if random.random() < 0.05:
                    num_cambios_metodo_pago = cambios_metodo_pago.get(nombre_apellido, 0)
                    num_cambios_metodo_pago += 1
                    cambios_metodo_pago[nombre_apellido] = num_cambios_metodo_pago
                    if num_cambios_metodo_pago > 10 and tipo_fraude == 'No_Fraude':
                        tipo_fraude = 'cambio_metodo_pago'
                        

            numero_cuenta = numeros_cuenta.get(nombre_apellido, '')  # Use .get() to avoid KeyError
            direccion_entrega = direcciones_entrega[nombres_compradores.index(nombre_apellido)]
            direccion_entrega = direccion_entrega.replace("\n", ", ")

            archivo.write("Nombre y Apellido del Comprador: {}\n".format(nombre_apellido))
            archivo.write("Fecha de Creación del Pedido: {}\n".format(fecha_creacion_pedido))
            archivo.write("Lugar de Entrega: {}\n".format(direccion_entrega))
            archivo.write("Costo del Pedido: {}\n".format(costo_pedido))
            archivo.write("Método de Pago (Número de Cuenta Encriptado): {}\n".format(numero_cuenta))
            archivo.write("Numeros de cambios del método de pago: {}\n".format(cambios_metodo_pago.get(nombre_apellido, 0)))
            archivo.write("Cantidad de Productos del Pedido: {}\n".format(cantidad_productos))
            archivo.write("Tipo de Producto (con mayor valor): {}\n".format(tipo_producto_mayoria))
            archivo.write("Tipo de Fraude: {}\n".format(tipo_fraude))
            archivo.write("\n")

# Generar 5000 pedidos aleatorios con posibles movimientos fraudulentos
nombres_compradores = [fake.name() for _ in range(50)]
numeros_cuenta = {nombre: encriptar_numero_cuenta(random.randint(1000000000, 9999999999)) for nombre in nombres_compradores}
generar_datos_aleatorios_con_fraude(5000, nombres_compradores, numeros_cuenta)