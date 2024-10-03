import { Box, Typography, Pagination } from '@mui/material'
import React, { useEffect } from 'react'
import CardReclamo from './CardReclamo';
import { BASE_URL } from "../../config";

export default function ReclamoComprador({idUsuario, HandleChangeReclamoSeleccionado}) {
  const [ListaReclamos, setListaReclamos] = React.useState();
  
  useEffect(() => {
    const obtenerListaReclamos = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/VisualizarReclamosPorUsuario?idUsuario=${idUsuario}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const ListReclamo = await response.json();
            // console.log(ListReclamo);
            setListaReclamos(ListReclamo);
          } else if (response.status === 404) {
            throw new Error("Reclamo no encontrado");
          } else {
            throw new Error("Error al obtener la lista de Reclamos");
          }
        } catch (error) {
          console.error("Error al obtener la lista de Reclamos", error);
          throw new Error("Error al obtener la lista de Reclamos");
        }
      };
      obtenerListaReclamos();
  }, [idUsuario]);
  
  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 5;
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };

  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"89vh", maxHeight:"89vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Reclamos</Typography>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        {ListaReclamos && ListaReclamos.length > 0 ? 
        (
          <>
            <Box sx={{height:"88%"}}>
              {ListaReclamos.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map(reclamo => (
                <CardReclamo reclamo={reclamo} HandleChangeReclamoSeleccionado={HandleChangeReclamoSeleccionado}
                />
              ))}
            </Box>
            <Box sx={{ display:"flex", justifyContent:"center"}}>
              <Pagination count={Math.ceil(ListaReclamos.length / rowsPerPage)} page={currentPage + 1} onChange={handleChangePage}/>
            </Box>
          </>
        ):
        (
          <Box>
            <Typography sx={{fontSize:"20px", fontWeight:"bold"}}>
              No se tiene productos con reclamos
            </Typography>
          </Box>
        )
        }
    </Box>
  )
}
