import { Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CardMisProductos from './CardMisProductos';

export default function MisProductos({setMostrarMisProductos, setMostrarDetalleProducto, setOpcionEditarProducto, setProductoInformacion, setMostrarEditarProducto,
    informacionTienda}) {
    
        const idTienda = informacionTienda.idTienda;
    const [productosList, setProductosList] = useState(null);
    const [Busqueda, setBusqueda] = useState("");

    const handleChangeDetalleProductoVendedor = () =>{
        setMostrarMisProductos(false);
        setMostrarDetalleProducto(true);
    }

    const handleChangeEditarProducto = (value) =>{
        setMostrarMisProductos(false);
        setOpcionEditarProducto(value);
        setMostrarEditarProducto(true);
    }

    // console.log(productosList[0]);

    useEffect(() => {
        const obtenerListaProducto = async () => {
            try {
              const response = await fetch(
                `https://localhost:7240/ListasProductos?idTienda=${idTienda}&busqueda=${Busqueda === ""? "nada" : Busqueda}`,
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
          obtenerListaProducto();
      }, [Busqueda,idTienda]);

  return (
    <Box sx={{padding:"20px", width:"85.1%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"26px", marginRight:"20px"}}>Mis Productos</Typography>
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
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box display={{display:"flex"}}>
            <Button variant="outlined" sx={{color:"black", borderColor:"black", width:"100%", '&:hover':{borderColor:"black"}}}
            onClick={() => handleChangeEditarProducto(1)}
            >
                Agregar nuevo producto +
            </Button>
        </Box>

        <Box sx={{marginTop:"10px", border:"2px solid black", borderRadius:"6px", width:"100%", padding:"10px"}}>
            <Typography sx={{fontWeight:"bold", fontSize:"24px", marginRight:"200px", color:"#00A307"}}>
                Producto con mayor venta:
            </Typography>

            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                <img src={productosList && productosList[0].imagen} alt="Descripción de la imagen" 
                    style={{height:"110px", maxWidth:"180px", minWidth:"180px"}}
                />
                <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
                <Box sx={{display:"flex", flexDirection:"column", width:"50%"}}>
                    <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        {productosList && productosList[0].nombre}
                        </Typography>
                        <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        Fecha de creación: {productosList && new Date(productosList[0].fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} {productosList && new Date(productosList[0].fechaCreacion).toLocaleTimeString()}
                        </Typography>
                        <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        {productosList && productosList[0].cantidadVentas} {productosList && productosList[0].cantidadVentas>1?"ventas":"venta"} - Cantidad de Stock: <b style={{color:productosList && productosList[0].stock===0?"red":"#286C23"}}>{productosList && productosList[0].stock}</b>
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
                <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:"20%"}}>
                    <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                        }}
                    >
                        Estado:
                    </Typography>
                    <Typography
                        sx={{
                            color: "#019935",
                            fontWeight: "bold",
                            fontSize: "24px",
                        }}
                    >
                        {productosList && productosList[0]? productosList[0].estadoAprobacion === "Pendiente"? "En espera" : productosList[0].estadoAprobacion : ""}
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
                <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"12%", justifyContent:"center"}}>
                    <IconButton sx={{marginRight:"10px", height:"50%"}} onClick={() => handleChangeEditarProducto(2)}>
                        <EditIcon sx={{fontSize:"40px"}}/>
                    </IconButton>
                    <IconButton sx={{marginRight:"10px", height:"50%"}} onClick={handleChangeDetalleProductoVendedor}>
                        <VisibilityIcon sx={{fontSize:"40px"}}/>
                    </IconButton>
                </Box>
            </Box>
        </Box>

        {productosList && productosList.slice(1).map(producto => (
            <CardMisProductos
                key={producto.IdProducto}
                producto={producto}
                setMostrarMisProductos={setMostrarMisProductos}
                setMostrarDetalleProducto={setMostrarDetalleProducto}
                setProductoInformacion={setProductoInformacion}
                setOpcionEditarProducto={setOpcionEditarProducto}
                setMostrarEditarProducto={setMostrarEditarProducto}
            />
        ))}

    </Box>
  )
}
