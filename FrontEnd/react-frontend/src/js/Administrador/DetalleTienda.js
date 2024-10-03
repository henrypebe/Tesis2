import { Box, Button, Divider, IconButton, Modal, TextField, Typography } from '@mui/material'
import React from 'react';
import CancelIcon from "@mui/icons-material/Cancel";
import { BASE_URL } from "../../config";

export default function DetalleTienda({setMostrarGestionAprobacionTienda, setMostrarDetalleTienda, TiendaSeleccionado}) {
    const handleChange = () =>{
        setMostrarDetalleTienda(false);
        setMostrarGestionAprobacionTienda(true);
    }

    const [open, setOpen] = React.useState(false);
    const [EstadoSeleccionado, setEstadoSeleccionado] = React.useState();
    const [MotivoRechazo, setMotivoRechazo] = React.useState("?");
    const handleOpen = (estado) => {setOpen(true);setEstadoSeleccionado(estado);};
    const handleClose = () => {setOpen(false);};
    
    const handleSubirEstadoProducto = async (estado) =>{
        handleOpen(estado);
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 1000,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        padding: "20px",
        borderRadius: "8px",
        height: "49%",
    };

    const handleCambioDatos = async() =>{
        const response = await fetch(
            `${BASE_URL}/AprobaciónTienda?idTienda=${TiendaSeleccionado.idTienda}&Estado=${EstadoSeleccionado}&MotivoRechazo=${MotivoRechazo}`,
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

    const handleCambioDatosAprobado = async(estado) =>{
        const response = await fetch(
            `${BASE_URL}/AprobaciónTienda?idTienda=${TiendaSeleccionado.idTienda}&Estado=${estado}&MotivoRechazo=${MotivoRechazo}`,
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
    <Box sx={{padding:"20px", width:"82.5%", marginTop:"-1.9px", height:"89vh", display:"flex", flexDirection:"column"}}>
        <Box sx={{display:"flex", flexDirection:"row", width:"100%", justifyContent:"space-between"}}>    
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"52%"}}>Tienda en proceso de aprobación</Typography>

            <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
                fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleChange}>
                Atrás
            </Button>
        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px", width:"100%"}} />

        <Box sx={{border:"2px solid black", borderRadius:"6px", padding:"10px", width:"60%", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"25px", width:"90%", marginBottom:"10px"}}>
                Datos generales de la tienda
            </Typography>
            <Box sx={{display:"flex", flexDirection:"row"}}>
                <Box sx={{display:"flex", flexDirection:"column", width:"50%"}}>
                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            Nombre:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            {TiendaSeleccionado.nombre}
                        </Typography>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            Dueño:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            {TiendaSeleccionado.nombreDueño} {TiendaSeleccionado.apellidoDueño}
                        </Typography>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            Dirección:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            {TiendaSeleccionado.direccion}
                        </Typography>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            Provincia:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            {TiendaSeleccionado.provincia}
                        </Typography>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            País:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            {TiendaSeleccionado.pais}
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
                        src={TiendaSeleccionado.foto}
                        alt="Descripción de la imagen"
                        style={{ height: "200px" }}
                    />
                </Box>
            </Box>
        </Box>

        <Box sx={{border:"2px solid black", borderRadius:"6px", padding:"10px", width:"60%", height:"40%", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"25px", width:"90%", marginBottom:"10px"}}>
                Descripción de la tienda:
            </Typography>
            <Typography sx={{color:"black", fontSize:"20px", width:"90%", marginBottom:"10px", height:"30%"}}>
                {TiendaSeleccionado.descripcion}
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
                onClick={() => {handleCambioDatosAprobado(1);}}
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
                onClick={() => {handleSubirEstadoProducto(3); }}
            >
                Rechazar
            </Button>
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={{ ...style }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography
                        sx={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "30px",
                        width: "100%",
                        }}
                    >
                        Rechazar producto
                    </Typography>

                    <IconButton
                        sx={{
                        backgroundColor: "white",
                        color: "black",
                        width: "80px",
                        fontSize: "17px",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "white" },
                        }}
                        onClick={handleClose}
                    >
                        <CancelIcon sx={{ fontSize: "50px" }} />
                    </IconButton>
                </Box>
                <hr
                    style={{
                        margin: "10px 0",
                        border: "0",
                        borderTop: "2px solid #ccc",
                        marginTop: "10px",
                        marginBottom: "15px",
                    }}
                />
                <Typography
                    sx={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "24px",
                        width: "100%",
                        marginBottom:"20px",
                        marginTop:"10px"
                    }}
                >
                    ¿Cuál es el motivo de su rechazo?
                </Typography>
                <TextField
                    multiline
                    rows={8}
                    sx={{
                        width: '100%'
                    }}
                    onChange={(e) => setMotivoRechazo(e.target.value)}
                />
                <Button
                    variant="contained"
                    sx={{
                    width: "100%",
                    marginTop:"20px",
                    backgroundColor: "#1C2536",
                    fontSize: "20px",
                    "&:hover": { backgroundColor: "#1C2536" },
                    }}
                    onClick={handleCambioDatos}
                >
                    Aceptar
                </Button>
            </Box>
        </Modal>
    </Box>
  )
}
