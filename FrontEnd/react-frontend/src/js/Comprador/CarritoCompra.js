import { Box, Button, Typography } from '@mui/material'
import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ItemShop from './ItemShop';

export default function CarritoCompra({setMostrarCarrito, setMostrarProductos, mostrarOpcionCarrito, setMostrarDetalleProducto,
  setMostrarMetodoPago, productos, setProductos, setConteoCarritoCompra, conteoCarritoCompra}) {

  const handleBackProducto = () =>{
    setMostrarCarrito(false);
    setMostrarProductos(true);
  }
  const handleBackDetalleProducto = () =>{
    setMostrarCarrito(false);
    setMostrarDetalleProducto(true);
  }

  const handleProducto = () =>{
    setMostrarCarrito(false);
    setMostrarMetodoPago(true);
  }

  const onCantidadChange = (idProducto, cantidad) => {
    setProductos(prevProductos =>
      prevProductos.map(producto =>
        producto.idProducto === idProducto ? { ...producto, cantidad } : producto
      )
    );
  };

  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
       <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Mis compras</Typography>
            <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
            fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={mostrarOpcionCarrito === 1 ?handleBackProducto:
              mostrarOpcionCarrito===2?handleBackDetalleProducto:""}>
                Atrás
            </Button>
        </Box>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />
        
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
          <ShoppingCartIcon sx={{fontSize:"100px", marginRight:"20px"}}/>
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"32px", width:"100%"}}>Total: S/. {productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0).toFixed(2)}</Typography>
        </Box>

        {productos.map(producto => (
          <ItemShop producto={producto} onCantidadChange={onCantidadChange} conteoCarritoCompra={conteoCarritoCompra}
          setConteoCarritoCompra={setConteoCarritoCompra}/>
        ))}
        
        <Button variant="contained" sx={{width:"95%", marginTop:"10px", backgroundColor:"#286C23", '&:hover':{backgroundColor:"#286C23"}}}
            onClick={handleProducto}
        >
          Pagar ahora
        </Button>
    </Box>
  )
}
