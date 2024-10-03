import { Box, Button, Divider, Typography } from '@mui/material'
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../config";

export default function CardGestionVendedor({vendedor, handleInformacionVendedorAsistente, opcionPendiente}) {
//   console.log(vendedor);
  
  const handleCreateUser = async (estado) => {
    try {
      const response = await 
        fetch(`${BASE_URL}/AprobaciónVendedorAsistente?idUsuario=${vendedor.idUsuario}&Estado=${estado}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            handleInformacionVendedorAsistente();
        } else {
            if (response.status === 400) {
            const errorMessage = await response.text();
                toast.error(errorMessage);
            } else {
                toast.error('Error al gestionar la aprobación del asistente.');
            }
        }
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
    }
  }
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "100px",
        border: "2px solid black",
        padding: "10px",
        borderRadius: "10px",
        width: "90%",
        marginBottom: "10px",
      }}
    >
        <Box sx={{ display: "flex", flexDirection: "column", width: "60%" }}>
            <Typography
                sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "24px",
                    width: "100%",
                }}
            >
                {vendedor.nombre} {vendedor.apellido}
            </Typography>
            <Typography
                sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "24px",
                    width: "100%",
                }}
            >
                Correo electrónico: {vendedor.correo}
            </Typography>
            <Typography
                sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "24px",
                    width: "100%",
                }}
            >
                DNI: {vendedor.dni}
            </Typography>
        </Box>

        <Divider
            orientation="vertical"
            flexItem
            sx={{
            backgroundColor: "black",
            height: "auto",
            marginRight: "20px",
            marginLeft: "20px",
            border: "2px solid black",
            }}
        />

        <Box sx={{display:"flex", flexDirection:"column", width:"35%"}}>
            {opcionPendiente === 1?
            (
                <>
                    <Button
                        variant="contained"
                        sx={{
                        backgroundColor: "#286C23",
                        width: "100%",
                        marginBottom:"10px",
                        "&:hover": { backgroundColor: "#286C23" },
                        }}
                        onClick={() => {handleCreateUser(1);}}
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
                        onClick={() => {handleCreateUser(3);}}
                    >
                        Rechazar
                    </Button>
                </>
            )
            :
            (
                <>
                    <Button
                        variant="contained"
                        sx={{
                        backgroundColor: "#77882b",
                        width: "100%",
                        "&:hover": { backgroundColor: "#77882b" },
                        }}
                        onClick={() => {handleCreateUser(2);}}
                    >
                        Retirar de la tienda
                    </Button>
                </>
            )}
        </Box>
    </Box>
  )
}
