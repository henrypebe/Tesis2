import { Box, Button, Divider, Typography } from '@mui/material';
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatIcon from '@mui/icons-material/Chat';

export default function CardSeguimientoVendedor({setMostrarSeguimientoVendedor, setMostrarnDetalleSeguimiento}) {
    const handleChangeDetalleSeguimiento = () =>{
        setMostrarSeguimientoVendedor(false);
        setMostrarnDetalleSeguimiento(true);
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
        marginBottom:"10px"
        }}
    >
        <img
            src="https://img.freepik.com/vector-gratis/etiqueta-engomada-caja-vacia-abierta-sobre-fondo-blanco_1308-68243.jpg?size=626&ext=jpg&ga=GA1.1.1319243779.1711411200&semt=ais"
            alt=""
            style={{ height: "80px" }}
        />

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

        <Box sx={{ display: "flex", flexDirection: "column", width: "40%" }}>
            <Typography
            sx={{
                color: "black",
                fontWeight: "bold",
                fontSize: "24px",
                width: "100%",
            }}
            >
            Pedido 1
            </Typography>
            <Typography
            sx={{
                color: "black",
                fontWeight: "bold",
                fontSize: "24px",
                width: "100%",
            }}
            >
            Cliente 1
            </Typography>
            <Typography
            sx={{
                color: "black",
                fontWeight: "bold",
                fontSize: "24px",
                width: "100%",
            }}
            >
            Fecha 1
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

        <Box
            sx={{
            display: "flex",
            flexDirection: "column",
            width: "20%",
            justifyContent: "center"
            }}
        >
            <Typography
            sx={{
                color: "black",
                fontWeight: "bold",
                fontSize: "28px",
                width: "100%",
                textAlign: "center",
            }}
            >
            Estado:
            </Typography>
            <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
            }}
            >
            <CheckCircleIcon sx={{ color: "#286C23", fontSize: "26px" }} />
            <Typography
                sx={{ color: "#286C23", fontWeight: "bold", fontSize: "26px" }}
            >
                Solucionado
            </Typography>
        </Box>

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

        <Button
            sx={{
            width: "15%",
            backgroundColor: "#286C23",
            height: "80%",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "40px",
            "&:hover": { backgroundColor: "#286C23" },
            }}
            onClick={handleChangeDetalleSeguimiento}
        >
            <ChatIcon sx={{ fontSize: "60px", color: "black" }} />
        </Button>

    </Box>
  )
}
