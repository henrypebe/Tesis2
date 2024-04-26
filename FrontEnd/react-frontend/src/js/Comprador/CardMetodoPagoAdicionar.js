import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';

export default function CardMetodoPagoAdicionar({metodo, handleOpenModal}) {
  let partes = metodo.fechaExpiracion.split("/");
  let mes = partes[0];
  let año = partes[1].slice(2);

  let formatoDeseado = mes + "/" + año;
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
          Tarjeta guardada
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
          **** **** **** {metodo.last4}
        </Typography>

        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "20px",
            width: "50%",
          }}
        >
          Fecha de caducidad: {formatoDeseado}
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
          CVC: ***
        </Typography>

        <Box sx={{ width: "50%" }}>
          <IconButton onClick={() => {handleOpenModal(metodo);}}>
            <DeleteIcon sx={{ fontSize: "30px" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
