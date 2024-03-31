import { Box, Divider, IconButton, Typography } from "@mui/material";
import React from "react";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function CardMisProductos({setMostrarMisProductos, setMostrarDetalleProducto, setMostrarEditarProducto}) {
    const handleChangeDetalleProductoVendedor = () =>{
        setMostrarMisProductos(false);
        setMostrarDetalleProducto(true);
    }

    const handleChangeEditarProducto = () =>{
        setMostrarMisProductos(false);
        setMostrarEditarProducto(true);
    }

    return (
    <Box
      sx={{
        marginTop: "10px",
        border: "2px solid black",
        borderRadius: "6px",
        width: "100%",
        padding: "10px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
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
        <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "20%",
          }}
        >
          <Typography
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            Estado:
          </Typography>
          <Typography
            sx={{
              color: "#019935",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            Aprobado
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
            flexDirection: "row",
            alignItems: "center",
            width: "12%",
            justifyContent: "center",
          }}
        >
          <IconButton sx={{ marginRight: "10px", height: "50%" }} onClick={handleChangeEditarProducto}>
            <EditIcon sx={{ fontSize: "40px" }} />
          </IconButton>
          <IconButton sx={{ marginRight: "10px", height: "50%" }} onClick={handleChangeDetalleProductoVendedor}>
            <VisibilityIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
