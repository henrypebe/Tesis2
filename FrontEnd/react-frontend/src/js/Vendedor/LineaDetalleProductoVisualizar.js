import { Box, Typography } from '@mui/material'
import React from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function LineaDetalleProductoVisualizar({fechaCambio, descripcionCambio}) {
  return (
    <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
        <FiberManualRecordIcon sx={{color:"black", marginRight:"10px"}}/> {/* Ícono de viñeta */}
        <Typography sx={{fontSize:"25px"}}>{fechaCambio}: {descripcionCambio}</Typography>
    </Box>
  )
}
