import { Box, Button, Divider, IconButton, Typography } from '@mui/material'
import React from 'react';
import HistoryIcon from '@mui/icons-material/History';

export default function DetalleProductoVendedor({setMostrarMisProductos, setMostrarDetalleProducto, productoInformacion, handleChangeHistoria}) {

    const partes = productoInformacion.cantidadGarantia.split("_");
    const numero = partes[0];
    const texto = partes[1];

    const handleChange = () =>{
        setMostrarMisProductos(true);
        setMostrarDetalleProducto(false);
    }

    return (
    <Box sx={{padding:"20px", width:"85.65%", marginTop:"-1.9px", minHeight:"85vh", maxHeight:"85vh"}}>
        <Box sx={{display:"flex", flexDirection:"row"}}>
            
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"90%"}}>Detalle del producto</Typography>

            <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
                fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleChange}>
                Atrás
            </Button>

        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{border:"2px solid black", borderRadius:"6px", display:"flex", flexDirection:"column", padding:"15px"}}>
            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                <Typography
                    sx={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "24px",
                        width: "90%",
                    }}
                >
                    Detalles generales del producto:
                </Typography>
                <IconButton onClick={() => {handleChangeHistoria(productoInformacion);}}>
                    <HistoryIcon sx={{fontSize:"40px", color:"black"}}/>
                </IconButton>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                <img src={productoInformacion.imagen} alt="Descripción de la imagen" 
                    style={{height:"170px", maxWidth:"200px", minWidth:"200px"}}
                />
                <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
                <Box sx={{display:"flex", flexDirection:"column", width:"50%", justifyContent:"center"}}>
                    <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        {productoInformacion.nombre}
                    </Typography>
                    <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        Fecha de creación: {new Date(productoInformacion.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} {new Date(productoInformacion.fechaCreacion).toLocaleTimeString()}
                    </Typography>
                    <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        Cantidad de ventas: {productoInformacion.cantidadVentas} {productoInformacion.cantidadVentas>1?"ventas":"venta"}
                    </Typography>
                    <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        Tiempo de garantía: {numero} {texto}
                    </Typography>
                    <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        Tipo de producto: {productoInformacion.tipoProducto}
                    </Typography>
                </Box>
            </Box>
        </Box>

        <Box sx={{display:"flex", flexDirection:"column", marginTop:"15px", padding:"15px", border:"2px solid black", borderRadius:"6px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"90%", marginBottom:"5px"}}>Datos financieros:</Typography>
            <Typography
                sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "23px",
                    width: "100%",
                    marginBottom:"5px"
                }}
            >
                Cantidad de Stock disponible: {productoInformacion.stock} unidades
            </Typography>
            <Typography
                sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "23px",
                    width: "100%",
                }}
            >
                Precio del producto: S/. {productoInformacion.precio.toFixed(2)}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"column", marginTop:"15px", padding:"10px", border:"2px solid black", borderRadius:"6px",
        height:"34%"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"90%"}}>Descripción del producto:</Typography>
            <Typography sx={{minHeight:"80%", marginTop:"10px", fontSize:"20px"}}>
                {productoInformacion.descripcion}
            </Typography>
        </Box>

    </Box>
  )
}
