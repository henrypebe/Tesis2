import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CardReclamo({seguimiento, obtenerListaSeguimiento}) {

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
      obtenerListaSeguimiento();
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
        width: "93%",
        marginBottom: "10px",
      }}
    >
      <Box sx={{width:"12%", display:"flex", alignItems:"center"}}>
        <img
          src={seguimiento.fotoProducto}
          alt=""
          style={{ height: "80px", width:"100%" }}
        />
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

      <Box sx={{ display: "flex", flexDirection: "column", width: "65%" }}>
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

      {seguimiento && seguimiento.tieneReclamo?
      (
        <Box sx={{border:"2px solid #850E0E", width:"26%", borderRadius:"6px", backgroundColor:"#850E0E", padding:"5px", height:"70px",
          display:"flex", alignItems:"center", justifyContent:"center"}}>
          <Typography sx={{color:"white", textAlign:"center", fontSize:"30px", fontWeight:"bold"}}>
            Reclamado
          </Typography>
        </Box>
      )
      :
      (
        <Button sx={{border:"2px solid #86882D", width:"27%", borderRadius:"6px", backgroundColor:"#86882D", padding:"5px", height:"70px",
          display:"flex", alignItems:"center", justifyContent:"center", '&:hover':{backgroundColor:"#86882D"}}}
          onClick={handleReclamo}
          >
          <ThumbDownOffAltIcon sx={{ fontSize: "50px", color: "white", marginRight:"10px" }} />
          <Typography sx={{color:"white", textAlign:"center", fontSize:"30px", fontWeight:"bold"}}>
            Realizar reclamo
          </Typography>
        </Button>
      )}
    </Box>
  );
}
