import { Box, Button, Typography } from '@mui/material'
import React from 'react'

export default function CardProducto({setMostrarDetalleProducto, setMostrarProductos}) {
  const handleChange = () =>{
    setMostrarDetalleProducto(true);
    setMostrarProductos(false);
  }
    return (
    <Button sx={{color:"black", padding:"0px", marginRight:"15px", marginBottom:"10px", '&:hover': {backgroundColor:"white"}}}
    onClick={handleChange}
    >
        <Box sx={{border:"2px solid black", borderRadius:"5px", width:"200px", padding:"10px"}}>
            <Box sx={{display:"flex", justifyContent:"center"}}>
                <img src="https://promart.vteximg.com.br/arquivos/ids/570404-1000-1000/22773.jpg?v=637401121588630000" alt="Descripción de la imagen" 
                style={{height:"110px"}}
                />
            </Box>

            <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid black", marginTop:"10px", marginBottom:"10px"}} />

            <Box sx={{height:"40px", display:"flex", alignItems:"center"}}>
                <Typography sx={{fontSize:"15px"}}>
                    <b>Producto 1</b>
                </Typography>
            </Box>

            <Box sx={{height:"40px", display:"flex", alignItems:"center"}}>
                <Typography sx={{fontSize:"15px"}}>
                    <b>Tienda:</b> TAMBO
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", height:"40px"}}>
                <Typography sx={{marginRight:"10px", fontSize:"15px"}}>
                    <b>Precio:</b> S/. 20.00
                </Typography>
                <Typography sx={{borderRadius:"5px", padding:"5px", border:"2px solid red", color:"red", fontSize:"14px", fontWeight:"bold"}}>
                    5% OFF
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", height:"40px"}}>
                <Typography sx={{marginRight:"10px", fontSize:"15px"}}>
                    <b>Stock:</b> 20 unidades
                </Typography>
            </Box>
        </Box>
    </Button>
  )
}
