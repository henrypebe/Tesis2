import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function CardGestionAprobacion({ producto, handleChangeProductoSeleccionado}) {
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
        src={producto.imagen}
        alt="Descripción de la imagen"
        style={{ height: "110px", minWidth:"160px", maxWidth:"160px" }}
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
          {producto.nombre} {producto.talla !== ""? `- ${producto.talla}`: ""} {producto.color !== "NA"? `- ${producto.color}`: ""}
        </Typography>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          Fecha de creación: {new Date(producto.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} {new Date(producto.fechaCreacion).toLocaleTimeString()}
        </Typography>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          {producto.cantidadVentas} {producto.cantidadVentas>1?"ventas":"venta"}
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
        onClick={() => {handleChangeProductoSeleccionado(producto);}}
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
