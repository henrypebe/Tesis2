import { Box, Pagination, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CardTiendaPresentacion from './CardTiendaPresentacion';
import SearchIcon from '@mui/icons-material/Search';
import CardProductoPresentacion from './CardProductoPresentacion';

export default function ProductosPresentacion() {
    const [Busqueda, setBusqueda] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 6;
    const handleChangePage = (event, newPage) => {
      setCurrentPage(newPage - 1);
    };

    const [currentPage2, setCurrentPage2] = useState(0);
    const rowsPerPage2 = 6;
    const handleChangePage2 = (event, newPage) => {
        setCurrentPage2(newPage - 1);
    };

    const [productosList, setProductosList] = useState(null);
    useEffect(() => {
        const obtenerListaProducto = async () => {
            try {
              const response = await fetch(
                `https://localhost:7240/ListasProductosGeneral?busqueda=${Busqueda === ""? "nada" : Busqueda}`,
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
          // obtenerListaProducto();
          const interval = setInterval(() => {
            obtenerListaProducto();
        }, 100);
          return () => clearInterval(interval);
    }, [Busqueda]);

    const [ListaTiendaSeleccionado, setListaTiendaSeleccionado] = React.useState(null);
    useEffect(() => {
        const obtenerListaProducto = async () => {
            try {
              const response = await fetch(
                `https://localhost:7240/ListarTiendaGeneral`,
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

    return (
    <Box sx={{padding:"20px", width:"100%", marginTop:"-1.9px", minHeight:"88vh", maxHeight:"88vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Tiendas disponibles</Typography>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <>
            <Box sx={{height:"28%"}}>
                {ListaTiendaSeleccionado && ListaTiendaSeleccionado.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map(tienda => (
                    <CardTiendaPresentacion tienda={tienda}/>
                ))}
            </Box>
            <Box sx={{ display:"flex", justifyContent:"center"}}>
                <Pagination count={Math.ceil(ListaTiendaSeleccionado? ListaTiendaSeleccionado.length / rowsPerPage: 0)} page={currentPage + 1} 
                onChange={handleChangePage}/>
            </Box>
        </>

        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Productos disponibles</Typography>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
        
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", marginRight:"10px"}}>Nombre o tipo del producto:</Typography>
            
            <Box sx={{display:"flex", flexDirection:"row"}}>
                <TextField
                id="outlined-basic"
                label="Búsqueda del producto"
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
                defaultValue={Busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                />
            </Box>
        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <>
            <Box sx={{height:"39.5%"}}>
              {productosList && productosList.slice(currentPage2 * rowsPerPage2, (currentPage2 + 1) * rowsPerPage2).map(producto => (
                <CardProductoPresentacion producto={producto}/>
              ))}
            </Box>
            <Box sx={{ display:"flex", justifyContent:"center"}}>
                <Pagination count={Math.ceil(productosList ? productosList.length / rowsPerPage2 : 0)} page={currentPage2 + 1} onChange={handleChangePage2}/>
            </Box>
        </>
    </Box>
  )
}
