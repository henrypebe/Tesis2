import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import CardSeguimientoVendedor from './CardSeguimientoVendedor'

export default function SeguimientoVendedor({informacionTienda, HandleChangeSeguimientoSeleccionado}) {
  const [ListaSeguimiento, setListaSeguimiento] = React.useState();

  useEffect(() => {
    const obtenerListaSeguimiento = async () => {
        try {
          const response = await fetch(
            `https://localhost:7240/VisualizarSeguimientoPorTienda?idTienda=${informacionTienda.idTienda}`,
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
  }, [informacionTienda.idTienda]);
  return (
    <Box sx={{padding:"20px", width:"85.1%", marginTop:"-1.9px", minHeight:"86vh", maxHeight:"86vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"26px", marginRight:"200px"}}>Seguimientos</Typography>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        {ListaSeguimiento && ListaSeguimiento.length > 0 ? 
        (
          ListaSeguimiento.map(seguimiento => (
            <CardSeguimientoVendedor HandleChangeSeguimientoSeleccionado={HandleChangeSeguimientoSeleccionado} seguimiento={seguimiento}/>
          ))
        ):
        (
          <Box>
            <Typography sx={{fontSize:"20px", fontWeight:"bold"}}>
              No se tiene productos con seguimientos
            </Typography>
          </Box>
        )}
    </Box>
  )
}
