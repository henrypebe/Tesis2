import { Box, Pagination, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import CardGestionAprobacionTienda from './CardGestionAprobacionTienda';
import { BASE_URL } from "../../config";

export default function GestionAprobacionTienda({handleChangeTiendaSeleccionado}) {
    const [ListaTiendaSeleccionado, setListaTiendaSeleccionado] = React.useState(null);
    useEffect(() => {
        const obtenerListaProducto = async () => {
            try {
              const response = await fetch(
                `${BASE_URL}/ListarTiendaGestion`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
        
              if (response.ok) {
                const tienda = await response.json();
                setListaTiendaSeleccionado(tienda);
                // console.log(tienda);
              } else if (response.status === 404) {
                throw new Error("Tiendas no encontrado");
              } else {
                throw new Error("Error al obtener la lista de tiendas");
              }
            } catch (error) {
              console.error("Error al obtener la lista de tiendas", error);
              throw new Error("Error al obtener la lista de tiendas");
            }
          };
          const interval = setInterval(() => {
            obtenerListaProducto();
          }, 100);
          return () => clearInterval(interval);
    }, []);

    const [currentPage, setCurrentPage] = React.useState(0);
    const rowsPerPage = 12;
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage - 1);
    };
  return (
    <Box sx={{padding:"20px", width:"80.37%", marginTop:"-1.9px", height:"88vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px"}}>Gestión de aprobación de tiendas</Typography>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{height:"84.5%"}}>
            {ListaTiendaSeleccionado && ListaTiendaSeleccionado.length > 0 ? 
            (
            <>
                <Box sx={{height:"93%"}}>
                    {ListaTiendaSeleccionado.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map(tienda => (
                        <CardGestionAprobacionTienda tienda={tienda} handleChangeTiendaSeleccionado={handleChangeTiendaSeleccionado}/>
                    ))}
                </Box>
                <Box sx={{ display:"flex", justifyContent:"center"}}>
                    <Pagination count={Math.ceil(ListaTiendaSeleccionado.length / rowsPerPage)} page={currentPage + 1} onChange={handleChangePage}/>
                </Box>
            </>
            ):
            (
            <Box>
                <Typography sx={{fontSize:"20px", fontWeight:"bold"}}>
                No se tiene tiendas pendientes
                </Typography>
            </Box>
            )
            }
        </Box>
    </Box>
  )
}
