import { Box, Button, Checkbox, Typography } from "@mui/material";
import React from "react";

export default function CardMetodoPagoComprador({
  metodo,
  handleCheckboxChange,
  selectedMethodId,
  HandleProcesoPago
}) {

  return (
    <Box
      sx={{
        border: "2px solid black",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "10px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Checkbox checked={selectedMethodId === metodo.id} onChange={() => handleCheckboxChange(metodo.id)}/>
        <Typography sx={{ fontSize: "24px", fontWeight: "bold", marginRight:"20px" }}>
          Tarjeta - {metodo.last4}
        </Typography>
        {selectedMethodId === metodo.id && (
          <Button variant="contained" sx={{width:"18%", marginTop:"0px", backgroundColor:"#286C23", marginRight:"10px", '&:hover':{backgroundColor:"#286C23"}}} 
            onClick={()=>{HandleProcesoPago(metodo);}}>
            Pagar
          </Button>
        )}
      </Box>
    </Box>
  );
}
