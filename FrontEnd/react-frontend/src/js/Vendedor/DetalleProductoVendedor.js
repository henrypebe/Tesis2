import { Box, Button, Divider, IconButton, Modal, Typography } from '@mui/material'
import React, { useEffect } from 'react';
import HistoryIcon from '@mui/icons-material/History';
import CancelIcon from "@mui/icons-material/Cancel";

export default function DetalleProductoVendedor({setMostrarMisProductos, setMostrarDetalleProducto, productoInformacion, handleChangeHistoria,
    OpcionSeleccionado}) {

// console.log(productoInformacion);

    const [Open, setOpen] = React.useState(false);
    const partes = productoInformacion?productoInformacion.cantidadGarantia.split("_"):"";
    const numero = partes[0];
    const texto = partes[1];

    const handleChange = () =>{
        setMostrarMisProductos(true);
        setMostrarDetalleProducto(false);
    }

    const handleClose = () => {setOpen(false);};

    useEffect(() => {
        if(productoInformacion && productoInformacion.estadoAprobacion === "Rechazado" && OpcionSeleccionado !== 1) setOpen(true);
    }, [productoInformacion, OpcionSeleccionado]);

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
    <Box sx={{padding:"20px", width:"85.65%", marginTop:"-1.9px", minHeight:"88vh", maxHeight:"88vh"}}>
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
                <img src={productoInformacion && productoInformacion.imagen} alt="Descripción de la imagen" 
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
                        {productoInformacion && productoInformacion.nombre} 
                        {productoInformacion && productoInformacion.tipoProducto==="Vestimenta"?` - ${productoInformacion.talla} - ${productoInformacion.color}`:""}
                    </Typography>
                    <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                    >
                        Fecha de creación: {productoInformacion && new Date(productoInformacion.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}{" "}
                        {productoInformacion && new Date(productoInformacion.fechaCreacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </Typography>
                    <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        Cantidad de ventas: {productoInformacion && productoInformacion.cantidadVentas} {productoInformacion && productoInformacion.cantidadVentas>1?"ventas":"venta"}
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
                        Tipo de producto: {productoInformacion && productoInformacion.tipoProducto}
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
                Cantidad de Stock disponible: {productoInformacion && productoInformacion.stock} unidades
            </Typography>
            <Typography
                sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "23px",
                    width: "100%",
                }}
            >
                Precio del producto: S/. {productoInformacion && productoInformacion.precio.toFixed(2)}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"column", marginTop:"15px", padding:"10px", border:"2px solid black", borderRadius:"6px",
            height:"31%"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"90%"}}>Descripción del producto:</Typography>
            <Typography sx={{height:"50%", marginTop:"10px", fontSize:"20px"}}>
                {productoInformacion && productoInformacion.descripcion? productoInformacion.descripcion: "No tiene descripción"}
            </Typography>
        </Box>

        <Modal
          open={Open}
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
                        Informe del rechazo
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
                        fontSize: "24px",
                        width: "100%",
                        marginBottom:"20px",
                        marginTop:"10px",
                        marginLeft:"10px"
                    }}
                >
                    El motivo del rechazo es el siguiente:
                </Typography>
                <Box sx={{width:"100%", display: "flex", justifyContent:"center", height:"66%"}}>
                    <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "96%",
                            marginBottom:"20px",
                            marginTop:"10px",
                            border:"2px solid black",
                            padding:"10px",
                            borderRadius:"6px"
                        }}
                    >
                        {productoInformacion && productoInformacion.motivoRechazo}
                    </Typography>
                </Box>
            </Box>
        </Modal>

    </Box>
  )
}
