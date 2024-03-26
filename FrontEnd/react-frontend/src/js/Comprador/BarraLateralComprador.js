import { Box, Button, Typography } from '@mui/material'
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function BarraLateralComprador({mostrarInicio, onMostrarInicioChange, mostrarPedidos, onMostrarPedidosChange, mostrarProductos,
    setMostrarProductos, mostrarSeguimiento, setMostrarSeguimiento, mostrarEstadistica, setMostrarEstadistica, mostrarMetodoPago,
    setMostrarMetodoPago, mostrarDetalleProducto, setMostrarDetalleProducto, mostrarCarrito, setMostrarCarrito}) {
    const handleClickInicio = () => {
        onMostrarInicioChange(true);
        onMostrarPedidosChange(false);
        setMostrarProductos(false);
        setMostrarSeguimiento(false);
        setMostrarEstadistica(false);
        setMostrarMetodoPago(false);
        setMostrarDetalleProducto(false);
        setMostrarCarrito(false);
    };

    const handleClickPedidos = () => {
        onMostrarInicioChange(false);
        onMostrarPedidosChange(true);
        setMostrarProductos(false);
        setMostrarSeguimiento(false);
        setMostrarEstadistica(false);
        setMostrarMetodoPago(false);
        setMostrarDetalleProducto(false);
        setMostrarCarrito(false);
    };

    const handleClickProductos = () => {
        onMostrarInicioChange(false);
        onMostrarPedidosChange(false);
        setMostrarProductos(true);
        setMostrarSeguimiento(false);
        setMostrarEstadistica(false);
        setMostrarMetodoPago(false);
        setMostrarDetalleProducto(false);
        setMostrarCarrito(false);
    };

    const handleClickSeguimiento = () => {
        onMostrarInicioChange(false);
        onMostrarPedidosChange(false);
        setMostrarProductos(false);
        setMostrarSeguimiento(true);
        setMostrarEstadistica(false);
        setMostrarMetodoPago(false);
        setMostrarDetalleProducto(false);
        setMostrarCarrito(false);
    };
  
    const handleClickEstadistica = () => {
        onMostrarInicioChange(false);
        onMostrarPedidosChange(false);
        setMostrarProductos(false);
        setMostrarSeguimiento(false);
        setMostrarEstadistica(true);
        setMostrarMetodoPago(false);
        setMostrarDetalleProducto(false);
        setMostrarCarrito(false);
    };

    const handleClickMetodoPago = () => {
        onMostrarInicioChange(false);
        onMostrarPedidosChange(false);
        setMostrarProductos(false);
        setMostrarSeguimiento(false);
        setMostrarEstadistica(false);
        setMostrarMetodoPago(true);
        setMostrarDetalleProducto(false);
        setMostrarCarrito(false);
    };

    return (
    <Box sx={{display:"flex", flexDirection:"column", maxHeight:"100%", minHeight:"100%", backgroundColor:"#777575", marginTop:"-1.9px", padding:"10px"}}>
        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
            marginBottom:"10px", backgroundColor: mostrarInicio? "#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
            onClick={handleClickInicio}
            >
            <HomeIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold"}}>Inicio</Typography>
        </Button>
        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start", marginBottom:"10px",
            backgroundColor:mostrarPedidos?"#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
            onClick={handleClickPedidos}
            >
            <ShoppingCartIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold"}}>Pedidos</Typography>
        </Button>
        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start", marginBottom:"10px",
            backgroundColor:mostrarProductos || mostrarDetalleProducto || mostrarCarrito?"#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
            onClick={handleClickProductos}
            >
            <CategoryIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold"}}>Productos</Typography>
        </Button>
        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start", marginBottom:"10px",
            backgroundColor:mostrarSeguimiento?"#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
            onClick={handleClickSeguimiento}
            >
            <ChatBubbleOutlineIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold"}}>Seguimiento</Typography>
        </Button>
        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start", marginBottom:"10px",
            backgroundColor:mostrarEstadistica?"#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
            onClick={handleClickEstadistica}
            >
            <SignalCellularAltIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold"}}>Estadistica</Typography>
        </Button>
        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start", marginBottom:"10px",
            backgroundColor:mostrarMetodoPago?"#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
            onClick={handleClickMetodoPago}
            >
            <CreditCardIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold"}}>Método de pago</Typography>
        </Button>
    </Box>
  )
}
