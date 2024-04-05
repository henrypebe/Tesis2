import { Box, Typography } from '@mui/material'
import React from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function LineaDetalleProductoVisualizar() {
  return (
    <Box sx={{display:"flex", flexDirection:"row"}}>
        <FiberManualRecordIcon sx={{color:"black",}}/> {/* Ícono de viñeta */}
        <Typography sx={{fontSize:"20px"}}>20/03/2024: Cambio de nombre: Producto A a Producto 1.</Typography>
    </Box>
  )
}
