import { Box, Button, TextField, Typography, Modal, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

export default function DetalleSeguimiento({
  setMostrarSeguimiento,
  setMostrarDetalleSeguimiento,
  SeguimientoSeleccionado,
  idUsuario
}) {
  
  const [ListaMensaje, setListaMensaje] = useState();
  const [mensajeEnviado, setMensajeEnviado] = useState('');

  const [ModalConfirmar, setModalConfirmar] = useState(false);
  
  const handleBackPedido = () => {
    setMostrarSeguimiento(true);
    setMostrarDetalleSeguimiento(false);
  };

  const handleChangeMensajeEnviado = (e) =>{
    setMensajeEnviado(e.target.value);
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
    padding: "10px",
    borderRadius: "8px",
    height: "31%",
  };

  const obtenerListaMensaje = async () => {
    try {
      const response = await fetch(
        `https://localhost:7240/ListarMensajesChatId?ChatId=${SeguimientoSeleccionado.idChat}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const ListSeguimiento = await response.json();
        setListaMensaje(ListSeguimiento);
        // console.log(ListSeguimiento);
      } else if (response.status === 404) {
        throw new Error("Seguimiento no encontrado");
      } else {
        throw new Error("Error al obtener la lista de seguimientos");
      }
    } catch (error) {
      console.error("Error al obtener la lista de seguimientos", error);
      throw new Error("Error al obtener la lista de seguimientos");
    }
  };

  const HandleCreateMensaje = async () => {
    try {
      const response = await fetch(
        `https://localhost:7240/CreateMensaje?ChatId=${SeguimientoSeleccionado.idChat}&EmisorId=${idUsuario}&Contenido=${mensajeEnviado}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setMensajeEnviado("");
        obtenerListaMensaje();
      } else if (response.status === 404) {
        throw new Error("Seguimiento no encontrado");
      } else {
        throw new Error("Error al obtener la lista de seguimientos");
      }
    } catch (error) {
      console.error("Error al obtener la lista de seguimientos", error);
      throw new Error("Error al obtener la lista de seguimientos");
    }
  };

  useEffect(() => {
    const obtenerListaMensaje = async () => {
        try {
          const response = await fetch(
            `https://localhost:7240/ListarMensajesChatId?ChatId=${SeguimientoSeleccionado.idChat}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const ListSeguimiento = await response.json();
            setListaMensaje(ListSeguimiento);
            // console.log(ListSeguimiento);
          } else if (response.status === 404) {
            throw new Error("Seguimiento no encontrado");
          } else {
            throw new Error("Error al obtener la lista de seguimientos");
          }
        } catch (error) {
          console.error("Error al obtener la lista de seguimientos", error);
          throw new Error("Error al obtener la lista de seguimientos");
        }
      };
      obtenerListaMensaje();
  }, [SeguimientoSeleccionado.idChat]);

  useEffect(() => {
    const obtenerListaMensaje = async () => {
      try {
        const response = await fetch(
          `https://localhost:7240/ListarMensajesChatId?ChatId=${SeguimientoSeleccionado.idChat}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.ok) {
          const ListSeguimiento = await response.json();
          setListaMensaje(ListSeguimiento);
          // console.log(ListSeguimiento);
        } else if (response.status === 404) {
          throw new Error("Seguimiento no encontrado");
        } else {
          throw new Error("Error al obtener la lista de seguimientos");
        }
      } catch (error) {
        console.error("Error al obtener la lista de seguimientos", error);
        throw new Error("Error al obtener la lista de seguimientos");
      }
    };
    const interval = setInterval(() => {
      obtenerListaMensaje();
    }, 100);

    return () => clearInterval(interval);
  }, [SeguimientoSeleccionado.idChat]);

  const scrollContainerRef = useRef(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!userScrolledUp && scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [ListaMensaje, userScrolledUp]);

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;

    // Verifica si el usuario ha desplazado hacia arriba
    if (scrollContainer) {
      setUserScrolledUp(scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight);
    }
  };

  const handleOpen = () => {
    setModalConfirmar(true);
  };
  
  const handleClose = () => {
    setModalConfirmar(false);
  };

  const handleFinalizarChat = async() =>{
    const response = await fetch(
      `https://localhost:7240/FinalizarChatCliente?idChat=${SeguimientoSeleccionado.idChat}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      setMostrarSeguimiento(true);
      setMostrarDetalleSeguimiento(false);
    } else if (response.status === 404) {
      throw new Error("Chat no encontrado");
    } else {
      throw new Error("Error al finalizar el chat");
    }
  }

  return (
    <Box
      sx={{
        padding: "20px",
        width: "85.3%",
        marginTop: "-1.9px",
        minHeight: "88vh",
        maxHeight: "88vh",
      }}
    >
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
            fontSize: "24px",
            width: "100%",
          }}
        >
          Pedidos - {SeguimientoSeleccionado.nombreTienda}
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            width: "150px",
            fontSize: "17px",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "white" },
          }}
          onClick={handleBackPedido}
        >
          Atrás
        </Button>
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

      <Box sx={{border: "2px solid black", height: SeguimientoSeleccionado.finalizarCliente?"91%":"78%", overflowY:"scroll", display:"flex", flexDirection:"column"}} 
        ref={scrollContainerRef} onScroll={handleScroll}>
        {ListaMensaje && ListaMensaje.map((mensaje) => (
          <Box
            sx={{ display:"flex", alignItems:mensaje.esTienda?"flex-start":"flex-end",
            flexDirection:"column" }}
          >
            <Typography
              key={mensaje.idMensaje}
              sx={{border:"2px solid black", width:"40%", padding:"10px", borderRadius:"6px", marginBottom:"10px"}}
            >
              <b>{mensaje.nombreEmisor} {mensaje.apellidoEmisor} {mensaje.esTienda?"":"(yo)"}:</b> {mensaje.contenido}
            </Typography>
          </Box>
        ))}
      </Box>

      {SeguimientoSeleccionado && !SeguimientoSeleccionado.finalizarCliente?
      (
        <>
          <Box sx={{ display: "flex", flexDirection: "row", marginTop:"10px", height:"6%", marginBottom:"10px"}}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              sx={{
                height: 40,
                width:"90%",
                '& .MuiInputBase-root': {
                  height: '100%',
                },
              }}
              value={mensajeEnviado}
              onChange={handleChangeMensajeEnviado}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1C2536",
                width: "15%", marginLeft:"10px",
                "&:hover": { backgroundColor: "#1C2536" },
              }}
              onClick={HandleCreateMensaje}
            >
              Enviar mensaje
            </Button>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1C2536",
              width: "100%",
              "&:hover": { backgroundColor: "#1C2536" },
            }}
            onClick={handleOpen}
          >
            Finalizar seguimiento
          </Button>
        </>
      ):
      (
        <></>
      )}

      <Modal
          open={ModalConfirmar}
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
                Confirmación de la finalización del seguimiento
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
                marginBottom: "30px",
              }}
            />

            <Box sx={{display:"flex", justifyContent:"center"}}>
              <Typography
                  sx={{
                    color: "black",
                    fontSize: "26px",
                    width: "80%",
                    textAlign:"center"
                  }}
              >
                  ¿Seguro que desea finalizar el chat sobre el producto? (se cerrará definitivamente)
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1C2536",
                marginTop: "25px",
                fontSize: "25px",
                height: "20%",
                width: "100%",
                "&:hover": { backgroundColor: "#1C2536" },
              }}
              onClick={handleFinalizarChat}
            >
              Confirmar
            </Button>
          </Box>
        </Modal>
    </Box>
  );
}
