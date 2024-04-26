import { Box } from '@mui/material'
import React from 'react';
import BarraSuperiorPresentacion from './BarraSuperiorPresentacion';
import ProductosPresentacion from './ProductosPresentacion';

export default function PresentacionSistema() {
  
    return (
    <Box sx={{display:"flex", flexDirection:"column"}}>
        <BarraSuperiorPresentacion />
        <Box sx={{display:"flex", flexDirection:"row"}}>
            <ProductosPresentacion />
        </Box>
    </Box>
  )
}
