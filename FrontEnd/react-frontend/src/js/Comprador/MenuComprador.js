import { Box } from '@mui/material'
import React, { useState } from 'react'
import BarraSuperior from './BarraSuperior'
import BarraLateralComprador from './BarraLateralComprador'
import InicioComprador from './InicioComprador';
import PedidoComprador from './PedidoComprador';
import ProductoComprador from './ProductoComprador';
import DetalleProducto from './DetalleProducto';
import CarritoCompra from './CarritoCompra';
import DetallePedido from './DetallePedido';
import MetodoPago from './MetodoPago';
import SeguimientoComprador from './SeguimientoComprador';
import DetalleSeguimiento from './DetalleSeguimiento';
import ReclamoComprador from './ReclamoComprador';
import EstadisticaComprador from './EstadisticaComprador';
import MetodoPagoAdicionar from './MetodoPagoAdicionar';
import MetodoPagoAumento from './MetodoPagoAumento';
import { useParams } from 'react-router-dom';
import DetalleReclamo from './DetalleReclamo';

export default function MenuComprador() {
  const [mostrarInicio, setMostrarInicio] = useState(true);
  const [mostrarPedidos, setMostrarPedidos] = useState(false);
  const [mostrarDetallePedido, setMostrarDetallePedido] = useState(false);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [mostrarEstadistica, setMostrarEstadistica] = useState(false);
  const [mostrarMetodoPagoAdicionar, setMostrarMetodoPagoAdicionar] = useState(false);
  const [mostrarDetalleProducto, setMostrarDetalleProducto] = useState(false);
  const [mostrarMetodoPago, setMostrarMetodoPago] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarOpcionCarrito, setMostrarOpcionCarrito] = useState(0);
  const [mostrarSeguimiento, setMostrarSeguimiento] = useState(false);
  const [mostrarDetalleSeguimiento, setMostrarDetalleSeguimiento] = useState(false);
  const [mostrarReclamo, setMostrarReclamo] = useState(false);
  const [mostrarMetodoPagoAumento, setMetodoPagoAumento] = useState(false);
  const [mostrarDetalleReclamo, setDetalleReclamo] = useState(false);

  const { idUsuario } = useParams();

  const [ProductoSeleccionado, setProductoSeleccionado] = useState();
  const [PedidoSeleccionado, setPedidoSeleccionado] = useState();
  const [SeguimientoSeleccionado, setSeguimientoSeleccionado] = useState();
  const [conteoCarritoCompra, setConteoCarritoCompra] = useState(0);
  const [productos, setProductos] = useState([]);
  const [ReclamoSeleccionado, setReclamoSeleccionado] = useState();

  const HandleChangeProductoSeleccionado = (producto) =>{
    setProductoSeleccionado(producto);
    setMostrarDetalleProducto(true);
    setMostrarProductos(false);
  }

  const HandleChangePedidoSeleccionado = (pedido) =>{
    setPedidoSeleccionado(pedido);
    setMostrarDetallePedido(true);
    setMostrarPedidos(false);
  }

  const HandleChangeSeguimientoSeleccionado = (seguimiento) =>{
    setSeguimientoSeleccionado(seguimiento);
    setMostrarDetalleSeguimiento(true);
    setMostrarSeguimiento(false);
  }

  const HandleChangeReclamoSeleccionado = (reclamo) =>{
    setReclamoSeleccionado(reclamo);
    setDetalleReclamo(true);
    setMostrarReclamo(false);
  }

  return (
    <Box sx={{display:"flex", flexDirection:"column"}}>
      <BarraSuperior idUsuario={idUsuario} />
      <Box sx={{display:"flex", flexDirection:"row"}}>
        <BarraLateralComprador mostrarInicio={mostrarInicio} onMostrarInicioChange={setMostrarInicio}
          mostrarPedidos={mostrarPedidos} onMostrarPedidosChange={setMostrarPedidos} mostrarProductos={mostrarProductos}
          setMostrarProductos={setMostrarProductos} mostrarSeguimiento={mostrarSeguimiento} setMostrarSeguimiento={setMostrarSeguimiento}
          mostrarEstadistica={mostrarEstadistica} setMostrarEstadistica={setMostrarEstadistica} mostrarMetodoPagoAdicionar={mostrarMetodoPagoAdicionar}
          setMostrarMetodoPagoAdicionar={setMostrarMetodoPagoAdicionar} mostrarDetalleProducto={mostrarDetalleProducto} setMostrarDetalleProducto={setMostrarDetalleProducto}
          mostrarMetodoPago={mostrarMetodoPago} setMostrarMetodoPago={setMostrarMetodoPago} mostrarDetallePedido={mostrarDetallePedido}
          setMostrarDetallePedido={setMostrarDetallePedido} mostrarCarrito={mostrarCarrito} setMostrarCarrito={setMostrarCarrito} 
          mostrarDetalleSeguimiento={mostrarDetalleSeguimiento} setMostrarDetalleSeguimiento={setMostrarDetalleSeguimiento}
          mostrarReclamo={mostrarReclamo} setMostrarReclamo={setMostrarReclamo} mostrarMetodoPagoAumento={mostrarMetodoPagoAumento}
          setMetodoPagoAumento={setMetodoPagoAumento} setConteoCarritoCompra={setConteoCarritoCompra} setProductos={setProductos}
          mostrarDetalleReclamo={mostrarDetalleReclamo} setDetalleReclamo={setDetalleReclamo}
          />
        {mostrarInicio && <InicioComprador onMostrarInicioChange={setMostrarInicio} onMostrarPedidosChange={setMostrarPedidos} 
        setMostrarProductos={setMostrarProductos} setMostrarSeguimiento={setMostrarSeguimiento}
        setMostrarEstadistica={setMostrarEstadistica} setMostrarMetodoPago={setMostrarMetodoPago} setMostrarReclamo={setMostrarReclamo}
        idUsuario={idUsuario}/>}

        {mostrarPedidos && <PedidoComprador idUsuario={idUsuario} HandleChangePedidoSeleccionado={HandleChangePedidoSeleccionado}
        />}

        {mostrarDetallePedido && <DetallePedido setMostrarDetallePedido={setMostrarDetallePedido} setMostrarPedidos={setMostrarPedidos}
        setMostrarSeguimiento={setMostrarSeguimiento} PedidoSeleccionado={PedidoSeleccionado} idUsuario={idUsuario}/>}

        {mostrarProductos && <ProductoComprador setMostrarDetalleProducto={setMostrarDetalleProducto} setMostrarProductos={setMostrarProductos}
        setMostrarCarrito={setMostrarCarrito} setMostrarOpcionCarrito={setMostrarOpcionCarrito} HandleChangeProductoSeleccionado={HandleChangeProductoSeleccionado}
        conteoCarritoCompra={conteoCarritoCompra}
        />}

        {mostrarDetalleProducto && <DetalleProducto setMostrarDetalleProducto={setMostrarDetalleProducto} setMostrarProductos={setMostrarProductos}
        setMostrarMetodoPago={setMostrarMetodoPago} setMostrarOpcionCarrito={setMostrarOpcionCarrito} setMostrarCarrito={setMostrarCarrito}
        ProductoSeleccionado={ProductoSeleccionado} conteoCarritoCompra={conteoCarritoCompra} setConteoCarritoCompra={setConteoCarritoCompra}
        setProductos={setProductos} productos={productos}
        />}

        {mostrarMetodoPago && <MetodoPago setMostrarMetodoPago={setMostrarMetodoPago} setMostrarProductos={setMostrarProductos}
          productos={productos} conteoCarritoCompra={conteoCarritoCompra} setProductos={setProductos} setConteoCarritoCompra={setConteoCarritoCompra}
          idUsuario={idUsuario}
        />}

        {mostrarCarrito && <CarritoCompra setMostrarCarrito={setMostrarCarrito} setMostrarProductos={setMostrarProductos}
        mostrarOpcionCarrito={mostrarOpcionCarrito} setMostrarDetalleProducto={setMostrarDetalleProducto} setMostrarMetodoPago={setMostrarMetodoPago}
        productos={productos} setProductos={setProductos} setConteoCarritoCompra={setConteoCarritoCompra} conteoCarritoCompra={conteoCarritoCompra}
        />}
        
        {mostrarSeguimiento && <SeguimientoComprador HandleChangeSeguimientoSeleccionado={HandleChangeSeguimientoSeleccionado} idUsuario={idUsuario}/>}

        {mostrarDetalleSeguimiento && <DetalleSeguimiento setMostrarSeguimiento={setMostrarSeguimiento} setMostrarDetalleSeguimiento={setMostrarDetalleSeguimiento}
        SeguimientoSeleccionado={SeguimientoSeleccionado} idUsuario={idUsuario}/>}

        {mostrarReclamo && <ReclamoComprador idUsuario={idUsuario} HandleChangeReclamoSeleccionado={HandleChangeReclamoSeleccionado}/>}

        {mostrarDetalleReclamo && <DetalleReclamo ReclamoSeleccionado={ReclamoSeleccionado} setMostrarReclamo={setMostrarReclamo}
        setDetalleReclamo={setDetalleReclamo} setReclamoSeleccionado={setReclamoSeleccionado}/>}

        {mostrarEstadistica && <EstadisticaComprador idUsuario={idUsuario}/>}

        {mostrarMetodoPagoAdicionar && <MetodoPagoAdicionar setMostrarMetodoPagoAdicionar={setMostrarMetodoPagoAdicionar}
        setMetodoPagoAumento={setMetodoPagoAumento}/>}

        {mostrarMetodoPagoAumento && <MetodoPagoAumento setMostrarMetodoPagoAdicionar={setMostrarMetodoPagoAdicionar}
        setMetodoPagoAumento={setMetodoPagoAumento}/>}

      </Box>
    </Box>
  )
}
