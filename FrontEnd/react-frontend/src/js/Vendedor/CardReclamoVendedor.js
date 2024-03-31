import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

export default function CardReclamoVendedor() {
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
        width: "80%",
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

      <Box sx={{backgroundColor:"#850E0E", padding:"10px", width:"15%", display:"flex", justifyContent:"center", alignItems:"center", textAlign:"center",
        height:"45%", borderRadius:"6px", marginLeft:"30px"}}>
        <Typography
            sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "24px",
                width: "100%",
            }}
        >
          Reclamado
        </Typography>
      </Box>
    </Box>
  )
}
