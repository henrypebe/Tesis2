import { Box, Button, IconButton, Modal, Pagination, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CardMetodoPagoAdicionar from '../Comprador/CardMetodoPagoAdicionar';
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../config";

export default function BilleteraVendedor({setMostrarBilletera, setMostrarnDetalleBilletera, idUsuario}) {
    const [MetodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(null);
    const [ModalEliminarMetodoPago, setModalEliminarMetodoPago] = useState(false);

    const handleOpenModal = (metodo) => {
        setModalEliminarMetodoPago(true);
        setMetodoPagoSeleccionado(metodo);
    };

    const handleChangePantalla = () =>{
        setMostrarBilletera(false);
        setMostrarnDetalleBilletera(true);
    }

    const handleCloseModal = () => {
        setModalEliminarMetodoPago(false);
    };

    const handleEliminarProducto = async() =>{
        const response = await 
            fetch(`${BASE_URL}/EliminarMetodoPago?MetodoPago=${MetodoPagoSeleccionado.idMetodoPago}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            toast.success("Metodo de pago eliminado", { autoClose: 2000 });
        } else {
            throw new Error("Error al eliminar el Metodo de pago");
        }
        handleCloseModal();
        handleInformacionInicioVendedor();
    }

    const styleQuinto = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 1000,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        padding: "10px",
        borderRadius: "8px",
        height: "24%",
    };

    const handleInformacionInicioVendedor = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/ListarBilleteraVendedor?idUsuario=${idUsuario}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const metodo = await response.json();
            setMetodosPago(metodo);
            // console.log(metodo);
          } else if (response.status === 404) {
            throw new Error("Seguimiento no encontrado");
          } else {
            throw new Error("Error al obtener la lista de estadistica");
          }
        } catch (error) {
          console.error("Error al obtener la lista de estadistica", error);
          throw new Error("Error al obtener la lista de estadistica");
        }
      };
    
    const [MetodosPago,setMetodosPago] = useState([]);
    useEffect(() => {
        const handleInformacionInicioVendedor = async () => {
          try {
            const response = await fetch(
              `${BASE_URL}/ListarBilleteraVendedor?idUsuario=${idUsuario}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
      
            if (response.ok) {
              const metodo = await response.json();
              setMetodosPago(metodo);
              // console.log(metodo);
            } else if (response.status === 404) {
              throw new Error("Metodo de pago no encontrado");
            } else {
              throw new Error("Error al obtener el Metodo de pago");
            }
          } catch (error) {
            console.error("Error al obtener el Metodo de pago", error);
            throw new Error("Error al obtener el Metodo de pago");
          }
        };
        handleInformacionInicioVendedor();
      }, [idUsuario]);

    const [currentPage, setCurrentPage] = React.useState(0);
    const rowsPerPage = 5;
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage - 1);
    };

    return (
        <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"89vh", maxHeight:"89vh"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Métodos de pago</Typography>

            <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

            <Box sx={{display:"flex", justifyContent:"center", marginBottom:"20px"}}>
                <Button
                    variant="contained"
                    sx={{
                    backgroundColor: "#1C2536",
                    width: "70%",
                    "&:hover": { backgroundColor: "#1C2536" },
                    }}
                    onClick={handleChangePantalla}
                >
                    Agregar otro método de pago
                </Button>
            </Box>

            <Box sx={{height:"85%", display:"flex",flexDirection:"column", alignItems:"center"}}>
                <Box sx={{height:"96%", width:"100%", display:"flex", justifyContent:"center"}}>
                    {MetodosPago && MetodosPago.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((metodo) => {
                        return(
                            <CardMetodoPagoAdicionar metodo={metodo} handleOpenModal={handleOpenModal}/>
                        );
                    })}
                </Box>
                <Box sx={{ display:"flex", justifyContent:"center"}}>
                    <Pagination count={Math.ceil(MetodosPago ? MetodosPago.length / rowsPerPage : 0)} page={currentPage + 1} onChange={handleChangePage}/>
                </Box>
            </Box>

            <Modal
                open={ModalEliminarMetodoPago}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...styleQuinto }}>
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
                            paddingLeft:"10px"
                            }}
                        >
                            Eliminar método de pago
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
                            onClick={handleCloseModal}
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
                        fontSize: "30px",
                        width: "100%",
                        textAlign:"center",
                        fontWeight:"bold"
                        }}
                    >
                        ¿Desea eliminar el metodo de pago **** **** **** {MetodoPagoSeleccionado?MetodoPagoSeleccionado.last4:0}?
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#1C2536",
                            marginTop: "24px",
                            fontSize: "25px",
                            height: "20%",
                            width: "100%",
                            "&:hover": { backgroundColor: "#1C2536" },
                        }}
                        onClick={handleEliminarProducto}
                    >
                        Continuar
                    </Button>
                </Box>
            </Modal>
        </Box>
  )
}
