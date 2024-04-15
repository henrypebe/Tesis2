import { Box, Typography } from '@mui/material'
import React from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { format } from 'date-fns';

export default function LineaDetalleProductoVisualizar({cambio}) {
  const fechaHora = new Date(cambio.fechaHora);
  const fechaHoraFormateada = format(fechaHora, 'dd/MM/yyyy HH:mm:ss');
  return (
    <Box sx={{display:"flex", flexDirection:"row", alignItems:"flex-start"}}>
        <Box sx={{height:"40px"}}>
          <FiberManualRecordIcon sx={{color:"black", marginRight:"10px"}}/>
        </Box>
        <Typography sx={{fontSize:"20px", height:"100%", marginTop:"-3px"}}>{fechaHoraFormateada}: {cambio.descripcion}</Typography>
    </Box>
  )
}
