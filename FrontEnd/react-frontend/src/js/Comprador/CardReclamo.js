import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

export default function CardReclamo() {
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
        src="https://img.freepik.com/vector-gratis/etiqueta-engomada-caja-vacia-abierta-sobre-fondo-blanco_1308-68243.jpg?size=626&ext=jpg&ga=GA1.1.1319243779.1711411200&semt=ais"
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
          Tienda 1
        </Typography>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          Pepito Alvez
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
          width: "25%",
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
      >
        <ThumbDownOffAltIcon sx={{ fontSize: "50px", color: "white", marginRight:"10px" }} />
        <Typography sx={{color:"white", fontSize:"25px", fontWeight:"bold", marginLeft:"0px"}}>Realizar reclamo</Typography>
      </Button>
    </Box>
  );
}
