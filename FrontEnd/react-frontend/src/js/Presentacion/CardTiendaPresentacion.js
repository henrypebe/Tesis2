import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'

export default function CardTiendaPresentacion({tienda}) {
    const [listaTiendaSeleccionado, setListaTiendaSeleccionado] = useState(null);
    useEffect(() => {
        const obtenerListaProducto = async () => {
            try {
              const response = await fetch(
                `https://localhost:7240/CantidadProductoXTienda?idTienda=${tienda.idTienda}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
        
              if (response.ok) {
                const valor = await response.json();
                setListaTiendaSeleccionado(valor);
                // console.log(tienda);
              } else if (response.status === 404) {
                throw new Error("Tiendas no encontrado");
              } else {
                throw new Error("Error al obtener la conteo de productos por tienda");
              }
            } catch (error) {
              console.error("Error al obtener la conteo de productos por tienda", error);
              throw new Error("Error al obtener la conteo de productos por tienda");
            }
        };
        obtenerListaProducto();
    }, [tienda.idTienda]);
    return (
    <Button sx={{color:"black", padding:"0px", marginRight:"15px", marginBottom:"10px", '&:hover': {backgroundColor:"white"}}}
    >
        <Box sx={{border:"2px solid black", borderRadius:"5px", width:"240px", padding:"10px"}}>
            <Box sx={{display:"flex", justifyContent:"center"}}>
                <img src={tienda.foto} alt="Descripción de la imagen" 
                    style={{height:"90px", minWidth:"180px", maxWidth:"180px"}}
                />
            </Box>

            <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid black", marginTop:"10px", marginBottom:"10px"}} />

            <Box sx={{height:"40px", display:"flex", alignItems:"center"}}>
                <Typography sx={{fontSize:"15px"}}>
                    <b>Tienda:</b> {tienda.nombre}
                </Typography>
            </Box>

            <Box sx={{height:"40px", display:"flex", alignItems:"center"}}>
                <Typography sx={{fontSize:"15px"}}>
                    <b>Cantidad de productos:</b> {listaTiendaSeleccionado?listaTiendaSeleccionado.toFixed(0).padStart(2, '0'):"00"}
                </Typography>
            </Box>
        </Box>
    </Button>
  )
}
