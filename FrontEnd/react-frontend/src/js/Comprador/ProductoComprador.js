import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CardProducto from './CardProducto';
import SearchIcon from '@mui/icons-material/Search';

export default function ProductoComprador({setMostrarDetalleProducto, setMostrarProductos, setMostrarCarrito, setMostrarOpcionCarrito, HandleChangeProductoSeleccionado,
  conteoCarritoCompra}) {
  
  const [productosList, setProductosList] = useState(null);
  const [Busqueda, setBusqueda] = useState("");

  const handleCarrito = () =>{
    setMostrarDetalleProducto(false);
    setMostrarProductos(false);
    setMostrarCarrito(true);
    setMostrarOpcionCarrito(1);
  }

  useEffect(() => {
    const obtenerListaProducto = async () => {
        try {
          const response = await fetch(
            `https://localhost:7240/ListasProductosGeneral?busqueda=${Busqueda === ""? "nada" : Busqueda}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const producto = await response.json();
            setProductosList(producto);
          } else if (response.status === 404) {
            throw new Error("Productos no encontrado");
          } else {
            throw new Error("Error al obtener la lista de productos");
          }
        } catch (error) {
          console.error("Error al obtener la lista de productos", error);
          throw new Error("Error al obtener la lista de productos");
        }
      };
      obtenerListaProducto();
  }, [Busqueda]);
  
  return (
    <Box sx={{padding:"20px", width:"85.1%", marginTop:"-1.9px", minHeight:"86vh", maxHeight:"auto"}}>
      <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"26px", width:"90%"}}>Productos</Typography>
        
        <Button variant="contained" sx={{backgroundColor:"white", color: "black", border:"2px solid black", borderRadius:"5px", padding:"8px", width:"9%", height:"40px",
        '&:hover': {backgroundColor:"white"}}}
        onClick={handleCarrito}
        >
          <ShoppingCartIcon sx={{fontSize:"30px", marginRight:"12px"}}/>
          <Typography sx={{fontWeight:"bold", fontSize:"26px"}}>{conteoCarritoCompra}</Typography>
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
          defaultValue={Busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        </Box>
      </Box>

      <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

      <Box sx={{height:"91%"}}>
        {productosList && productosList.length > 0 ? 
        (
          productosList.map(producto => (
            <CardProducto HandleChangeProductoSeleccionado={HandleChangeProductoSeleccionado} producto={producto}/>
          ))
        ):
        (
          <Box>
            <Typography sx={{fontSize:"20px", fontWeight:"bold"}}>
              No se tiene productos disponibles
            </Typography>
          </Box>
        )
        }
      </Box>

    </Box>
  )
}
