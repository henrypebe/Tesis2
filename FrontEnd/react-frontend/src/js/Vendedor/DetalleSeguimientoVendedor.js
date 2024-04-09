import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'

export default function DetalleSeguimientoVendedor({setMostrarSeguimientoVendedor, setMostrarnDetalleSeguimiento, SeguimientoSeleccionado,
    informacionTienda}) {
    const [ListaMensaje, setListaMensaje] = useState();
    const [mensajeEnviado, setMensajeEnviado] = useState('');
    
    const handleBackPedido = () => {
        setMostrarSeguimientoVendedor(true);
        setMostrarnDetalleSeguimiento(false);
    };

    const handleChangeMensajeEnviado = (e) =>{
        setMensajeEnviado(e.target.value);
    }

    const obtenerListaMensaje = async () => {
        try {
          const response = await fetch(
            `https://localhost:7240/ListarMensajesTiendaChatId?ChatId=${SeguimientoSeleccionado.idChat}`,
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
            `https://localhost:7240/CreateMensajeTienda?ChatId=${SeguimientoSeleccionado.idChat}&EmisorId=${informacionTienda.idTienda}&Contenido=${mensajeEnviado}`,
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
                `https://localhost:7240/ListarMensajesTiendaChatId?ChatId=${SeguimientoSeleccionado.idChat}`,
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
                console.log(ListSeguimiento);
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

    return (
        <Box
            sx={{
            padding: "20px",
            width: "85.3%",
            marginTop: "-1.9px",
            minHeight: "86vh",
            maxHeight: "86vh",
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
                Pedidos - {SeguimientoSeleccionado.nombreProducto}
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
            <Box sx={{border: "2px solid black", height: "74%", overflowY: "scroll", display:"flex", flexDirection:"column"}} 
                ref={scrollContainerRef} onScroll={handleScroll}>
                {ListaMensaje && ListaMensaje.map((mensaje) => (
                    <Box
                        sx={{ display:"flex", alignItems:mensaje.esTienda?"flex-end":"flex-start",
                        flexDirection:"column" }}
                    >
                        <Typography
                            key={mensaje.idMensaje}
                            sx={{border:"2px solid black", width:"40%", padding:"10px", borderRadius:"6px", marginBottom:"10px"}}
                        >
                            <b>{mensaje.nombreEmisor} {mensaje.apellidoEmisor} (yo):</b> {mensaje.contenido}
                        </Typography>
                    </Box>
                ))}
            </Box>

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
            >
                Finalizar seguimiento
            </Button>
        </Box>
    )
}
