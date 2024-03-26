import { Box } from '@mui/material'
import React, { useState } from 'react'
import BarraSuperior from './BarraSuperior'
import BarraLateralComprador from './BarraLateralComprador'
import InicioComprador from './InicioComprador';
import PedidoComprador from './PedidoComprador';
import ProductoComprador from './ProductoComprador';

export default function MenuComprador() {
  const [mostrarInicio, setMostrarInicio] = useState(true);
  const [mostrarPedidos, setMostrarPedidos] = useState(false);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [mostrarSeguimiento, setMostrarSeguimiento] = useState(false);
  const [mostrarEstadistica, setMostrarEstadistica] = useState(false);
  const [mostrarMetodoPago, setMostrarMetodoPago] = useState(false);

  return (
    <Box sx={{display:"flex", flexDirection:"column"}}>
      <BarraSuperior />
      <Box sx={{display:"flex", flexDirection:"row"}}>
        <BarraLateralComprador mostrarInicio={mostrarInicio} onMostrarInicioChange={setMostrarInicio}
          mostrarPedidos={mostrarPedidos} onMostrarPedidosChange={setMostrarPedidos} mostrarProductos={mostrarProductos}
          setMostrarProductos={setMostrarProductos} mostrarSeguimiento={mostrarSeguimiento} setMostrarSeguimiento={setMostrarSeguimiento}
          mostrarEstadistica={mostrarEstadistica} setMostrarEstadistica={setMostrarEstadistica} mostrarMetodoPago={mostrarMetodoPago}
          setMostrarMetodoPago={setMostrarMetodoPago}
          />
        {mostrarInicio && <InicioComprador />}
        {mostrarPedidos && <PedidoComprador />}
        {mostrarProductos && <ProductoComprador />}
      </Box>
    </Box>
  )
}
