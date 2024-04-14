import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ItemShop from './ItemShop';

export default function CarritoCompra({setMostrarCarrito, setMostrarProductos, mostrarOpcionCarrito, setMostrarDetalleProducto,
  setMostrarMetodoPago, productos, setProductos, setConteoCarritoCompra, conteoCarritoCompra}) {

    // console.log(productos);

  const handleBackProducto = () =>{
    setMostrarCarrito(false);
    setMostrarProductos(true);
  }
  const handleBackDetalleProducto = () =>{
    setMostrarCarrito(false);
    setMostrarDetalleProducto(true);
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

  // const [entregaSeparada, setEntregaSeparada] = useState(false);
  // const handleEntregaSeparadaChange = () => {
  //   setEntregaSeparada(!entregaSeparada);
  //   setEntregaAgrupada(false);
  // };
  // const [entregaAgrupada, setEntregaAgrupada] = useState(false);
  // const handleEntregaAgrupadaChange = () => {
  //   setEntregaAgrupada(!entregaAgrupada);
  //   setEntregaSeparada(false);
  // };

  // function concatenarFechaEntrega(productos) {
  //   const fechaLista = new Set();

  //   // console.log(productos);

  //   productos.forEach(producto => {
  //     fechaLista.add(producto.fechaEnvio);
  //   });
  //   const fechaArray = Array.from(fechaLista);
  //   const fechaConcatenada = fechaArray.join(", ");

  //   return fechaConcatenada;
  // }

  let Total = 0

  let totalProductos = productos.reduce((total, producto) => total + ((producto.precio * producto.cantidad) - (producto.precio * producto.cantidad * producto.cantidadOferta / 100)), 0);
  let costoEnvioTotal = 0;
  costoEnvioTotal = productos.reduce((total, producto) => total + producto.costoEnvio, 0) / productos.length;
  Total = totalProductos + costoEnvioTotal;
  costoEnvioTotal = costoEnvioTotal.toFixed(2);

  const handleProducto = () =>{
    let costoEnvioTotal = 0;
    costoEnvioTotal = productos.reduce((total, producto) => total + producto.costoEnvio, 0) / productos.length;
    costoEnvioTotal = costoEnvioTotal.toFixed(2);

    const productosActualizados = productos.map(producto => ({
      ...producto,
      costoEnvio: costoEnvioTotal,
      // opcionSeparado: entregaSeparada? 1: 0,
    }));
    setProductos(productosActualizados);
    setMostrarCarrito(false);
    setMostrarMetodoPago(true);
  }

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
          <Box sx={{height:"100%", width:"60%"}}>
            <Box sx={{display:"flex", flexDirection:"row", width:"100%"}}>
              <Typography sx={{fontWeight:"bold", fontSize:"22px", width:"40%"}}>Costo total del pedido:</Typography>
              <Typography sx={{fontSize:"22px"}}>
                S/. {productos.reduce((total, producto) => total + ((producto.precio*producto.cantidad) - (producto.precio*producto.cantidad*producto.cantidadOferta/100)), 0).toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{display:"flex", flexDirection:"row", width:"100%"}}>
              <Typography sx={{fontWeight:"bold", fontSize:"22px", width:"40%"}}>Cantidad de tiempo de entrega:</Typography>
              <Typography sx={{fontSize:"22px"}}>
                {/* {entregaAgrupada?
                (
                  <>
                    {productos.length>0 && productoMasLargo?`${productoMasLargo.fechaEnvio}`:""}
                  </>
                )
                :
                (
                  <>
                    {entregaSeparada?(
                      <>
                        {concatenarFechaEntrega(productos)}
                      </>
                    )
                    :
                    (
                      <div style={{fontWeight:"bold", color:"red"}}>
                        Seleccione un tipo de entrega
                      </div>
                    )}
                  </>
                )
                } */}
                S/. {productos.length>0 && productoMasLargo?`${productoMasLargo.fechaEnvio}`:(0).toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{display:"flex", flexDirection:"row", width:"100%"}}>
              <Typography sx={{fontWeight:"bold", fontSize:"22px", width:"40%"}}>Costo total de envío:</Typography>
              <Typography sx={{fontSize:"22px"}}> 
              {/* {(entregaSeparada || entregaAgrupada)? `S/. ${costoEnvioTotal}` 
                : 
                (<div style={{fontWeight:"bold", color:"red"}}>
                  Seleccione un tipo de entrega
                </div>)} */}
                S/. {isNaN(costoEnvioTotal)?(0).toFixed(2):costoEnvioTotal}
              </Typography>
            </Box>
            <Box sx={{display:"flex", flexDirection:"row", width:"100%"}}>
              <Typography sx={{fontWeight:"bold", fontSize:"22px", width:"40%"}}>Total:</Typography>
              <Typography sx={{fontSize:"22px"}}>S/. {isNaN(Total)? (0).toFixed(2): Total.toFixed(2)}</Typography>
            </Box>
          </Box>
        </Box>

        {/* <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
          <Typography sx={{fontSize:"20px", fontWeight:"bold"}}>¿Desea que la entrega sea separado o agrupado?</Typography>
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", marginLeft:"10px"}}>
            <Checkbox checked={entregaSeparada} onChange={handleEntregaSeparadaChange}/>
            <Typography sx={{fontSize:"20px"}}>Separado</Typography>
          </Box>
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", marginLeft:"10px"}}>
            <Checkbox checked={entregaAgrupada} onChange={handleEntregaAgrupadaChange}/>
            <Typography sx={{fontSize:"20px"}}>Agrupado</Typography>
          </Box>
        </Box> */}

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{height:"64%"}}>
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
