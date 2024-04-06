import React from 'react';
import { Box, Button, Typography } from '@mui/material'
import LineaDetalleProductoVisualizar from './LineaDetalleProductoVisualizar';

export default function HistorialProducto({setHistoriaProducto, setMostrarDetalleProducto, productoInformacion}) {

    const handleChange = () =>{
        setMostrarDetalleProducto(true);
        setHistoriaProducto(false);
    }

    return (
    <Box sx={{padding:"20px", width:"85.65%", marginTop:"-1.9px", minHeight:"85vh", maxHeight:"85vh"}}>
        <Box sx={{display:"flex", flexDirection:"row"}}>
            
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"90%"}}>Historial de cambios</Typography>

            <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
                fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleChange}>
                Atrás
            </Button>

        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <LineaDetalleProductoVisualizar fechaCambio={"24/03/2024"} descripcionCambio={"Cambio en el titulo"}/>
    </Box>
  )
}
