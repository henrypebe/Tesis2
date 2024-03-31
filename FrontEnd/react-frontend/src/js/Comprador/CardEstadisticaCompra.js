import { Box, Typography } from "@mui/material";
import React from "react";

export default function CardEstadisticaCompra() {
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
        Abril
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
        S/.45.00
      </Typography>
    </Box>
  );
}
