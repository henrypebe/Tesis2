import { Box, Typography } from "@mui/material";
import React from "react";

export default function CardEstadisticaCompra({Estadistica, opcion}) {
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - opcion);
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const lastMonthName = monthNames[lastMonth.getMonth()];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "98.65%",
        padding: "5px",
        borderRadius: "6px 6px 0px 0px",
        borderBottom:"2px solid black"
      }}
    >
      <Typography
        sx={{
          color: "black",
          fontWeight: "bold",
          fontSize: "24px",
          width: "70%",
        }}
      >
        {lastMonthName}
      </Typography>
      <Typography
        sx={{
          color: "black",
          fontWeight: "bold",
          fontSize: "24px",
          width: "38.5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        S/.{Estadistica? 
          opcion===1? Estadistica.sumaPreciosPedidosCompletadosMes1.toFixed(2): 
          opcion===2? Estadistica.sumaPreciosPedidosCompletadosMes2.toFixed(2):
          opcion===3? Estadistica.sumaPreciosPedidosCompletadosMes3.toFixed(2): 0
          :0}
      </Typography>
    </Box>
  );
}
