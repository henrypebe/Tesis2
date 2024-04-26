import { Box, Button, Typography } from '@mui/material'
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function BarraLateralAdministrador({mostrarInicio, setMostrarInicio, mostrarEstadistica, setMostrarEstadistica,
    mostrarGestionAprobacion, setMostrarGestionAprobacion, mostrarPedidoDetalle, setMostrarPedidoDetalle,
    mostrarProductoDetalle, setMostrarProductoDetalle, mostrarGestionAprobacionTienda, setMostrarGestionAprobacionTienda,
    mostrarDetalleTienda, setMostrarDetalleTienda}) {
    const handleClickInicio = () => {
        setMostrarInicio(true);
        setMostrarEstadistica(false);
        setMostrarGestionAprobacion(false);
        setMostrarPedidoDetalle(false);
        setMostrarProductoDetalle(false);
        setMostrarGestionAprobacionTienda(false);
        setMostrarDetalleTienda(false);
    };

    const handleClickEstadistica = () => {
        setMostrarInicio(false);
        setMostrarEstadistica(true);
        setMostrarGestionAprobacion(false);
        setMostrarPedidoDetalle(false);
        setMostrarProductoDetalle(false);
        setMostrarGestionAprobacionTienda(false);
        setMostrarDetalleTienda(false);
    };

    const handleClickAprobacion = () => {
        setMostrarInicio(false);
        setMostrarEstadistica(false);
        setMostrarGestionAprobacion(true);
        setMostrarPedidoDetalle(false);
        setMostrarProductoDetalle(false);
        setMostrarGestionAprobacionTienda(false);
        setMostrarDetalleTienda(false);
    };

    const handleClickAprobacionTienda = () => {
        setMostrarInicio(false);
        setMostrarEstadistica(false);
        setMostrarGestionAprobacion(false);
        setMostrarPedidoDetalle(false);
        setMostrarProductoDetalle(false);
        setMostrarGestionAprobacionTienda(true);
        setMostrarDetalleTienda(false);
    };

  return (
    <Box sx={{display:"flex", flexDirection:"column", maxHeight:"100%", minHeight:"100%", backgroundColor:"#D7B27B", marginTop:"-1.9px", padding:"10px",
        width:"270px"}}>
        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
            marginBottom:"10px", backgroundColor: mostrarInicio? "#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
            onClick={handleClickInicio}
            >
            <HomeIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold"}}>Inicio</Typography>
        </Button>
        
        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
            marginBottom:"10px", backgroundColor: mostrarEstadistica || mostrarPedidoDetalle? "#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
            onClick={handleClickEstadistica}
            >
            <SignalCellularAltIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold"}}>Estadistica</Typography>
        </Button>

        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
            marginBottom:"10px", backgroundColor: mostrarGestionAprobacion || mostrarProductoDetalle? "#FFFFFF":"#CACACA", '&:hover': 
            {backgroundColor:"#CACACA"}}}
            onClick={handleClickAprobacion}
            >
            <VerifiedIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", textAlign:"left"}}>Gestión de aprobaciones de productos</Typography>
        </Button>

        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
            marginBottom:"10px", backgroundColor: mostrarGestionAprobacionTienda || mostrarDetalleTienda ? "#FFFFFF":"#CACACA", '&:hover': 
            {backgroundColor:"#CACACA"}}}
            onClick={handleClickAprobacionTienda}
            >
            <img src='https://cdn-icons-png.flaticon.com/512/1067/1067602.png' alt='' style={{height:"20px", marginLeft:"-10px",marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", textAlign:"left"}}>Gestión de aprobaciones de tiendas</Typography>
        </Button>
    </Box>
  )
}
