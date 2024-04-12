import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
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

  const convertirTiempoANumeros = tiempo => {
    const partes = tiempo.split(' ');
    const cantidad = parseInt(partes[0]);
    switch (partes[1]) {
      case 'Días':
        return cantidad / 30;
      case 'Meses':
        return cantidad;
      case 'Años':
        return cantidad * 12;
      default:
        return 0;
    }
  };

  const [productoMasLargo, setProductoMasLargo] = useState(null);

  useEffect(() => {
    const productosConCantidad = productos.filter(producto => producto.cantidad > 0);
    setProductos(productosConCantidad);
    let mayorTiempo = 0;
    productos.forEach(producto => {
      const tiempo = convertirTiempoANumeros(producto.fechaEnvio);
      if (tiempo > mayorTiempo) {
        mayorTiempo = tiempo;
        setProductoMasLargo(producto);
    }});
  }, [productos, setProductos]);

  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"88vh", maxHeight:"88vh"}}>
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
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"32px", width:"100%"}}>Total: S/. 
          {productos.reduce((total, producto) => total + ((producto.precio*producto.cantidad) - (producto.precio*producto.cantidad*producto.cantidadOferta/100)), 0).toFixed(2)}
           {productos.length>0 && productoMasLargo?`- Tiempo de 
          entrega: ${productoMasLargo.fechaEnvio}`:""}</Typography>
        </Box>

        <Box sx={{height:"72%"}}>
          {productos.map(producto => (
            <ItemShop producto={producto} onCantidadChange={onCantidadChange} conteoCarritoCompra={conteoCarritoCompra}
            setConteoCarritoCompra={setConteoCarritoCompra}/>
          ))}
        </Box>
        
        {productos.length>0?
        (
          <Button variant="contained" sx={{width:"95%", marginTop:"10px", backgroundColor:"#286C23", '&:hover':{backgroundColor:"#286C23"}}}
            onClick={handleProducto}
          >
            Pagar ahora
          </Button>
        )
        :
        (
          <></>
        )}
    </Box>
  )
}
