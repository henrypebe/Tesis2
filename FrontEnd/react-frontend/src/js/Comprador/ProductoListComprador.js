import { Box, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react';
import CardProducto from './CardProducto';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import { BASE_URL } from "../../config";

export default function ProductoListComprador({HandleChangeProductoSeleccionado}) {
    const [productosList, setProductosList] = React.useState(null);
    const [Busqueda, setBusqueda] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 12;
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };

  useEffect(() => {
    const obtenerListaProducto = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/ListasProductosGeneral?busqueda=${Busqueda === ""? "nada" : Busqueda}`,
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

  return (
    <>
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

      <Box sx={{height:"84.5%"}}>
        {productosList && productosList.length > 0 ? 
        (
          <>
            <Box sx={{height:"93%"}}>
              {productosList.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map(producto => (
                <CardProducto HandleChangeProductoSeleccionado={HandleChangeProductoSeleccionado} producto={producto}/>
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
              No se tiene productos disponibles
            </Typography>
          </Box>
        )
        }
      </Box>
    </>
  )
}
