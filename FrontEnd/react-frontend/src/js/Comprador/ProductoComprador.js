import { Box, Button, Checkbox, Typography } from '@mui/material'
import React, {useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductoListComprador from './ProductoListComprador';
import TiendaListComprador from './TiendaListComprador';
import ProductoPorTiendaComprador from './ProductoPorTiendaComprador';

export default function ProductoComprador({setMostrarDetalleProducto, setMostrarProductos, setMostrarCarrito, setMostrarOpcionCarrito, 
  HandleChangeProductoSeleccionado, conteoCarritoCompra}) {
  const [checkTienda, setCheckTienda] = useState(false);
  const [opcionPantalla, setOpcionPantalla] = useState(false);
  const [TiendaSeleccionado, setTiendaSeleccionado] = useState(false);

  const handleCheckChange = () => {
    setCheckTienda(!checkTienda);
    setOpcionPantalla(false);
  };

  const handleCarrito = () =>{
    setMostrarDetalleProducto(false);
    setMostrarProductos(false);
    setMostrarCarrito(true);
    setMostrarOpcionCarrito(1);
  }

  return (
    <Box sx={{padding:"20px", width:"87%", marginTop:"-1.9px", height:"89vh"}}>
      <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
        <Box sx={{display:"flex", flexDirection:"row"}}>
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"26px"}}>Productos</Typography>
          <Box sx={{marginLeft:"10px", display:"flex", flexDirection:"row", alignItems:"center"}}>
            <Checkbox checked={checkTienda} onChange={handleCheckChange}/>
            <Typography sx={{color:"black", fontSize:"20px"}}>Por Tienda</Typography>
          </Box>
        </Box>
        
        <Box sx={{width:"30%", display:"flex", justifyContent:"flex-end", alignItems:"center"}}>
          <Button variant="contained" sx={{backgroundColor:"white", color: "black", border:"2px solid black", borderRadius:"5px", padding:"8px", 
            width:"40%", height:"40px", marginRight:"15px",
            '&:hover': {backgroundColor:"white"}}}
            onClick={handleCarrito}
          >
            <ShoppingCartIcon sx={{fontSize:"30px", marginRight:"12px"}}/>
            <Typography sx={{fontWeight:"bold", fontSize:"26px"}}>{conteoCarritoCompra}</Typography>
          </Button>

          {opcionPantalla && (
            <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", fontSize:"17px",
              width:"40%",
              fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={()=>{setOpcionPantalla(false);}}>
              Atrás
            </Button>
          )}
        </Box>
      </Box>

      <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

      {!checkTienda?
      (
        <ProductoListComprador HandleChangeProductoSeleccionado={HandleChangeProductoSeleccionado}/>
      )
      :
      (
        <>
          {!opcionPantalla?
          (
            <TiendaListComprador HandleChangeProductoSeleccionado={HandleChangeProductoSeleccionado} setOpcionPantalla={setOpcionPantalla}
            setTiendaSeleccionado={setTiendaSeleccionado}/>
          )
          :
          (
            <ProductoPorTiendaComprador TiendaSeleccionado={TiendaSeleccionado} HandleChangeProductoSeleccionado={HandleChangeProductoSeleccionado}/>
          )}
        </>
      )}

    </Box>
  )
}
