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

export default function MenuAdministrador() {
  const { idUsuario } = useParams();
  const [opcionAdministrador] = useState(true);
  const [mostrarInicio, setMostrarInicio] = useState(true);
  const [mostrarEstadistica, setMostrarEstadistica] = useState(false);
  const [mostrarGestionAprobacion, setMostrarGestionAprobacion] = useState(false);

  const [mostrarPedidoDetalle, setMostrarPedidoDetalle] = useState(false);
  const [mostrarProductoDetalle, setMostrarProductoDetalle] = useState(false);

  const [ProductoSeleccionado, setMostrarProductoSeleccionado] = useState(false);
  const [PedidoSeleccionado, setPedidoSeleccionado] = useState(false);

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

    return (
    <Box sx={{display:"flex", flexDirection:"column"}}>
        <BarraSuperior opcionAdministrador={opcionAdministrador} idUsuario={idUsuario}/>

        <Box sx={{display:"flex", flexDirection:"row"}}>
            <BarraLateralAdministrador mostrarInicio={mostrarInicio} setMostrarInicio={setMostrarInicio} mostrarEstadistica={mostrarEstadistica}
            setMostrarEstadistica={setMostrarEstadistica} mostrarGestionAprobacion={mostrarGestionAprobacion}
            setMostrarGestionAprobacion={setMostrarGestionAprobacion} mostrarPedidoDetalle={mostrarPedidoDetalle}
            setMostrarPedidoDetalle={setMostrarPedidoDetalle} mostrarProductoDetalle={mostrarProductoDetalle}
            setMostrarProductoDetalle={setMostrarProductoDetalle}
            />
            {mostrarInicio && <InicioAdministrador setMostrarInicio={setMostrarInicio} setMostrarEstadistica={setMostrarEstadistica}
            setMostrarGestionAprobacion={setMostrarGestionAprobacion} />}

            {mostrarEstadistica && <EstadisticaAdministrador handleChangePedidoSeleccionado={handleChangePedidoSeleccionado}/>}

            {mostrarPedidoDetalle && <DetallePedidoAdministrador setMostrarEstadistica={setMostrarEstadistica}
            setMostrarPedidoDetalle={setMostrarPedidoDetalle} PedidoSeleccionado={PedidoSeleccionado}/>}

            {mostrarGestionAprobacion && <GestionAprobacion setMostrarGestionAprobacion={setMostrarGestionAprobacion}
            setMostrarProductoDetalle={setMostrarProductoDetalle} handleChangeProductoSeleccionado={handleChangeProductoSeleccionado}/>}

            {mostrarProductoDetalle && <DetalleProductoAdministrador setMostrarGestionAprobacion={setMostrarGestionAprobacion}
            setMostrarProductoDetalle={setMostrarProductoDetalle} ProductoSeleccionado={ProductoSeleccionado}/>}
        </Box>
    </Box>
  )
}
