import { Box } from '@mui/material'
import React, { useState } from 'react'
import BarraSuperior from '../Comprador/BarraSuperior'
import BarraLateralAdministrador from './BarraLateralAdministrador';
import InicioAdministrador from './InicioAdministrador';
import EstadisticaAdministrador from './EstadisticaAdministrador';
import DetallePedidoAdministrador from './DetallePedidoAdministrador';
import GestionAprobacion from './GestionAprobacion';
import DetalleProductoAdministrador from './DetalleProductoAdministrador';
// import { useParams } from 'react-router-dom';

export default function MenuAdministrador() {
  // const { idUsuario } = useParams();
  const [opcionAdministrador] = useState(true);
  const [mostrarInicio, setMostrarInicio] = useState(true);
  const [mostrarEstadistica, setMostrarEstadistica] = useState(false);
  const [mostrarGestionAprobacion, setMostrarGestionAprobacion] = useState(false);

  const [mostrarPedidoDetalle, setMostrarPedidoDetalle] = useState(false);
  const [mostrarProductoDetalle, setMostrarProductoDetalle] = useState(false);
    return (
    <Box sx={{display:"flex", flexDirection:"column"}}>
        <BarraSuperior opcionAdministrador={opcionAdministrador}/>

        <Box sx={{display:"flex", flexDirection:"row"}}>
            <BarraLateralAdministrador mostrarInicio={mostrarInicio} setMostrarInicio={setMostrarInicio} mostrarEstadistica={mostrarEstadistica}
            setMostrarEstadistica={setMostrarEstadistica} mostrarGestionAprobacion={mostrarGestionAprobacion}
            setMostrarGestionAprobacion={setMostrarGestionAprobacion} mostrarPedidoDetalle={mostrarPedidoDetalle}
            setMostrarPedidoDetalle={setMostrarPedidoDetalle} mostrarProductoDetalle={mostrarProductoDetalle}
            setMostrarProductoDetalle={setMostrarProductoDetalle}
            />
            {mostrarInicio && <InicioAdministrador setMostrarInicio={setMostrarInicio} setMostrarEstadistica={setMostrarEstadistica}
            setMostrarGestionAprobacion={setMostrarGestionAprobacion} />}

            {mostrarEstadistica && <EstadisticaAdministrador setMostrarEstadistica={setMostrarEstadistica}
            setMostrarPedidoDetalle={setMostrarPedidoDetalle}/>}

            {mostrarPedidoDetalle && <DetallePedidoAdministrador setMostrarEstadistica={setMostrarEstadistica}
            setMostrarPedidoDetalle={setMostrarPedidoDetalle}/>}

            {mostrarGestionAprobacion && <GestionAprobacion setMostrarGestionAprobacion={setMostrarGestionAprobacion}
            setMostrarProductoDetalle={setMostrarProductoDetalle}/>}

            {mostrarProductoDetalle && <DetalleProductoAdministrador setMostrarGestionAprobacion={setMostrarGestionAprobacion}
            setMostrarProductoDetalle={setMostrarProductoDetalle}/>}
        </Box>
    </Box>
  )
}
