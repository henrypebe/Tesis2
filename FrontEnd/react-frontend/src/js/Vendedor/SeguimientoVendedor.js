import { Box, Typography } from '@mui/material'
import React from 'react'
import CardSeguimientoVendedor from './CardSeguimientoVendedor'

export default function SeguimientoVendedor({setMostrarSeguimientoVendedor, setMostrarnDetalleSeguimiento}) {
  return (
    <Box sx={{padding:"20px", width:"85.1%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"26px", marginRight:"200px"}}>Seguimientos</Typography>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <CardSeguimientoVendedor setMostrarSeguimientoVendedor={setMostrarSeguimientoVendedor} setMostrarnDetalleSeguimiento={setMostrarnDetalleSeguimiento}/>
    </Box>
  )
}
