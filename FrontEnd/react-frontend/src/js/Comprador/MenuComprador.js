import { Box } from '@mui/material'
import React, { useState } from 'react'
import BarraSuperior from './BarraSuperior'
import BarraLateralComprador from './BarraLateralComprador'
import InicioComprador from './InicioComprador';
import PedidoComprador from './PedidoComprador';
import ProductoComprador from './ProductoComprador';
import DetalleProducto from './DetalleProducto';
import CarritoCompra from './CarritoCompra';

export default function MenuComprador() {
  const [mostrarInicio, setMostrarInicio] = useState(true);
  const [mostrarPedidos, setMostrarPedidos] = useState(false);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [mostrarSeguimiento, setMostrarSeguimiento] = useState(false);
  const [mostrarEstadistica, setMostrarEstadistica] = useState(false);
  const [mostrarMetodoPago, setMostrarMetodoPago] = useState(false);
  const [mostrarDetalleProducto, setMostrarDetalleProducto] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  return (
    <Box sx={{display:"flex", flexDirection:"column"}}>
      <BarraSuperior />
      <Box sx={{display:"flex", flexDirection:"row"}}>
        <BarraLateralComprador mostrarInicio={mostrarInicio} onMostrarInicioChange={setMostrarInicio}
          mostrarPedidos={mostrarPedidos} onMostrarPedidosChange={setMostrarPedidos} mostrarProductos={mostrarProductos}
          setMostrarProductos={setMostrarProductos} mostrarSeguimiento={mostrarSeguimiento} setMostrarSeguimiento={setMostrarSeguimiento}
          mostrarEstadistica={mostrarEstadistica} setMostrarEstadistica={setMostrarEstadistica} mostrarMetodoPago={mostrarMetodoPago}
          setMostrarMetodoPago={setMostrarMetodoPago} mostrarDetalleProducto={mostrarDetalleProducto} setMostrarDetalleProducto={setMostrarDetalleProducto}
          mostrarCarrito={mostrarCarrito} setMostrarCarrito={setMostrarCarrito}
          />
        {mostrarInicio && <InicioComprador onMostrarInicioChange={setMostrarInicio} onMostrarPedidosChange={setMostrarPedidos} 
        setMostrarProductos={setMostrarProductos} setMostrarSeguimiento={setMostrarSeguimiento}
        setMostrarEstadistica={setMostrarEstadistica} setMostrarMetodoPago={setMostrarMetodoPago}/>}
        {mostrarPedidos && <PedidoComprador />}
        {mostrarProductos && <ProductoComprador setMostrarDetalleProducto={setMostrarDetalleProducto} setMostrarProductos={setMostrarProductos}/>}
        {mostrarDetalleProducto && <DetalleProducto setMostrarDetalleProducto={setMostrarDetalleProducto} setMostrarProductos={setMostrarProductos}
        setMostrarCarrito={setMostrarCarrito}/>}
        {mostrarCarrito && <CarritoCompra />}
      </Box>
    </Box>
  )
}
