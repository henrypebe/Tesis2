import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react'

export default function DetalleSeguimientoVendedor({setMostrarSeguimientoVendedor, setMostrarnDetalleSeguimiento}) {
    const handleBackPedido = () => {
        setMostrarSeguimientoVendedor(true);
        setMostrarnDetalleSeguimiento(false);
    };

    return (
        <Box
            sx={{
            padding: "20px",
            width: "85.3%",
            marginTop: "-1.9px",
            minHeight: "84vh",
            maxHeight: "auto",
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
                Pedidos - Tienda 1
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

            <Box
                sx={{ border: "2px solid black", height: "74%", overflowY: "scroll" }}
            >
                
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
                />
                <Button
                variant="contained"
                sx={{
                    backgroundColor: "#1C2536",
                    width: "15%", marginLeft:"10px",
                    "&:hover": { backgroundColor: "#1C2536" },
                }}
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
