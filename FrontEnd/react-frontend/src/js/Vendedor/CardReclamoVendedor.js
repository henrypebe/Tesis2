import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

export default function CardReclamoVendedor({reclamo}) {
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
        src={reclamo.fotoProducto}
        alt=""
        style={{ height: "80px", width:"12%" }}
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

      <Box sx={{ display: "flex", flexDirection: "column", width: "60%" }}>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          Producto: {reclamo.nombreProducto}
        </Typography>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          Cliente: {reclamo.nombreCliente} {reclamo.apellidoCliente}
        </Typography>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "24px",
            width: "100%",
          }}
        >
          ID del pedido: {reclamo.pedidoID.toFixed(0).padStart(2, '0')}
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
