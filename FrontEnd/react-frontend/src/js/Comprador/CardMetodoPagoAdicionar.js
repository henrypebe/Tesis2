import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CardMetodoPagoAdicionar() {
  return (
    <Box
      sx={{
        border: "2px solid black",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        padding: "8px",
        width: "70%",
        height: "130px",
        marginBottom:"10px"
      }}
    >
      <Box>
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "26px",
            width: "90%",
          }}
        >
          Tarjeta 1 - Henry Pebe
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "20px",
            width: "50%",
          }}
        >
          **** **** **** 9102
        </Typography>

        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "20px",
            width: "50%",
          }}
        >
          Fecha de caducidad: 12/02
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "20px",
            width: "50%",
          }}
        >
          CVV: ***
        </Typography>

        <Box sx={{ width: "50%" }}>
          <IconButton>
            <EditIcon sx={{ fontSize: "30px" }} />
          </IconButton>

          <IconButton>
            <DeleteIcon sx={{ fontSize: "30px" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
