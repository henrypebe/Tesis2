import { Box, Button, Divider, IconButton, Modal, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import CancelIcon from "@mui/icons-material/Cancel";
import { BASE_URL } from "../../config";

export default function DetalleProductoAdministrador({setMostrarGestionAprobacion, setMostrarProductoDetalle, ProductoSeleccionado}) {
    const [open, setOpen] = React.useState(false);
    const [EstadoSeleccionado, setEstadoSeleccionado] = React.useState();
    const [MotivoRechazo, setMotivoRechazo] = React.useState("?");

    const handleOpen = (estado) => {setOpen(true);setEstadoSeleccionado(estado);};
    const handleClose = () => {setOpen(false);};
    
    const handleChange = () =>{
        setMostrarProductoDetalle(false);
        setMostrarGestionAprobacion(true);
    }

    const handleSubirEstadoProducto = async (estado) =>{
        handleOpen(estado);
    }

    const [selectedSize, setSelectedSize] = React.useState("");
    useEffect(() => {
        const handleInformacionInicioVendedor = async () => {
          try {
            const response = await fetch(
              `${BASE_URL}/GetTallasPorProducto?idProducto=${ProductoSeleccionado.idProducto}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
      
            if (response.ok) {
              const talla = await response.json();
              let tallaSeleccionada = "";
              if (talla.s) tallaSeleccionada = "Short (S)";
              else if (talla.m) tallaSeleccionada = "Medium (M)";
              else if (talla.l) tallaSeleccionada = "Large (L)";
              else if (talla.xl) tallaSeleccionada = "XL (Extra Large)";
              else if (talla.xxl) tallaSeleccionada = "XXL (Extra Extra Large)";
              setSelectedSize(tallaSeleccionada);
    
            } else if (response.status === 404) {
              throw new Error("Talla del producto no encontrado");
            } else {
              throw new Error("Error al obtener la Talla del producto");
            }
          } catch (error) {
            console.error("Error al obtener la Talla del producto", error);
            throw new Error("Error al obtener la Talla del producto");
          }
        };
        if(ProductoSeleccionado && ProductoSeleccionado.idProducto && ProductoSeleccionado.tipoProducto === "Vestimenta"){
          handleInformacionInicioVendedor();
        }
      }, [ProductoSeleccionado]);

    const handleCambioDatos = async() =>{
        const response = await fetch(
            `${BASE_URL}/CambioEstadoAprobaciónProducto?idProducto=${ProductoSeleccionado.idProducto}&EstadoPuesto=${EstadoSeleccionado}&MotivoRechazo=${MotivoRechazo}`,
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
            `${BASE_URL}/CambioEstadoAprobaciónProducto?idProducto=${ProductoSeleccionado.idProducto}&EstadoPuesto=${estado}&MotivoRechazo=${"?"}`,
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

    return (
    <Box sx={{padding:"20px", width:"82.5%", marginTop:"-1.9px", height:"88vh", display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
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

                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            Costo de envio:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            S/. {ProductoSeleccionado.costoEnvio.toFixed(2)}
                        </Typography>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px", width:"100%"}}>
                        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"70%"}}>
                            Talla de la vestimenta:
                        </Typography>
                        <Typography sx={{color:"black", fontSize:"20px", width:"40%"}}>
                            {selectedSize}
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
                        style={{ height: "240px" }}
                    />
                </Box>
            </Box>
        </Box>

        <Box sx={{border:"2px solid black", borderRadius:"6px", padding:"10px", width:"60%", height:"38%", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"25px", width:"90%", marginBottom:"10px"}}>
                Descripción del producto:
            </Typography>
            <Typography sx={{color:"black", fontSize:"20px", width:"90%", marginBottom:"10px", height:"30%"}}>
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
                onClick={() => {handleCambioDatosAprobado("Aprobado");}}
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
                    defaultValue={MotivoRechazo === "?"?"":MotivoRechazo}
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
