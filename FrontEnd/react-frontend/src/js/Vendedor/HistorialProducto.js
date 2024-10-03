import React, { useEffect } from 'react';
import { Box, Button, Pagination, Typography } from '@mui/material'
import LineaDetalleProductoVisualizar from './LineaDetalleProductoVisualizar';
import { BASE_URL } from "../../config";

export default function HistorialProducto({setHistoriaProducto, setMostrarDetalleProducto, productoInformacion, setOpcionSeleccionado}) {

    const handleChange = () =>{
        setMostrarDetalleProducto(true);
        setHistoriaProducto(false);
        setOpcionSeleccionado(1);
    }

    const [HistorialProductos, setHistorialProductos] = React.useState();
    useEffect(() => {
        const handleInformacionInicioVendedor = async () => {
          try {
            const response = await fetch(
              `${BASE_URL}/ListarHistorialCambiosProducto?idProducto=${productoInformacion?productoInformacion.idProducto:0}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
      
            if (response.ok) {
              const historial = await response.json();
              setHistorialProductos(historial);
              // console.log(historial);
            } else if (response.status === 404) {
              throw new Error("Seguimiento no encontrado");
            } else {
              throw new Error("Error al obtener la lista de estadistica");
            }
          } catch (error) {
            console.error("Error al obtener la lista de estadistica", error);
            throw new Error("Error al obtener la lista de estadistica");
          }
        };
        handleInformacionInicioVendedor();
      }, [productoInformacion]);

    const [currentPage, setCurrentPage] = React.useState(0);
    const rowsPerPage = 15;
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage - 1);
    };

    return (
    <Box sx={{padding:"20px", width:"85.65%", marginTop:"-1.9px", minHeight:"89vh", maxHeight:"89vh"}}>
        <Box sx={{display:"flex", flexDirection:"row"}}>
            
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"90%"}}>Historial de cambios</Typography>

            <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
                fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleChange}>
                Atrás
            </Button>

        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{height:"88%"}}>
            {HistorialProductos && HistorialProductos.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((cambio) => {
                return(
                    <LineaDetalleProductoVisualizar cambio={cambio}/>
                );
            })}
        </Box>

        <Box sx={{ display:"flex", justifyContent:"center"}}>
            <Pagination count={Math.ceil(HistorialProductos ? HistorialProductos.length / rowsPerPage : 0)} page={currentPage + 1} onChange={handleChangePage}/>
        </Box>
    </Box>
  )
}
