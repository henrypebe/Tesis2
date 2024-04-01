import { Box, Typography } from '@mui/material'
import React from 'react';
import CardGestionAprobacion from './CardGestionAprobacion';


export default function GestionAprobacion({setMostrarGestionAprobacion, setMostrarProductoDetalle}) {
    return (
    <Box sx={{padding:"20px", width:"80.37%", marginTop:"-1.9px", height:"84vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px"}}>Gestión de aprobaciones</Typography>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <CardGestionAprobacion setMostrarGestionAprobacion={setMostrarGestionAprobacion} setMostrarProductoDetalle={setMostrarProductoDetalle}/>
    </Box>
  )
}
