import { Box, Button, Checkbox, CircularProgress, Typography } from "@mui/material";
import React, { useState } from "react";

export default function CardMetodoPagoComprador({
  metodo,
  handleCheckboxChange,
  selectedMethodId,
  handleProducto
}) {

  const [loading, setLoading] = useState(false);
  const handleClickPagar = async () => {
    setLoading(true); 
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await handleProducto(metodo);
    } catch (error) {
      console.error("Error al procesar el pago", error);
    } finally {
      setLoading(false); 
    }
  };

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
        <Checkbox checked={selectedMethodId === metodo.idMetodoPago} onChange={() => handleCheckboxChange(metodo.idMetodoPago)}/>
        <Typography sx={{ fontSize: "24px", fontWeight: "bold", marginRight:"20px" }}>
          Tarjeta - {metodo.last4}
        </Typography>
        {selectedMethodId === metodo.idMetodoPago && (
          <Button variant="contained" sx={{width:"18%", marginTop:"0px", backgroundColor:"#286C23", marginRight:"10px", '&:hover':{backgroundColor:"#286C23"}}} 
            onClick={()=>{handleClickPagar()}} disabled={loading}>
           {loading ? <CircularProgress size={24} thickness={5} sx={{ color: "white" }}/> : "Pagar"}
          </Button>
        )}
      </Box>
    </Box>
  );
}
