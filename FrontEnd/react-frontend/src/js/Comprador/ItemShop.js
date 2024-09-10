import { Box, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ItemShop({producto, onCantidadChange, conteoCarritoCompra, setConteoCarritoCompra}) {
    
  const [cantidad, setCantidad] = useState(producto.cantidad);

    // console.log(producto);

    const handleDecrease = () => {
      if (cantidad > 0) {
        setCantidad(cantidad - 1);
        onCantidadChange(producto.idProducto, cantidad-1);
        setConteoCarritoCompra(conteoCarritoCompra - 1);
    }
    };
  
    const handleIncrease = () => {
      if(cantidad + 1 <= producto.stockMaximo){
        setCantidad(cantidad+1);
        onCantidadChange(producto.idProducto, cantidad+1);
        setConteoCarritoCompra(conteoCarritoCompra + 1);
      }else{
        toast.error("¡Ya no hay stock disponible para este producto!");
      }
    };
    return (
    <Box sx={{ display: "flex", flexDirection: "row", marginBottom:"10px"}}>
      <Box
        sx={{
          backgroundColor: "#D9D9D9",
          width: "100px",
          height: "100px",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {producto.imagen && <img src={producto.imagen} alt="Preview" style={{ height: "100%", minWidth:"98%", maxWidth:"100%", objectFit: 'cover', borderRadius:"6px" }} />}
        
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "60%",
          marginLeft: "15px",
        }}
      >
        <Typography sx={{ fontSize: "25px" }}>
          {producto.nombreProducto} - {producto.tipoProducto} {producto.talla !== ""? `- Talla ${producto.talla}` : ""}
        </Typography>
        <Box sx={{display:"flex", flexDirection:"row"}}>
          <Typography sx={{ fontSize: "25px", marginRight:"10px"}}>S/. {producto.precio.toFixed(2)}</Typography>
          {producto.cantidadOferta>0?
          (
            <Typography sx={{borderRadius:"5px", padding:"5px", border:"2px solid red", color:"red", fontSize:"14px", fontWeight:"bold"}}>
              {producto.cantidadOferta}% OFF
            </Typography>
          )
          :
          (
            <></>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          marginLeft: "15px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <IconButton
          sx={{ height: "60px", width: "60px", marginRight: "10px" }}
          onClick={handleDecrease}
        >
          <RemoveIcon />
        </IconButton>

        <Box
          sx={{
            backgroundColor: "#D9D9D9",
            width: "100px",
            height: "50%",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
            {cantidad}
          </Typography>
        </Box>

        <IconButton
          sx={{ height: "60px", width: "60px", marginLeft: "10px" }}
          onClick={handleIncrease}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
