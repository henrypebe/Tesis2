import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react';
import CardSeguimiento from './CardSeguimiento';

export default function SeguimientoComprador({setMostrarSeguimiento, setMostrarDetalleSeguimiento, setChatId, idUsuario}) {
  
  const [ListaSeguimiento, setListaSeguimiento] = React.useState();

  useEffect(() => {
    const obtenerListaSeguimiento = async () => {
        try {
          const response = await fetch(
            `https://localhost:7240/VisualizarSeguimientoPorUsuario?idUsuario=${idUsuario}`,
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
            setListaSeguimiento(ListSeguimiento);
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
      obtenerListaSeguimiento();
  }, [idUsuario]);

  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Seguimientos</Typography>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        {ListaSeguimiento && ListaSeguimiento.length > 0 ? 
        (
          ListaSeguimiento.map(seguimiento => (
            <CardSeguimiento setMostrarSeguimiento={setMostrarSeguimiento} setMostrarDetalleSeguimiento={setMostrarDetalleSeguimiento}
              seguimiento={seguimiento}
            />
          ))
        ):
        (
          <Box>
            <Typography sx={{fontSize:"20px", fontWeight:"bold"}}>
              No se tiene productos con seguimientos
            </Typography>
          </Box>
        )
        }
    </Box>
  )
}
