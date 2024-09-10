import { Box, Button, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { BASE_URL } from '../../config';

export default function CardProducto({HandleChangeProductoSeleccionado, producto}) {
    
    const [selectedSize, setSelectedSize] = React.useState("");
    useEffect(() => {
        const handleInformacionInicioVendedor = async () => {
          try {
            const response = await fetch(
              `${BASE_URL}/GetTallasPorProducto?idProducto=${producto.idProducto}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
      
            if (response.ok) {
              const talla = await response.json();
              let tallaSeleccionada = "";
              if (talla.s) tallaSeleccionada = "Short (S)";
              else if (talla.m) tallaSeleccionada = "Medium (M)";
              else if (talla.l) tallaSeleccionada = "Large (L)";
              else if (talla.xl) tallaSeleccionada = "XL (Extra Large)";
              else if (talla.xxl) tallaSeleccionada = "XXL (Extra Extra Large)";
              setSelectedSize(tallaSeleccionada);
    
            } else if (response.status === 404) {
              throw new Error("Talla del producto no encontrado");
            } else {
              throw new Error("Error al obtener la Talla del producto");
            }
          } catch (error) {
            console.error("Error al obtener la Talla del producto", error);
            throw new Error("Error al obtener la Talla del producto");
          }
        };
        if(producto && producto.idProducto && producto.tipoProducto === "Vestimenta"){
          handleInformacionInicioVendedor();
        }
      }, [producto]);
    
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
                    <b>{producto.nombre} {producto.tipoProducto === "Vestimenta"? ` - ${selectedSize}`:""}</b>
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
