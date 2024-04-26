import { Box, Button, Typography } from "@mui/material";
import React from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function BarraSuperiorPresentacion() {
  const HandleLogin = () =>{
    window.location.href = `/Login`;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#CC984B",
        height: "43px",
        alignItems: "center",
        padding: "10px",
        border: "2px solid white",
        alignContent: "center",
        marginLeft: "-1.9px",
        marginRight: "-1.9px",
        width: "98.8%",
        marginTop:"-1.8px"
      }}
    >
      <MenuBookIcon
        sx={{ color: "black", marginRight: "20px", fontSize: "30px" }}
      />
      <Typography
        sx={{
          color: "black",
          width: "200%",
          fontWeight: "bold",
          fontSize: "25px",
        }}
      >
        Tesis 2 - ¡Bienvenido!
      </Typography>
      <Button
        variant="contained"
        sx={{
          width: "30%",
          marginLeft: "20px",
          backgroundColor: "white",
          color: "black",
          fontWeight: "bold",
          marginTop: "0px",
          fontSize: "20px",
          "&:hover": {
            backgroundColor: "white",
            color: "black",
            fontWeight: "bold",
          },
        }}
        onClick={()=>{HandleLogin()}}
      >
        Login
      </Button>
    </Box>
  );
}
