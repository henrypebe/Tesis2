import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react';
import CardReclamoVendedor from './CardReclamoVendedor';

export default function ReclamoVendedor({informacionTienda}) {
  const [ListaProductoReclamo, setListaProductoReclamo] = React.useState();
  
  useEffect(() => {
    const obtenerListaProductoReclamo = async () => {
        try {
          const response = await fetch(
            `https://localhost:7240/ListarProductoReclamos?idTienda=${informacionTienda.idTienda}`,
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

  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"86vh", maxHeight:"auto"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Reclamos</Typography>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        {ListaProductoReclamo && ListaProductoReclamo.length > 0 ? 
        (
          ListaProductoReclamo.map(reclamo => (
            <CardReclamoVendedor reclamo={reclamo}/>
          ))
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
