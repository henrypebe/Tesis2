import { Box, Button, Divider, Typography } from '@mui/material'
import React from 'react'

export default function DetalleProductoAdministrador({setMostrarGestionAprobacion, setMostrarProductoDetalle, ProductoSeleccionado}) {
    const handleChange = () =>{
        setMostrarProductoDetalle(false);
        setMostrarGestionAprobacion(true);
    }

    const handleSubirEstadoProducto = async (estado) =>{
        const response = await fetch(
            `https://localhost:7240/CambioEstadoAprobaciónProducto?idProducto=${ProductoSeleccionado.idProducto}&EstadoPuesto=${estado}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            }
        );
    
        if (response.ok) {
            handleChange();
        } else if (response.status === 404) {
            throw new Error("Producto no encontrado");
        } else {
            throw new Error("Error al Editar el producto");
        }
    }

    return (
    <Box sx={{padding:"20px", width:"82.5%", marginTop:"-1.9px", height:"88vh", display:"flex", flexDirection:"column", alignItems:"center"}}>
        <Box sx={{display:"flex", flexDirection:"row", width:"62%", justifyContent:"space-between"}}>    
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"52%"}}>Producto en proceso de aprobación</Typography>

            <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
                fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleChange}>
                Atrás
            </Button>
        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px", width:"61.5%"}} />

        <Box sx={{border:"2px solid black", borderRadius:"6px", padding:"10px", width:"60%", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"25px", width:"90%", marginBottom:"10px"}}>
                Datos generales del producto
            </Typography>
            <Box sx={{display:"flex", flexDirection:"row"}}>
                <Box sx={{display:"flex", flexDirection:"column", width:"50%"}}>
                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            Nombre:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            {ProductoSeleccionado.nombre}
                        </Typography>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            Fecha de creación:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            {new Date(ProductoSeleccionado.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </Typography>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            Cantidad de ventas:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            {ProductoSeleccionado.cantidadVentas} {ProductoSeleccionado.cantidadVentas>1?"ventas":"venta"}
                        </Typography>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            Precio:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            S/. {ProductoSeleccionado.precio.toFixed(2)}
                        </Typography>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            Oferta:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            {ProductoSeleccionado.cantidadOferta}%
                        </Typography>
                    </Box>
                </Box>

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                    backgroundColor: "black",
                    height: "auto",
                    marginRight: "30px",
                    marginLeft: "30px",
                    border: "2px solid black",
                    }}
                />

                <Box sx={{width:"40%", display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <img
                        src={ProductoSeleccionado.imagen}
                        alt="Descripción de la imagen"
                        style={{ height: "200px" }}
                    />
                </Box>
            </Box>
        </Box>

        <Box sx={{border:"2px solid black", borderRadius:"6px", padding:"10px", width:"60%", height:"30%", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"25px", width:"90%", marginBottom:"10px"}}>
                Descripción del producto:
            </Typography>
            <Typography sx={{color:"black", fontSize:"20px", width:"90%", marginBottom:"10px", height:"20%"}}>
                {ProductoSeleccionado.descripcion}
            </Typography>
        </Box>

        <Box sx={{width:"61.5%"}}>
            <Button
                variant="contained"
                sx={{
                backgroundColor: "#286C23",
                width: "100%",
                marginBottom:"10px",
                "&:hover": { backgroundColor: "#286C23" },
                }}
                onClick={() => {handleSubirEstadoProducto("Aprobado");}}
            >
                Aprobar
            </Button>

            <Button
                variant="contained"
                sx={{
                backgroundColor: "#C84C31",
                width: "100%",
                "&:hover": { backgroundColor: "#C84C31" },
                }}
                onClick={() => {handleSubirEstadoProducto("Rechazado"); }}
            >
                Rechazar
            </Button>
        </Box>
    </Box>
  )
}
