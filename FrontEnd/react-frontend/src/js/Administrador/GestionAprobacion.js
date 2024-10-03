import { Box, Pagination, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import CardGestionAprobacion from './CardGestionAprobacion';
import { BASE_URL } from "../../config";

export default function GestionAprobacion({handleChangeProductoSeleccionado}) {
  
  const [productosList, setProductosList] = useState(null);
  useEffect(() => {
    const obtenerListaProducto = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/ProductosGeneral`,
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
            // console.log(producto);
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
      const interval = setInterval(() => {
        obtenerListaProducto();
      }, 100);
      return () => clearInterval(interval);
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 12;
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };

  return (
    <Box sx={{padding:"20px", width:"80.37%", marginTop:"-1.9px", height:"89vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px"}}>Gestión de aprobación de productos</Typography>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        {productosList && productosList.length > 0?
        (
          <>
            <Box sx={{height:"90%"}}>
              {productosList.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map(producto => (
              <CardGestionAprobacion 
                producto={producto} handleChangeProductoSeleccionado={handleChangeProductoSeleccionado}
              />
              ))}
            </Box>
            
            <Box sx={{ display:"flex", justifyContent:"center"}}>
              <Pagination count={Math.ceil(productosList.length / rowsPerPage)} page={currentPage + 1} onChange={handleChangePage}/>
            </Box>
          </>
        ):
        (
          <Box>
            <Typography sx={{fontSize:"20px", fontWeight:"bold"}}>
              No se tiene productos en espera
            </Typography>
          </Box>
        )}

    </Box>
  )
}
