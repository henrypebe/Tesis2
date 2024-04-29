import { Box, Pagination, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CardTiendaPresentacion from '../Presentacion/CardTiendaPresentacion';

export default function TiendaListComprador({HandleChangeProductoSeleccionado, setOpcionPantalla, setTiendaSeleccionado}) {
    const [BusquedaTienda, setBusquedaTienda] = React.useState('');
    const [ListaTiendaSeleccionado, setListaTiendaSeleccionado] = React.useState(null);
    useEffect(() => {
        const obtenerListaTienda = async () => {
            try {
              const response = await fetch(
                `https://localhost:7240/ListarTiendaGeneral?busquedaTienda=${BusquedaTienda===''?'nada':BusquedaTienda}`,
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
            obtenerListaTienda();
          }, 100);
          return () => clearInterval(interval);
    }, [BusquedaTienda]);

    const [currentPage, setCurrentPage] = React.useState(0);
    const rowsPerPage = 12;
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage - 1);
    };

    return (
    <>
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", marginRight:"10px"}}>Nombre de la tienda:</Typography>
            <Box sx={{display:"flex", flexDirection:"row"}}>
                <TextField
                    id="outlined-basic"
                    label="Búsqueda de tienda"
                    variant="outlined"
                    sx={{
                        height: 40,
                        '& .MuiInputBase-root': {
                        height: '100%',
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                        <SearchIcon sx={{marginRight:"10px"}} />
                        ),
                    }}
                    defaultValue={BusquedaTienda}
                    onChange={(e) => setBusquedaTienda(e.target.value)}
                />
            </Box>
        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{height:"84.5%"}}>
            {ListaTiendaSeleccionado && ListaTiendaSeleccionado.length > 0 ? 
            (
            <>
                <Box sx={{height:"93%"}}>
                {ListaTiendaSeleccionado.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map(tienda => (
                    <CardTiendaPresentacion tienda={tienda} opcion={1} setOpcionPantalla={setOpcionPantalla} 
                    setTiendaSeleccionado={setTiendaSeleccionado}/>
                ))}
                </Box>
                <Box sx={{ display:"flex", justifyContent:"center"}}>
                    <Pagination count={Math.ceil(ListaTiendaSeleccionado?ListaTiendaSeleccionado.length / rowsPerPage:0)} 
                    page={currentPage + 1} onChange={handleChangePage}/>
                </Box>
            </>
            ):
            (
            <Box>
                <Typography sx={{fontSize:"20px", fontWeight:"bold"}}>
                No se tiene productos disponibles
                </Typography>
            </Box>
            )
            }
        </Box>
    </>
  )
}
