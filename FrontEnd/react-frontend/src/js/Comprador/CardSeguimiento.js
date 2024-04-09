import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ChatIcon from '@mui/icons-material/Chat';

export default function CardSeguimiento({HandleChangeSeguimientoSeleccionado, seguimiento}) {
  
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
        src={seguimiento.fotoProducto}
        alt=""
        style={{ height: "80px", width:"10%" }}
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "20%",
          justifyContent: "center",
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
          {seguimiento.estadoPedido === 1?
          (
            <ReportProblemIcon sx={{ color: "#86882D", fontSize: "26px" }}/>
          )
          :
          (
            <CheckCircleIcon sx={{ color: "#286C23", fontSize: "26px" }} />
          )}
          <Typography
            sx={{ color: seguimiento.estadoPedido?"#86882D" : "#286C23", fontWeight: "bold", fontSize: "26px", marginLeft:"10px" }}
          >
            {seguimiento.estadoPedido === 1? "Pendiente": seguimiento.estadoPedido === 2? "Completado" : ""}
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
        onClick={() => {HandleChangeSeguimientoSeleccionado(seguimiento);}}
      >
        <ChatIcon sx={{ fontSize: "60px", color: "black" }} />
      </Button>
    </Box>
  );
}
