import React from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";

export default function BarraSuperior() {
  const [rol, setRol] = React.useState("");

  const handleChange = (event) => {
    setRol(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#1C1B1B",
        height: "43px",
        alignItems: "center",
        padding: "10px",
        border: "2px solid white",
        alignContent: "center",
        marginLeft:"-1.9px",
        marginRight:"-1.9px",
        width:"98.8%"
      }}
    >
      <MenuBookIcon sx={{ color: "white", marginRight: "20px" }} />
      <Typography sx={{ color: "white", width: "200%" }}>
        Tesis 2 - ¡Bienvenido Henry Pebe!
      </Typography>
      <FormControl
        fullWidth
        sx={{
          width: "40%",
          height: "150%",
          marginTop: "35px",
          "& .MuiOutlinedInput-root": {
            border: "1px solid white",
            height: "60%",
          },
        }}
      >
        <InputLabel id="demo-simple-select-label" sx={{ color: "white", marginTop:"-10px" }}>
          Rol
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={rol}
          label="Rol"
          onChange={handleChange}
          IconComponent={ArrowDropDown}
          sx={{
            color: "white",
            "& .MuiSelect-icon": { color: "white" },
          }}
        >
          <MenuItem value={10}>Comprador</MenuItem>
          <MenuItem value={20}>Vendedor</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        sx={{
          width: "30%",
          marginLeft: "20px",
          backgroundColor: "white",
          color: "black",
          fontWeight: "bold",
          marginTop:"8px",
          "&:hover": {
            backgroundColor: "white",
            color: "black",
            fontWeight: "bold",
          },
        }}
      >
        Perfil
      </Button>
    </Box>
  );
}
