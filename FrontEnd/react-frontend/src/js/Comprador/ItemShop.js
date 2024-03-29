import { Box, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export default function ItemShop({item}) {
    const [count, setCount] = useState(1);

    const handleDecrease = () => {
      if (count > 0) {
        setCount(count - 1);
      }
    };
  
    const handleIncrease = () => {
      setCount(count + 1);
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
        <img
          src={item.image}
          alt=""
          style={{ height: "70px" }}
        />
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
          {item.name}
        </Typography>
        <Typography sx={{ fontSize: "25px" }}>{item.price}</Typography>
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
            {count}
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
