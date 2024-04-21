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

def generar_datos_aleatorios_con_fraude(num_pedidos, nombres_compradores, numeros_cuenta, id_generados):
    direcciones_entrega = [fake.address() for _ in range(len(nombres_compradores))]
    cambios_metodo_pago = {}
    historial_cambios_direccion = {}
    cambios_mes_actual = 0
    historial_compras = {}  # Inicializar el historial de compras aquí
    cantidad_productos=0
    idUsuario=0
    tipo_producto_mayoria=""
    rangos_cantidad_productos = {nombre: (random.randint(1, 5), random.randint(40, 80)) for nombre in nombres_compradores}
    rangos_cantidad_precio = {nombre: (random.randint(6, 25), random.randint(50, 120)) for nombre in nombres_compradores}
    
    with open("ArchivosAdicionales/datos_pedidos_fraude.txt", "w") as archivo:
        for _ in range(num_pedidos):
            nombre_apellido = random.choice(nombres_compradores)
            numero_cuenta = numeros_cuenta.get(nombre_apellido, '')
            idUsuario = generar_id_para_nombre(nombre_apellido, id_generados)

            fecha_creacion_pedido = None
            costo_pedido = 0
            
            min_cantidad, max_cantidad = rangos_cantidad_productos[nombre_apellido]
            min_cantidad, max_cantidad = min(max_cantidad, min_cantidad), max(max_cantidad, min_cantidad)
            
            min_cantidadPrecio, max_cantidadPrecio = rangos_cantidad_precio[nombre_apellido]
            min_cantidadPrecio, max_cantidadPrecio = min(max_cantidadPrecio, min_cantidadPrecio), max(max_cantidadPrecio, min_cantidadPrecio)

            if random.random() < 0.05:
                tipo_fraude = random.choice(['cambio_direccion', 'volumen_inusual',
                                              'patron_compra_atipico', 'monto_inusual'])

                if tipo_fraude == 'cambio_direccion':
                    if(fecha_creacion_pedido is None):
                        fecha_creacion_pedido = fecha_hora_generar(nombre_apellido, historial_compras)
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
                    if(fecha_creacion_pedido is None):
                        fecha_creacion_pedido = fecha_hora_generar(nombre_apellido, historial_compras)
                    min_cantidad, max_cantidad = min(max_cantidad, min_cantidad), max(max_cantidad, min_cantidad)
                    if min_cantidad < 10:
                        cantidad_productos = random.randint(max_cantidad+30, max_cantidad+70)
                    else:
                        cantidad_productos = random.choice([random.randint(1, min_cantidad-10), random.randint(max_cantidad+30, max_cantidad+70)])
                
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
                    if(fecha_creacion_pedido is None):
                        fecha_creacion_pedido = fecha_hora_generar(nombre_apellido, historial_compras)
                    min_cantidadPrecio, max_cantidadPrecio = min(max_cantidadPrecio, min_cantidadPrecio), max(max_cantidadPrecio, min_cantidadPrecio)
                    if min_cantidadPrecio < 21:
                        costo_pedido = random.randint(max_cantidadPrecio+30, max_cantidadPrecio+70)
                    else:
                        costo_pedido = random.choice([random.randint(1, min_cantidadPrecio-20), random.randint(max_cantidadPrecio+60, max_cantidadPrecio+120)])

                # elif tipo_fraude == 'cambio_metodo_pago':
                #     if(fecha_creacion_pedido is None):
                #         fecha_creacion_pedido = fecha_hora_generar(nombre_apellido, historial_compras)
                #     num_cambios_metodo_pago = cambios_metodo_pago.get(nombre_apellido, 0)
                #     num_cambios_metodo_pago += 6
                #     cambios_metodo_pago[nombre_apellido] = num_cambios_metodo_pago

            else:
                fecha_creacion_pedido = fecha_hora_generar(nombre_apellido, historial_compras)
                
                costo_pedido = random.randint(min_cantidadPrecio, max_cantidadPrecio)
                cantidad_productos = random.randint(min_cantidad, max_cantidad)
                tipo_producto_mayoria = random.choice(['Electrodomésticos', 'Vestimenta', 'Muebles', 'Limpieza', 'Tecnología',
                                               'Libros/Artículos', 'Herramientas', 'Belleza/Salud', 'Joyeria/Accesorios', 'Decoración', 'Juguetes'])
                tipo_fraude = 'No_Fraude'
                
                historial_cliente = historial_cambios_direccion.get(nombre_apellido, [])
                cambios_mes_actual = sum(1 for fecha in historial_cliente if fecha >= datetime.now() - timedelta(days=30))
                if cambios_mes_actual > 5 and tipo_fraude == 'No_Fraude':
                    tipo_fraude = 'cambio_direccion'
                
                if random.random() < 0.05:
                    num_cambios_metodo_pago = cambios_metodo_pago.get(nombre_apellido, 0)
                    num_cambios_metodo_pago += 1
                    cambios_metodo_pago[nombre_apellido] = num_cambios_metodo_pago
                    if num_cambios_metodo_pago > 5 and tipo_fraude == 'No_Fraude':
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

            # if fecha_creacion_pedido is not None:
            #     archivo.write("Nombre y Apellido del Comprador: {}\n".format(nombre_apellido))
            #     archivo.write("Fecha de Creación del Pedido: {}\n".format(fecha_creacion_pedido))
            #     archivo.write("Lugar de Entrega: {}\n".format(direccion_entrega))
            #     archivo.write("Cantidad de cambios de lugar de entrega durante el ultimo mes: {}\n".format(cambios_mes_actual))
            #     archivo.write("Costo total del Pedido: {}\n".format(costo_pedido))
            #     archivo.write("Método de Pago (Número de Cuenta Encriptado): {}\n".format(numero_cuenta))
            #     archivo.write("Numeros de cambios del método de pago: {}\n".format(cambios_metodo_pago.get(nombre_apellido, 0)))
            #     archivo.write("Cantidad de Productos en el Pedido: {}\n".format(cantidad_productos))
            #     archivo.write("Tipo de Producto (con mayor valor): {}\n".format(tipo_producto_mayoria))
            #     archivo.write("Tipo de Fraude: {}\n".format(tipo_fraude))
            #     archivo.write("\n")
            archivo.write("ID: {}\n".format(idUsuario))
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
            if(tipo_fraude == "cambio_direccion"):
                historial_cambios_direccion[nombre_apellido] = []
                cambios_mes_actual = 0
            num_cambios_metodo_pago = cambios_metodo_pago.get(nombre_apellido, 0)
            if(num_cambios_metodo_pago>8):
                cambios_metodo_pago[nombre_apellido] = 0


def generar_id_para_nombre(nombre, id_generados):
    if nombre in id_generados:
        return id_generados[nombre]
    else:
        nuevo_id = encriptar_numero_cuenta(random.randint(1000000000, 9999999999))
        id_generados[nombre] = nuevo_id
        return nuevo_id

# Generar 5000 pedidos aleatorios con posibles movimientos fraudulentos
nombres_compradores = [fake.name() for _ in range(100)]
id_generados = {}
numeros_cuenta = {nombre: encriptar_numero_cuenta(random.randint(1000000000, 9999999999)) for nombre in nombres_compradores}
generar_datos_aleatorios_con_fraude(30000, nombres_compradores, numeros_cuenta, id_generados)