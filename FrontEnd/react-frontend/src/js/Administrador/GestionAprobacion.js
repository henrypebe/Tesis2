import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import CardGestionAprobacion from './CardGestionAprobacion';


export default function GestionAprobacion({handleChangeProductoSeleccionado}) {
  
  const [productosList, setProductosList] = useState(null);
  useEffect(() => {
    const obtenerListaProducto = async () => {
        try {
          const response = await fetch(
            `https://localhost:7240/ProductosGeneral`,
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
            console.log(producto);
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
  }, []);

  return (
    <Box sx={{padding:"20px", width:"80.37%", marginTop:"-1.9px", height:"84vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px"}}>Gestión de aprobaciones</Typography>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        {productosList && productosList.map(producto => (
            <CardGestionAprobacion 
            producto={producto} handleChangeProductoSeleccionado={handleChangeProductoSeleccionado}
            />
        ))}
    </Box>
  )
}
