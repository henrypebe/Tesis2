import { Box, Button, Typography } from '@mui/material'
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function BarraLateralVendedor({mostrarInicio, setMostrarInicio, mostrarVentas, setMostrarVentas, mostrarMisProductos,
    setMostrarMisProductos, mostrarSeguimientoVendedor, setMostrarSeguimientoVendedor, mostrarReclamo, setMostrarReclamo,
    mostrarEstadisticaVendedor, setMostrarEstadisticaVendedor, mostrarBilletera, setMostrarBilletera, mostrarDetalleVenta,
    setMostrarDetalleVenta,mostrarDetalleProducto, setMostrarDetalleProducto, mostrarEditarProducto, setMostrarEditarProducto,
    mostrarDetalleSeguimiento, setMostrarnDetalleSeguimiento, mostrarDetalleBilletera, setMostrarnDetalleBilletera, historialProducto,
    setHistoriaProducto, mostrarGestionVendedor, setMostrarGestionVendedor, esVendedorAdministrador,
    estadoVendedor}) {
    
        const handleClickInicio = () => {
        setMostrarInicio(true);
        setMostrarVentas(false);
        setMostrarMisProductos(false);
        setMostrarSeguimientoVendedor(false);
        setMostrarReclamo(false);
        setMostrarEstadisticaVendedor(false);
        setMostrarBilletera(false);
        setMostrarDetalleVenta(false);
        setMostrarDetalleProducto(false);
        setMostrarEditarProducto(false);
        setMostrarnDetalleSeguimiento(false);
        setMostrarnDetalleBilletera(false);
        setMostrarGestionVendedor(false);
    };
    const handleClickVenta = () => {
        setMostrarInicio(false);
        setMostrarVentas(true);
        setMostrarMisProductos(false);
        setMostrarSeguimientoVendedor(false);
        setMostrarReclamo(false);
        setMostrarEstadisticaVendedor(false);
        setMostrarBilletera(false);
        setMostrarDetalleVenta(false);
        setMostrarDetalleProducto(false);
        setMostrarEditarProducto(false);
        setMostrarnDetalleSeguimiento(false);
        setMostrarnDetalleBilletera(false);
        setHistoriaProducto(false);
        setMostrarGestionVendedor(false);
    };
    const handleClickMisProductos = () => {
        setMostrarInicio(false);
        setMostrarVentas(false);
        setMostrarMisProductos(true);
        setMostrarSeguimientoVendedor(false);
        setMostrarReclamo(false);
        setMostrarEstadisticaVendedor(false);
        setMostrarBilletera(false);
        setMostrarDetalleVenta(false);
        setMostrarDetalleProducto(false);
        setMostrarEditarProducto(false);
        setMostrarnDetalleSeguimiento(false);
        setMostrarnDetalleBilletera(false);
        setHistoriaProducto(false);
        setMostrarGestionVendedor(false);
    };
    const handleClickSeguimiento = () => {
        setMostrarInicio(false);
        setMostrarVentas(false);
        setMostrarMisProductos(false);
        setMostrarSeguimientoVendedor(true);
        setMostrarReclamo(false);
        setMostrarEstadisticaVendedor(false);
        setMostrarBilletera(false);
        setMostrarDetalleVenta(false);
        setMostrarDetalleProducto(false);
        setMostrarEditarProducto(false);
        setMostrarnDetalleSeguimiento(false);
        setMostrarnDetalleBilletera(false);
        setHistoriaProducto(false);
        setMostrarGestionVendedor(false);
    };
    const handleClickReclamo = () => {
        setMostrarInicio(false);
        setMostrarVentas(false);
        setMostrarMisProductos(false);
        setMostrarSeguimientoVendedor(false);
        setMostrarReclamo(true);
        setMostrarEstadisticaVendedor(false);
        setMostrarBilletera(false);
        setMostrarDetalleVenta(false);
        setMostrarDetalleProducto(false);
        setMostrarEditarProducto(false);
        setMostrarnDetalleSeguimiento(false);
        setMostrarnDetalleBilletera(false);
        setHistoriaProducto(false);
        setMostrarGestionVendedor(false);
    };
    const handleClickEstadisticaVendedor = () => {
        setMostrarInicio(false);
        setMostrarVentas(false);
        setMostrarMisProductos(false);
        setMostrarSeguimientoVendedor(false);
        setMostrarReclamo(false);
        setMostrarEstadisticaVendedor(true);
        setMostrarBilletera(false);
        setMostrarDetalleVenta(false);
        setMostrarDetalleProducto(false);
        setMostrarEditarProducto(false);
        setMostrarnDetalleSeguimiento(false);
        setMostrarnDetalleBilletera(false);
        setHistoriaProducto(false);
        setMostrarGestionVendedor(false);
    };
    // const handleClickBilletera = () => {
    //     setMostrarInicio(false);
    //     setMostrarVentas(false);
    //     setMostrarMisProductos(false);
    //     setMostrarSeguimientoVendedor(false);
    //     setMostrarReclamo(false);
    //     setMostrarEstadisticaVendedor(false);
    //     setMostrarBilletera(true);
    //     setMostrarDetalleVenta(false);
    //     setMostrarDetalleProducto(false);
    //     setMostrarEditarProducto(false);
    //     setMostrarnDetalleSeguimiento(false);
    //     setMostrarnDetalleBilletera(false);
    //     setHistoriaProducto(false);
    // };
    const handleClickGestionVendedor = () =>{
        setMostrarInicio(false);
        setMostrarVentas(false);
        setMostrarMisProductos(false);
        setMostrarSeguimientoVendedor(false);
        setMostrarReclamo(false);
        setMostrarEstadisticaVendedor(false);
        setMostrarBilletera(false);
        setMostrarDetalleVenta(false);
        setMostrarDetalleProducto(false);
        setMostrarEditarProducto(false);
        setMostrarnDetalleSeguimiento(false);
        setMostrarnDetalleBilletera(false);
        setHistoriaProducto(false);
        setMostrarGestionVendedor(true);
    }
    
    return (
    <Box sx={{display:"flex", flexDirection:"column", maxHeight:"101%", minHeight:"101%", backgroundColor:"#D7B27B", marginTop:"-1.9px", padding:"10px",
    width:"230px"}}>
        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
            marginBottom:"10px", backgroundColor: mostrarInicio? "#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
            onClick={handleClickInicio}
            >
            <HomeIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold"}}>Inicio</Typography>
        </Button>
        
        {estadoVendedor === 1 && (
            <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
                marginBottom:"10px", backgroundColor: mostrarVentas || mostrarDetalleVenta? "#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
                onClick={handleClickVenta}
                >
                <MonetizationOnIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold"}}>Ventas</Typography>
            </Button>
        )}

        {estadoVendedor === 1 && (
            <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
                marginBottom:"10px", backgroundColor: mostrarMisProductos || mostrarDetalleProducto || mostrarEditarProducto || historialProducto?
                 "#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
                onClick={handleClickMisProductos}
                >
                <ShoppingBagIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold"}}>Mis productos</Typography>
            </Button>
        )}

        {estadoVendedor === 1 && (
            <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
                marginBottom:"10px", backgroundColor: mostrarSeguimientoVendedor || mostrarDetalleSeguimiento? "#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
                onClick={handleClickSeguimiento}
                >
                <ChatBubbleOutlineIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold"}}>Seguimientos</Typography>
            </Button>
        )}

        {estadoVendedor === 1 && (
            <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
                marginBottom:"10px", backgroundColor: mostrarReclamo? "#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
                onClick={handleClickReclamo}
                >
                <NewReleasesIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold"}}>Reclamo</Typography>
            </Button>
        )}

        {estadoVendedor === 1 && (
            <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
                marginBottom:"10px", backgroundColor: mostrarEstadisticaVendedor? "#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
                onClick={handleClickEstadisticaVendedor}
                >
                <SignalCellularAltIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold"}}>Estadistica</Typography>
            </Button>
        )}
{/* 
        <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
            marginBottom:"10px", backgroundColor: mostrarBilletera || mostrarDetalleBilletera? "#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
            onClick={handleClickBilletera}
            >
            <AccountBalanceWalletIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold"}}>Billetera</Typography>
        </Button> */}

        {esVendedorAdministrador && (
            <Button variant="contained" sx={{display:"flex", justifyContent:"flex-start",
                marginBottom:"10px", backgroundColor: mostrarGestionVendedor? "#FFFFFF":"#CACACA", '&:hover': {backgroundColor:"#CACACA"}}}
                onClick={handleClickGestionVendedor}
            >
                <PeopleOutlineIcon sx={{color:"black", marginLeft:"-10px", marginRight:"5px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold", textAlign:"left", width:"60%"}}>Gestión de vendedores</Typography>
            </Button>
        )}
    </Box>
  )
}
