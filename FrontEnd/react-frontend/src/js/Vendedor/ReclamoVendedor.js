import { Box, Typography } from '@mui/material'
import React from 'react';
import CardReclamoVendedor from './CardReclamoVendedor';

export default function ReclamoVendedor() {
  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Reclamos</Typography>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <CardReclamoVendedor />

        <CardReclamoVendedor />

        <CardReclamoVendedor />
    </Box>
  )
}
