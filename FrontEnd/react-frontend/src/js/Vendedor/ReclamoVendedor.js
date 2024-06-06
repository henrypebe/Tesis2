import { Box, Typography, Pagination } from '@mui/material'
import React, { useEffect } from 'react';
import CardReclamoVendedor from './CardReclamoVendedor';
import { BASE_URL } from "../../config";

export default function ReclamoVendedor({informacionTienda}) {
  const [ListaProductoReclamo, setListaProductoReclamo] = React.useState();
  
  useEffect(() => {
    const obtenerListaProductoReclamo = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/ListarProductoReclamos?idTienda=${informacionTienda.idTienda}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const ListSeguimiento = await response.json();
            // console.log(ListSeguimiento);
            setListaProductoReclamo(ListSeguimiento);
          } else if (response.status === 404) {
            throw new Error("Seguimiento no encontrado");
          } else {
            throw new Error("Error al obtener la lista de seguimientos");
          }
        } catch (error) {
          console.error("Error al obtener la lista de seguimientos", error);
          throw new Error("Error al obtener la lista de seguimientos");
        }
      };
      obtenerListaProductoReclamo();
  }, [informacionTienda.idTienda]);

  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 5;
  const handleChangePage = (event, newPage) => {
      setCurrentPage(newPage - 1);
  };

  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", height:"88vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Reclamos</Typography>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        {ListaProductoReclamo && ListaProductoReclamo.length > 0 ? 
        (
          <>
            <Box sx={{height:"88%"}}>
              {ListaProductoReclamo && ListaProductoReclamo.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map(reclamo => (
                <CardReclamoVendedor reclamo={reclamo}/>
              ))}
            </Box>
            <Box sx={{ display:"flex", justifyContent:"center"}}>
              <Pagination count={Math.ceil(ListaProductoReclamo.length / rowsPerPage)} page={currentPage + 1} onChange={handleChangePage}/>
            </Box>
          </>
        ):
        (
          <Box>
            <Typography sx={{fontSize:"20px", fontWeight:"bold"}}>
              No se tiene productos con reclamos
            </Typography>
          </Box>
        )}
    </Box>
  )
}
