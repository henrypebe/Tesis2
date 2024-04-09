import random
import hashlib
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()

def encriptar_numero_cuenta(numero_cuenta):
    sha256 = hashlib.sha256()
    sha256.update(str(numero_cuenta).encode('utf-8'))
    hash_numero = int(sha256.hexdigest(), 16)
    return hash_numero
    
def fecha_hora_generar(nombre_cliente, historial_compras):
    if nombre_cliente in historial_compras and historial_compras[nombre_cliente]:
        primer_pedido = historial_compras[nombre_cliente][0]
        if primer_pedido is not None:
            hora_pedido = primer_pedido.hour

            if 5 <= hora_pedido <= 11:
                rango_horario = (5, 11)  # [5am a 11am]
            elif 12 <= hora_pedido <= 17:
                rango_horario = (12, 17)  # [12pm a 5pm]
            elif 18 <= hora_pedido <= 22:
                rango_horario = (18, 22)  # [6pm a 10pm]
            else:
                rango1 = (23,23)
                rango2 = (0, 4)
                rango_horario = random.choice([rango1, rango2])

            hora_aleatoria = random.randint(*rango_horario)

            fecha_fake = fake.date_time_between(start_date='-30d', end_date='now')

            fecha_fake = fecha_fake.replace(hour=hora_aleatoria, minute=random.randint(0, 59), second=0, microsecond=0)

            return fecha_fake

    return fake.date_time_between(start_date='-30d', end_date='now')

