import { Box, Button, Divider, Typography } from '@mui/material'
import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function CardGestionAprobacionTienda({tienda, handleChangeTiendaSeleccionado}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        border: "2px solid black",
        borderRadius: "6px",
        padding: "10px",
        marginBottom:"10px"
      }}
    >
        <img
            src={tienda.foto}
            alt="Descripción de la imagen"
            style={{ height: "70px", minWidth:"120px", maxWidth:"120px", color:"black" }}
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

        <Box sx={{ display: "flex", flexDirection: "column", width: "70%" }}>
            <Typography
            sx={{
                color: "black",
                fontWeight: "bold",
                fontSize: "24px",
                width: "100%",
            }}
            >
            Tienda: {tienda.nombre}
            </Typography>
            <Typography
            sx={{
                color: "black",
                fontWeight: "bold",
                fontSize: "24px",
                width: "100%",
            }}
            >
            Nombre del dueño: {tienda.nombreDueño} {tienda.apellidoDueño}
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

        <Button
            sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "12%",
            justifyContent: "center",
            border: "2px solid black",
            backgroundColor: "#3C9E34",
            height:"70px",
            "&:hover": { backgroundColor: "#3C9E34" },
            }}
            onClick={() => {handleChangeTiendaSeleccionado(tienda);}}
        >
            <VisibilityIcon sx={{ fontSize: "30px", color: "black" }} />
            <Typography
            sx={{
                color: "black",
                fontWeight: "bold",
                fontSize: "20px",
                width: "100%",
            }}
            >
            Visualizar
            </Typography>
        </Button>
    </Box>
  )
}
