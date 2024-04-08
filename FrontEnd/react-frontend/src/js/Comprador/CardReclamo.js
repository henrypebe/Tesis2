import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CardReclamo({seguimiento}) {

  const handleReclamo = async() =>{
    const response = await fetch(
      `https://localhost:7240/EditarReclamoPedido?idPedidoXProducto=${seguimiento.idPedidoXProducto}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      toast.success('El producto fue reclamado', { autoClose: 2000 });
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
      <img
        src={seguimiento.fotoProducto}
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

      <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          {seguimiento.nombreProducto}
        </Typography>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          {seguimiento.nombreTienda}
        </Typography>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          {seguimiento.nombreDuenho} {seguimiento.apellidoDuenho}
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

      {seguimiento.tieneReclamo?
      (
        <Box sx={{border:"2px solid #850E0E", width:"25%", borderRadius:"6px", backgroundColor:"#850E0E", padding:"5px", height:"70px",
          display:"flex", alignItems:"center", justifyContent:"center"}}>
          <Typography sx={{color:"white", textAlign:"center", fontSize:"30px", fontWeight:"bold"}}>
            Reclamado
          </Typography>
        </Box>
      )
      :
      (
        <Button
          sx={{
            width: "26%",
            backgroundColor: "#286C23",
            height: "80%",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "20px",
            flexDirection:"row",
            textAlign:"center",
            "&:hover": { backgroundColor: "#286C23" },
          }}
          onClick={handleReclamo}
        >
          <ThumbDownOffAltIcon sx={{ fontSize: "50px", color: "white", marginRight:"10px" }} />
          <Typography sx={{color:"white", fontSize:"25px", fontWeight:"bold", marginLeft:"0px"}}>Realizar reclamo</Typography>
        </Button>
      )}
    </Box>
  );
}
