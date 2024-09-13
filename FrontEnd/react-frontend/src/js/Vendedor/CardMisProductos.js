import { Box, Divider, IconButton, Typography } from "@mui/material";
import React from "react";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CardMisProductos({producto, setMostrarMisProductos, setMostrarDetalleProducto, setProductoInformacion, 
  setOpcionEditarProducto, setMostrarEditarProducto, handleOpenModal, setOpcionSeleccionado}) {
    const handleChangeDetalleProductoVendedor = () =>{
        setMostrarMisProductos(false);
        setMostrarDetalleProducto(true);
        setProductoInformacion(producto);
        setOpcionSeleccionado(0);
    }

    const handleChangeEditarProducto = () =>{
        setMostrarMisProductos(false);
        setProductoInformacion(producto);
        setOpcionEditarProducto(0);
        setMostrarEditarProducto(true);
    }

    // console.log(producto);
    return (
    <Box
      sx={{
        marginTop: "20px",
        border: "2px solid black",
        borderRadius: "6px",
        width: "98.5%",
        padding: "10px",
        marginBottom:"20px"
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", alignItems:"center" }}>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          style={{ height: "110px", maxWidth:"180px", minWidth:"180px" }}
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
            {producto.nombre} {producto.tipoProducto === "Vestimenta"? `- ${producto.talla} - ${producto.color}`:""}
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
            {producto.cantidadVentas} {producto.cantidadVentas>1?"ventas":"venta"} - Cantidad de Stock: <b style={{color:producto.stock===0?"red":"#286C23"}}>{producto.stock}</b>
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
              color: producto.estadoAprobacion==="Aprobado"?"#019935": producto.estadoAprobacion==="Pendiente"?"#999301":"#990A01",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            {producto.estadoAprobacion === "Pendiente"? "En espera" : producto.estadoAprobacion}
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
          <IconButton sx={{ marginRight: "10px", height: "50%" }} onClick={()=>{handleChangeDetalleProductoVendedor();}}>
            <VisibilityIcon sx={{ fontSize: "40px" }} />
          </IconButton>
          <IconButton sx={{marginRight:"10px", height:"50%"}} onClick={() => {handleOpenModal(producto);}}>
            <DeleteIcon sx={{fontSize:"40px"}}/>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
