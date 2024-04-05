import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import BarraSuperior from '../Comprador/BarraSuperior'
import BarraLateralVendedor from './BarraLateralVendedor';
import InicioVendedor from './InicioVendedor';
import Ventas from './Ventas';
import DetalleVenta from './DetalleVenta';
import MisProductos from './MisProductos';
import DetalleProductoVendedor from './DetalleProductoVendedor';
import SeguimientoVendedor from './SeguimientoVendedor';
import EditarProducto from './EditarProducto';
import DetalleSeguimientoVendedor from './DetalleSeguimientoVendedor';
import ReclamoVendedor from './ReclamoVendedor';
import EstadisticaVendedor from './EstadisticaVendedor';
import BilleteraVendedor from './BilleteraVendedor';
import DetalleBilletera from './DetalleBilletera';
import { useParams } from 'react-router-dom';

export default function MenuVendedor() {
    const [mostrarInicio, setMostrarInicio] = useState(true);
    const [mostrarVentas, setMostrarVentas] = useState(false);
    const [mostrarMisProductos, setMostrarMisProductos] = useState(false);
    const [mostrarSeguimientoVendedor, setMostrarSeguimientoVendedor] = useState(false);
    const [mostrarReclamo, setMostrarReclamo] = useState(false);
    const [mostrarEstadisticaVendedor, setMostrarEstadisticaVendedor] = useState(false);
    const [mostrarBilletera, setMostrarBilletera] = useState(false);

    const [mostrarDetalleVenta, setMostrarDetalleVenta] = useState(false);
    const [mostrarDetalleProducto, setMostrarDetalleProducto] = useState(false);
    const [mostrarEditarProducto, setMostrarEditarProducto] = useState(false);
    const [opcionEditarProducto, setOpcionEditarProducto] = useState(0);
    const [mostrarDetalleSeguimiento, setMostrarnDetalleSeguimiento] = useState(false);
    const [mostrarDetalleBilletera, setMostrarnDetalleBilletera] = useState(false);

    const { idUsuario } = useParams();

    const [informacionTienda, setInformacionTienda] = useState();
    const [productoInformacion, setProductoInformacion] = useState();

    useEffect(() => {
      const obtenerInformacionTienda = async () => {
        try {
          const response = await fetch(
            `https://localhost:7240/InformacionTienda?idUsuario=${idUsuario}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const tienda = await response.json();
            // console.log(tienda);
            setInformacionTienda(tienda);
          } else if (response.status === 404) {
            throw new Error("Tienda no encontrado");
          } else {
            throw new Error("Error al obtener informacion de la tienda");
          }
        } catch (error) {
          console.error("Error al obtener informacion de la tienda", error);
          throw new Error("Error al obtener informacion de la tienda");
        }
      };
      obtenerInformacionTienda();
    }, [idUsuario]);

  return (
    <Box sx={{display:"flex", flexDirection:"column"}}>
        <BarraSuperior idUsuario={idUsuario}/>
        <Box sx={{display:"flex", flexDirection:"row"}}>
            
            <BarraLateralVendedor mostrarInicio={mostrarInicio} setMostrarInicio={setMostrarInicio} mostrarVentas={mostrarVentas}
            setMostrarVentas={setMostrarVentas} mostrarMisProductos={mostrarMisProductos} setMostrarMisProductos={setMostrarMisProductos}
            mostrarSeguimientoVendedor={mostrarSeguimientoVendedor} setMostrarSeguimientoVendedor={setMostrarSeguimientoVendedor}
            mostrarReclamo={mostrarReclamo} setMostrarReclamo={setMostrarReclamo} mostrarEstadisticaVendedor={mostrarEstadisticaVendedor}
            setMostrarEstadisticaVendedor={setMostrarEstadisticaVendedor} mostrarBilletera={mostrarBilletera} setMostrarBilletera={setMostrarBilletera}
            mostrarDetalleVenta={mostrarDetalleVenta} setMostrarDetalleVenta={setMostrarDetalleVenta} mostrarDetalleProducto={mostrarDetalleProducto}
            setMostrarDetalleProducto={setMostrarDetalleProducto} mostrarEditarProducto={mostrarEditarProducto}
            setMostrarEditarProducto={setMostrarEditarProducto} mostrarDetalleSeguimiento={mostrarDetalleSeguimiento}
            setMostrarnDetalleSeguimiento={setMostrarnDetalleSeguimiento} mostrarDetalleBilletera={mostrarDetalleBilletera}
            setMostrarnDetalleBilletera={setMostrarnDetalleBilletera}
            />

            {mostrarInicio && <InicioVendedor setMostrarInicio={setMostrarInicio} setMostrarEstadisticaVendedor={setMostrarEstadisticaVendedor}
            setMostrarVentas={setMostrarVentas} setMostrarMisProductos={setMostrarMisProductos}
            setMostrarSeguimientoVendedor={setMostrarSeguimientoVendedor} setMostrarBilletera={setMostrarBilletera} setMostrarReclamo={setMostrarReclamo}/>}

            {mostrarVentas && <Ventas setMostrarVentas={setMostrarVentas} setMostrarDetalleVenta={setMostrarDetalleVenta}/>}

            {mostrarDetalleVenta && <DetalleVenta setMostrarVentas={setMostrarVentas} setMostrarDetalleVenta={setMostrarDetalleVenta}
            setMostrarSeguimientoVendedor={setMostrarSeguimientoVendedor}/>}

            {mostrarMisProductos && <MisProductos setMostrarMisProductos={setMostrarMisProductos} setMostrarDetalleProducto={setMostrarDetalleProducto}
            setOpcionEditarProducto={setOpcionEditarProducto} setProductoInformacion={setProductoInformacion} setMostrarEditarProducto={setMostrarEditarProducto}/>}

            {mostrarDetalleProducto && <DetalleProductoVendedor setMostrarMisProductos={setMostrarMisProductos} setMostrarDetalleProducto={setMostrarDetalleProducto}
            productoInformacion={productoInformacion}/>}

            {mostrarEditarProducto && <EditarProducto setMostrarMisProductos={setMostrarMisProductos} setMostrarEditarProducto={setMostrarEditarProducto}
            opcionEditarProducto={opcionEditarProducto} informacionTienda={informacionTienda} productoInformacion={productoInformacion}/>}

            {mostrarSeguimientoVendedor && <SeguimientoVendedor setMostrarSeguimientoVendedor={setMostrarSeguimientoVendedor}
            setMostrarnDetalleSeguimiento={setMostrarnDetalleSeguimiento}/>}

            {mostrarDetalleSeguimiento && <DetalleSeguimientoVendedor setMostrarSeguimientoVendedor={setMostrarSeguimientoVendedor}
            setMostrarnDetalleSeguimiento={setMostrarnDetalleSeguimiento}/>}

            {mostrarReclamo && <ReclamoVendedor />}

            {mostrarEstadisticaVendedor && <EstadisticaVendedor />}

            {mostrarBilletera && <BilleteraVendedor setMostrarBilletera={setMostrarBilletera} setMostrarnDetalleBilletera={setMostrarnDetalleBilletera}/>}

            {mostrarDetalleBilletera && <DetalleBilletera setMostrarBilletera={setMostrarBilletera} setMostrarnDetalleBilletera={setMostrarnDetalleBilletera}/>}
        </Box>
    </Box>
  )
}