def generar_datos_aleatorios_con_fraude(num_pedidos, nombres_compradores, numeros_cuenta):
    direcciones_entrega = [fake.address() for _ in range(50)]
    cambios_metodo_pago = {}
    historial_cambios_direccion = {}
    cambios_mes_actual = 0
    historial_compras = {}  # Inicializar el historial de compras aquí

    with open("ArchivosAdicionales/datos_pedidos_fraude.txt", "w") as archivo:
        for _ in range(num_pedidos):
            nombre_apellido = random.choice(nombres_compradores)
            numero_cuenta = numeros_cuenta.get(nombre_apellido, '')

            fecha_creacion_pedido = None
            costo_pedido = 0

            if random.random() < 0.05:
                tipo_fraude = random.choice(['cambio_direccion', 'transaccion_inusual', 'volumen_inusual',
                                              'patron_compra_atipico', 'monto_inusual', 'cambio_metodo_pago'])

                if tipo_fraude == 'cambio_direccion':
                    direcciones_entrega[nombres_compradores.index(nombre_apellido)] = fake.address()
                    historial_cliente = historial_cambios_direccion.get(nombre_apellido, [])
                    historial_cliente.append(datetime.now())
                    historial_cliente.append(datetime.now())
                    historial_cliente.append(datetime.now())
                    historial_cliente.append(datetime.now())
                    historial_cliente.append(datetime.now())
                    historial_cliente.append(datetime.now())
                    historial_cambios_direccion[nombre_apellido] = historial_cliente
                    cambios_mes_actual = sum(1 for fecha in historial_cliente if fecha >= datetime.now() - timedelta(days=30))

                elif tipo_fraude == 'volumen_inusual':
                    if random.random() < 0.05:
                        cantidad_productos = random.randint(1, 5)
                    else:
                        cantidad_productos = random.randint(25, 50)

                # elif tipo_fraude == 'patron_compra_atipico':
                #     tipo_producto_mayoria = random.choice(['Electrodomésticos', 'Tecnología', 'Joyeria/Accesorios'])
                #     horas_compras = [fecha.hour for fecha in historial_compras.get(nombre_apellido, []) if fecha is not None]
                #     if horas_compras:
                #         hora_minima = min(horas_compras)
                #         hora_maxima = max(horas_compras)
                #         hora_fraude = random.choice([hora for hora in range(24) if hora <= hora_minima or hora >= hora_maxima])
                #         fecha_creacion_pedido = fake.date_time_between(start_date='-30d', end_date='now')
                #         fecha_creacion_pedido = fecha_creacion_pedido.replace(hour=hora_fraude, minute=random.randint(0, 59), second=0, microsecond=0)
                #     else:
                #         hora_fraude = random.randint(0, 23)
                
                elif tipo_fraude == 'patron_compra_atipico':
                    tipo_producto_mayoria = random.choice(['Electrodomésticos', 'Tecnología', 'Joyeria/Accesorios'])
                    primer_pedido = historial_compras.get(nombre_apellido, [])
                    if primer_pedido:
                        primer_pedido = primer_pedido[0]
                        if primer_pedido:
                            hora_pedido = primer_pedido.hour
                            if 5 <= hora_pedido <= 11:
                                rango_horario = (18, 22)  # [6pm a 10pm]
                            elif 12 <= hora_pedido <= 17:
                                rango1 = (23, 23)  # [11pm a 11pm]
                                rango2 = (0, 4)    # [12am a 4am]
                                rango_horario = random.choice([rango1, rango2])
                            elif 18 <= hora_pedido <= 22:
                                rango_horario = (5, 11)
                            else:
                                rango_horario = (12, 17)
                            hora_aleatoria = random.randint(*rango_horario)
                            fecha_fake = fake.date_time_between(start_date='-30d', end_date='now')
                            fecha_creacion_pedido = fecha_fake.replace(hour=hora_aleatoria, minute=random.randint(0, 59), second=0, microsecond=0)

                elif tipo_fraude == 'monto_inusual':
                    if random.random() < 0.05:
                        costo_pedido = round(random.uniform(1, 18), 2)
                    else:
                        costo_pedido_fraudulento = round(random.uniform(1000, 5000), 2)

                elif tipo_fraude == 'cambio_metodo_pago':
                    num_cambios_metodo_pago = cambios_metodo_pago.get(nombre_apellido, 0)
                    num_cambios_metodo_pago += 5
                    cambios_metodo_pago[nombre_apellido] = num_cambios_metodo_pago

            else:
                fecha_creacion_pedido = fecha_hora_generar(nombre_apellido, historial_compras)
                
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
                if random.random() < 0.05:
                    direcciones_entrega[nombres_compradores.index(nombre_apellido)] = fake.address()
                    historial_cliente = historial_cambios_direccion.get(nombre_apellido, [])
                    historial_cliente.append(datetime.now())
                    historial_cambios_direccion[nombre_apellido] = historial_cliente
                    cambios_mes_actual = sum(1 for fecha in historial_cliente if fecha >= datetime.now() - timedelta(days=30))
                    if cambios_mes_actual > 5 and tipo_fraude == 'No_Fraude':
                        tipo_fraude = 'cambio_direccion'
                 
            if nombre_apellido in historial_compras and fecha_creacion_pedido is not None:
                historial_compras[nombre_apellido].append(fecha_creacion_pedido)
            elif fecha_creacion_pedido is not None:
                historial_compras[nombre_apellido] = [fecha_creacion_pedido]
                       
            direccion_entrega = direcciones_entrega[nombres_compradores.index(nombre_apellido)]
            direccion_entrega = direccion_entrega.replace("\n", ", ")

            if fecha_creacion_pedido is not None:
                archivo.write("Nombre y Apellido del Comprador: {}\n".format(nombre_apellido))
                archivo.write("Fecha de Creación del Pedido: {}\n".format(fecha_creacion_pedido))
                archivo.write("Lugar de Entrega: {}\n".format(direccion_entrega))
                archivo.write("Cantidad de cambios de lugar de entrega durante el ultimo mes: {}\n".format(cambios_mes_actual))
                archivo.write("Costo total del Pedido: {}\n".format(costo_pedido))
                archivo.write("Método de Pago (Número de Cuenta Encriptado): {}\n".format(numero_cuenta))
                archivo.write("Numeros de cambios del método de pago: {}\n".format(cambios_metodo_pago.get(nombre_apellido, 0)))
                archivo.write("Cantidad de Productos en el Pedido: {}\n".format(cantidad_productos))
                archivo.write("Tipo de Producto (con mayor valor): {}\n".format(tipo_producto_mayoria))
                archivo.write("Tipo de Fraude: {}\n".format(tipo_fraude))
                archivo.write("\n")

# Generar 5000 pedidos aleatorios con posibles movimientos fraudulentos
nombres_compradores = [fake.name() for _ in range(50)]
numeros_cuenta = {nombre: encriptar_numero_cuenta(random.randint(1000000000, 9999999999)) for nombre in nombres_compradores}
generar_datos_aleatorios_con_fraude(5000, nombres_compradores, numeros_cuenta)