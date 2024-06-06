import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import { BASE_URL } from "../../config";
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

export default function CardReclamo({reclamo, HandleChangeReclamoSeleccionado}) {

  const handleReclamo = async() =>{
    try {
      const response = await fetch(
        `${BASE_URL}/InformacionPedidoReclamo?IdPedido=${reclamo.idPedido}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const valor = await response.json();
        HandleChangeReclamoSeleccionado(valor);
      }
    } catch (error) {
      console.error("Error al obtener la lista de pedidos", error);
      throw new Error("Error al obtener la lista de pedidos");
    }
  }

  const fechaEntrega = new Date(reclamo.fechaEntrega);

  const dia = String(fechaEntrega.getDate()).padStart(2, '0');
  const mes = String(fechaEntrega.getMonth() + 1).padStart(2, '0');
  const anio = fechaEntrega.getFullYear();
  const fechaFormateada = `${dia}/${mes}/${anio}`;

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
      <Box sx={{ display: "flex", flexDirection: "column", width: "65%" }}>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          Pedido ID: {reclamo.idPedido.toFixed(0).padStart(2, '0')}
        </Typography>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          Fecha de entrega: {fechaFormateada}
        </Typography>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          Costo total: S/. {reclamo.total.toFixed(2)}
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
      <Button sx={{ width:"27%", borderRadius:"6px", backgroundColor:reclamo.contieneReclamo?"#850E0E":"#86882D", padding:"5px", height:"70px",
        display:"flex", alignItems:"center", justifyContent:"center", '&:hover':{backgroundColor:reclamo.contieneReclamo?"#850E0E":"#86882D"}}}
        onClick={()=>{handleReclamo();}}
      >
        {reclamo.contieneReclamo?
        (
          <></>
        )
        :
        (
          <ThumbDownOffAltIcon sx={{ fontSize: "50px", color: "white", marginRight:"10px" }} />
        )}
        <Typography sx={{color:"white", textAlign:"center", fontSize:"30px", fontWeight:"bold"}}>
          {reclamo.contieneReclamo? "Contiene reclamo":"Realizar reclamo"}
        </Typography>
      </Button>
    </Box>
  );
}
