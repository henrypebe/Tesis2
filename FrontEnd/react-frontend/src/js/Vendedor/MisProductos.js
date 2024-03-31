import { Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material'
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CardMisProductos from './CardMisProductos';

export default function MisProductos({setMostrarMisProductos, setMostrarDetalleProducto, setMostrarEditarProducto, setOpcionEditarProducto}) {

    const handleChangeDetalleProductoVendedor = () =>{
        setMostrarMisProductos(false);
        setMostrarDetalleProducto(true);
    }

    const handleChangeEditarProducto = (value) =>{
        setMostrarMisProductos(false);
        setMostrarEditarProducto(true);
        setOpcionEditarProducto(value);
    }


  return (
    <Box sx={{padding:"20px", width:"85.1%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"26px", marginRight:"200px"}}>Mis Productos</Typography>
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

            <Box sx={{display:"flex", flexDirection:"row"}}>
                <img src="https://promart.vteximg.com.br/arquivos/ids/570404-1000-1000/22773.jpg?v=637401121588630000" alt="Descripción de la imagen" 
                    style={{height:"110px"}}
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
                        Productos 1
                        </Typography>
                        <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        Fecha de creación: 17/08/2024
                        </Typography>
                        <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        10 ventas
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
                        Aprobado
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

        <CardMisProductos setMostrarMisProductos={setMostrarMisProductos} setMostrarDetalleProducto={setMostrarDetalleProducto}
        setMostrarEditarProducto={setMostrarEditarProducto}/>

        <CardMisProductos setMostrarMisProductos={setMostrarMisProductos} setMostrarDetalleProducto={setMostrarDetalleProducto}
        setMostrarEditarProducto={setMostrarEditarProducto}/>

    </Box>
  )
}
