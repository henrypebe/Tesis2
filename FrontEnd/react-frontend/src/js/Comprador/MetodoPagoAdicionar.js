import { Box, Button, Typography } from '@mui/material'
import React from 'react';
import CardMetodoPagoAdicionar from './CardMetodoPagoAdicionar';

export default function MetodoPagoAdicionar({setMostrarMetodoPagoAdicionar, setMetodoPagoAumento}) {
  const handleChangePantalla = () =>{
    setMostrarMetodoPagoAdicionar(false);
    setMetodoPagoAumento(true);
  }
  
    return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"88vh", maxHeight:"88vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Métodos de pago</Typography>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{height:"560px", display:"flex",flexDirection:"column", alignItems:"center", overflowY:"scroll"}}>
            <CardMetodoPagoAdicionar />
            <CardMetodoPagoAdicionar />
        </Box>

        <Box sx={{display:"flex", justifyContent:"center"}}>
            <Button
                variant="contained"
                sx={{
                backgroundColor: "#1C2536",
                width: "70%",
                "&:hover": { backgroundColor: "#1C2536" },
                }}
                onClick={handleChangePantalla}
            >
                Agregar otro método de pago
            </Button>
        </Box>
    </Box>
  )
}
