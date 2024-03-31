import { Box, Button, TextField, Typography } from '@mui/material'
import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CardProducto from './CardProducto';
import SearchIcon from '@mui/icons-material/Search';

export default function ProductoComprador({setMostrarDetalleProducto, setMostrarProductos, setMostrarCarrito, setMostrarOpcionCarrito}) {
  
  const handleCarrito = () =>{
    setMostrarDetalleProducto(false);
    setMostrarProductos(false);
    setMostrarCarrito(true);
    setMostrarOpcionCarrito(1);
  }
  
  return (
    <Box sx={{padding:"20px", width:"85.1%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
      <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"26px", width:"90%"}}>Productos</Typography>
        
        <Button variant="contained" sx={{backgroundColor:"white", color: "black", border:"2px solid black", borderRadius:"5px", padding:"8px", width:"9%", height:"40px",
        '&:hover': {backgroundColor:"white"}}}
        onClick={handleCarrito}
        >
          <ShoppingCartIcon sx={{fontSize:"30px", marginRight:"12px"}}/>
          <Typography sx={{fontWeight:"bold", fontSize:"26px"}}>10</Typography>
        </Button>
      </Box>

      <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

      <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", marginRight:"10px"}}>Nombre o tipo del producto:</Typography>
        <Box sx={{display:"flex", flexDirection:"row"}}>
        <TextField
          id="outlined-basic"
          label="Búsqueda del producto"
          variant="outlined"
          sx={{
            height: 40,
            '& .MuiInputBase-root': {
              height: '100%',
            },
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{marginRight:"10px"}} />
            ),
          }}
        />
        </Box>
      </Box>

      <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

      <Box sx={{height:"91%"}}>
        <CardProducto setMostrarDetalleProducto={setMostrarDetalleProducto} setMostrarProductos={setMostrarProductos}/>
      </Box>

    </Box>
  )
}
