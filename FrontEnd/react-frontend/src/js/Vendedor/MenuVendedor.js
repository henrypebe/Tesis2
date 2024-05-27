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
// import BilleteraVendedor from './BilleteraVendedor';
// import DetalleBilletera from './DetalleBilletera';
import { useParams } from 'react-router-dom';
import HistorialProducto from './HistorialProducto';
import GestionVendedor from './GestionVendedor';

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
    const [mostrarGestionVendedor, setMostrarGestionVendedor] = useState(false);

    const { idUsuario } = useParams();

    const [informacionTienda, setInformacionTienda] = useState();
    const [productoInformacion, setProductoInformacion] = useState();
    const [esVendedorAdministrador, setEsVendedorAdministrador] = useState();
    
    const [historialProducto, setHistoriaProducto] = useState();
    const [VentaSeleccionada, setVentaSeleccionada] = useState();
    const [SeguimientoSeleccionado, setSeguimientoSeleccionado] = useState();
    const [OpcionSeleccionado, setOpcionSeleccionado] = useState(0);

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
      const obtenerVendedorRol = async () => {
        try {
          const response = await fetch(
            `https://localhost:7240/InformacionRolVendedor?idUsuario=${idUsuario}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const rol = await response.json();
            setEsVendedorAdministrador(rol);
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
      obtenerVendedorRol();
    }, [idUsuario]);

    const handleChangeHistoria = (producto) =>{
      setHistoriaProducto(true);
      setMostrarDetalleProducto(false);
      setProductoInformacion(producto);
    }

    const HandleChangeVentaSeleccionado = (venta) =>{
      setMostrarDetalleVenta(true);
      setMostrarVentas(false);
      setVentaSeleccionada(venta);
    }

    const HandleChangeSeguimientoSeleccionado = (seguimiento) =>{
      setSeguimientoSeleccionado(seguimiento);
      setMostrarSeguimientoVendedor(false);
      setMostrarnDetalleSeguimiento(true);
    }

  return (
    <Box sx={{display:"flex", flexDirection:"column"}}>
        <BarraSuperior idUsuario={idUsuario} esVendedorAdministrador={esVendedorAdministrador}/>
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
            setMostrarnDetalleBilletera={setMostrarnDetalleBilletera} historialProducto={historialProducto} setHistoriaProducto={setHistoriaProducto}
            mostrarGestionVendedor={mostrarGestionVendedor} setMostrarGestionVendedor={setMostrarGestionVendedor} esVendedorAdministrador={esVendedorAdministrador}
            />

            {mostrarInicio && <InicioVendedor setMostrarInicio={setMostrarInicio} setMostrarEstadisticaVendedor={setMostrarEstadisticaVendedor}
            setMostrarVentas={setMostrarVentas} setMostrarMisProductos={setMostrarMisProductos}
            setMostrarSeguimientoVendedor={setMostrarSeguimientoVendedor} setMostrarBilletera={setMostrarBilletera} setMostrarReclamo={setMostrarReclamo}
            informacionTienda={informacionTienda} setMostrarGestionVendedor={setMostrarGestionVendedor} esVendedorAdministrador={esVendedorAdministrador}/>}

            {mostrarVentas && <Ventas HandleChangeVentaSeleccionado={HandleChangeVentaSeleccionado} informacionTienda={informacionTienda}/>}

            {mostrarDetalleVenta && <DetalleVenta setMostrarVentas={setMostrarVentas} setMostrarDetalleVenta={setMostrarDetalleVenta}
            setMostrarSeguimientoVendedor={setMostrarSeguimientoVendedor} VentaSeleccionada={VentaSeleccionada} informacionTienda={informacionTienda}/>}

            {mostrarMisProductos && <MisProductos setMostrarMisProductos={setMostrarMisProductos} setMostrarDetalleProducto={setMostrarDetalleProducto}
            setOpcionEditarProducto={setOpcionEditarProducto} setProductoInformacion={setProductoInformacion} setMostrarEditarProducto={setMostrarEditarProducto}
            informacionTienda={informacionTienda} setOpcionSeleccionado={setOpcionSeleccionado}/>}

            {mostrarDetalleProducto && <DetalleProductoVendedor setMostrarMisProductos={setMostrarMisProductos} setMostrarDetalleProducto={setMostrarDetalleProducto}
            productoInformacion={productoInformacion} handleChangeHistoria={handleChangeHistoria} OpcionSeleccionado={OpcionSeleccionado}
            setOpcionSeleccionado={setOpcionSeleccionado}/>}

            {mostrarEditarProducto && <EditarProducto setMostrarMisProductos={setMostrarMisProductos} setMostrarEditarProducto={setMostrarEditarProducto}
            opcionEditarProducto={opcionEditarProducto} informacionTienda={informacionTienda} productoInformacion={productoInformacion}/>}

            {historialProducto && <HistorialProducto setHistoriaProducto={setHistoriaProducto} setMostrarDetalleProducto={setMostrarDetalleProducto}
            productoInformacion={productoInformacion} setOpcionSeleccionado={setOpcionSeleccionado}/>}

            {mostrarSeguimientoVendedor && <SeguimientoVendedor informacionTienda={informacionTienda} HandleChangeSeguimientoSeleccionado={HandleChangeSeguimientoSeleccionado}/>}

            {mostrarDetalleSeguimiento && <DetalleSeguimientoVendedor setMostrarSeguimientoVendedor={setMostrarSeguimientoVendedor}
            setMostrarnDetalleSeguimiento={setMostrarnDetalleSeguimiento} SeguimientoSeleccionado={SeguimientoSeleccionado} informacionTienda={informacionTienda}/>}

            {mostrarReclamo && <ReclamoVendedor informacionTienda={informacionTienda}/>}

            {mostrarEstadisticaVendedor && <EstadisticaVendedor informacionTienda={informacionTienda}/>}

            {/* {mostrarBilletera && <BilleteraVendedor setMostrarBilletera={setMostrarBilletera} setMostrarnDetalleBilletera={setMostrarnDetalleBilletera}
            idUsuario={idUsuario}/>}

            {mostrarDetalleBilletera && <DetalleBilletera setMostrarBilletera={setMostrarBilletera} setMostrarnDetalleBilletera={setMostrarnDetalleBilletera}
            idUsuario={idUsuario}/>} */}

            {mostrarGestionVendedor && <GestionVendedor informacionTienda={informacionTienda}/>}
        </Box>
    </Box>
  )
}
