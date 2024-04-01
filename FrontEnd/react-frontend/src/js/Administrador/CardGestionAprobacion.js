import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function CardGestionAprobacion({setMostrarGestionAprobacion, setMostrarProductoDetalle}) {
    const handleChangeDetalleProducto = () =>{
        setMostrarGestionAprobacion(false);
        setMostrarProductoDetalle(true);
    }
    return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        border: "2px solid black",
        borderRadius: "6px",
        padding: "10px",
      }}
    >
      <img
        src="https://promart.vteximg.com.br/arquivos/ids/570404-1000-1000/22773.jpg?v=637401121588630000"
        alt="Descripción de la imagen"
        style={{ height: "110px" }}
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
          Productos 1
        </Typography>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          Fecha de creación: 17/08/2024
        </Typography>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          10 ventas
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
          "&:hover": { backgroundColor: "#3C9E34" },
        }}
        onClick={handleChangeDetalleProducto}
      >
        <VisibilityIcon sx={{ fontSize: "40px", color: "black" }} />
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          Visualizar
        </Typography>
      </Button>
    </Box>
  );
}
