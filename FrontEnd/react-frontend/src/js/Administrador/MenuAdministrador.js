import { Box } from '@mui/material'
import React, { useState } from 'react'
import BarraSuperior from '../Comprador/BarraSuperior'
import BarraLateralAdministrador from './BarraLateralAdministrador';
import InicioAdministrador from './InicioAdministrador';
import EstadisticaAdministrador from './EstadisticaAdministrador';
import DetallePedidoAdministrador from './DetallePedidoAdministrador';
import GestionAprobacion from './GestionAprobacion';
import DetalleProductoAdministrador from './DetalleProductoAdministrador';
import { useParams } from 'react-router-dom';
import GestionAprobacionTienda from './GestionAprobacionTienda';
import DetalleTienda from './DetalleTienda';

export default function MenuAdministrador() {
  const { idUsuario } = useParams();
  const [opcionAdministrador] = useState(true);
  const [mostrarInicio, setMostrarInicio] = useState(true);
  const [mostrarEstadistica, setMostrarEstadistica] = useState(false);
  const [mostrarGestionAprobacion, setMostrarGestionAprobacion] = useState(false);
  const [mostrarGestionAprobacionTienda, setMostrarGestionAprobacionTienda] = useState(false);
  const [mostrarDetalleTienda, setMostrarDetalleTienda] = useState(false);

  const [mostrarPedidoDetalle, setMostrarPedidoDetalle] = useState(false);
  const [mostrarProductoDetalle, setMostrarProductoDetalle] = useState(false);

  const [ProductoSeleccionado, setMostrarProductoSeleccionado] = useState(false);
  const [PedidoSeleccionado, setPedidoSeleccionado] = useState(false);
  const [TiendaSeleccionado, setTiendaSeleccionado] = useState(false);

  const handleChangeProductoSeleccionado = (producto) =>{
    setMostrarProductoSeleccionado(producto);
    setMostrarGestionAprobacion(false);
    setMostrarProductoDetalle(true);
  }

  const handleChangePedidoSeleccionado = (pedido) =>{
    setPedidoSeleccionado(pedido);
    setMostrarEstadistica(false);
    setMostrarPedidoDetalle(true);
  }

  const handleChangeTiendaSeleccionado = (tienda) =>{
    setTiendaSeleccionado(tienda);
    setMostrarGestionAprobacionTienda(false);
    setMostrarDetalleTienda(true);
  }

    return (
    <Box sx={{display:"flex", flexDirection:"column"}}>
        <BarraSuperior opcionAdministrador={opcionAdministrador} idUsuario={idUsuario}/>

        <Box sx={{display:"flex", flexDirection:"row"}}>
            <BarraLateralAdministrador mostrarInicio={mostrarInicio} setMostrarInicio={setMostrarInicio} mostrarEstadistica={mostrarEstadistica}
              setMostrarEstadistica={setMostrarEstadistica} mostrarGestionAprobacion={mostrarGestionAprobacion}
              setMostrarGestionAprobacion={setMostrarGestionAprobacion} mostrarPedidoDetalle={mostrarPedidoDetalle}
              setMostrarPedidoDetalle={setMostrarPedidoDetalle} mostrarProductoDetalle={mostrarProductoDetalle}
              setMostrarProductoDetalle={setMostrarProductoDetalle} mostrarGestionAprobacionTienda={mostrarGestionAprobacionTienda}
              setMostrarGestionAprobacionTienda={setMostrarGestionAprobacionTienda} mostrarDetalleTienda={mostrarDetalleTienda}
              setMostrarDetalleTienda={setMostrarDetalleTienda}
            />
            {mostrarInicio && <InicioAdministrador setMostrarInicio={setMostrarInicio} setMostrarEstadistica={setMostrarEstadistica}
            setMostrarGestionAprobacion={setMostrarGestionAprobacion} setMostrarGestionAprobacionTienda={setMostrarGestionAprobacionTienda}/>}

            {mostrarEstadistica && <EstadisticaAdministrador handleChangePedidoSeleccionado={handleChangePedidoSeleccionado}/>}

            {mostrarPedidoDetalle && <DetallePedidoAdministrador setMostrarEstadistica={setMostrarEstadistica}
            setMostrarPedidoDetalle={setMostrarPedidoDetalle} PedidoSeleccionado={PedidoSeleccionado}/>}

            {mostrarGestionAprobacion && <GestionAprobacion setMostrarGestionAprobacion={setMostrarGestionAprobacion}
            setMostrarProductoDetalle={setMostrarProductoDetalle} handleChangeProductoSeleccionado={handleChangeProductoSeleccionado}/>}

            {mostrarProductoDetalle && <DetalleProductoAdministrador setMostrarGestionAprobacion={setMostrarGestionAprobacion}
            setMostrarProductoDetalle={setMostrarProductoDetalle} ProductoSeleccionado={ProductoSeleccionado}/>}

            {mostrarGestionAprobacionTienda && <GestionAprobacionTienda handleChangeTiendaSeleccionado={handleChangeTiendaSeleccionado}/>}

            {mostrarDetalleTienda && <DetalleTienda setMostrarGestionAprobacionTienda={setMostrarGestionAprobacionTienda}
            setMostrarDetalleTienda={setMostrarDetalleTienda} TiendaSeleccionado={TiendaSeleccionado}/>}
        </Box>
    </Box>
  )
}
