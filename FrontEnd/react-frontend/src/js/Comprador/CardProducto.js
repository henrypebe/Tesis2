import { Box, Button, Typography } from '@mui/material'
import React from 'react'

export default function CardProducto({HandleChangeProductoSeleccionado, producto}) {
    return (
    <Button sx={{color:"black", padding:"0px", marginRight:"15px", marginBottom:"10px", '&:hover': {backgroundColor:"white"}}}
    onClick={() => {HandleChangeProductoSeleccionado(producto);}}
    >
        <Box sx={{border:"2px solid black", borderRadius:"5px", width:"240px", padding:"10px"}}>
            <Box sx={{display:"flex", justifyContent:"center"}}>
                <img src={producto.imagen} alt="Descripción de la imagen" 
                style={{height:"110px", minWidth:"180px", maxWidth:"180px"}}
                />
            </Box>

            <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid black", marginTop:"10px", marginBottom:"10px"}} />

            <Box sx={{height:"40px", display:"flex", alignItems:"center"}}>
                <Typography sx={{fontSize:"15px"}}>
                    <b>{producto.nombre}</b>
                </Typography>
            </Box>

            <Box sx={{height:"40px", display:"flex", alignItems:"center"}}>
                <Typography sx={{fontSize:"15px"}}>
                    <b>Tienda:</b> {producto.tiendaNombre}
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", height:"40px"}}>
                <Typography sx={{marginRight:"10px", fontSize:"15px"}}>
                    <b>Precio:</b> S/. {producto && producto.precio && producto.precio.toFixed(2)}
                </Typography>
                {producto.cantidadOferta > 0 ?
                (
                    <Typography sx={{borderRadius:"5px", padding:"5px", border:"2px solid red", color:"red", fontSize:"14px", fontWeight:"bold"}}>
                        {producto.cantidadOferta}% OFF
                    </Typography>
                ):""}
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", height:"40px"}}>
                <Typography sx={{marginRight:"10px", fontSize:"15px"}}>
                    <b>Stock:</b> {producto.stock} unidades
                </Typography>
            </Box>
        </Box>
    </Button>
  )
}
