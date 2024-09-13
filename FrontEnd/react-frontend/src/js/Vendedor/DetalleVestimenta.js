import { Box, FormControl, MenuItem, Select, TextField, Typography } from "@mui/material";
import React from "react";

export default function DetalleVestimenta({productoInformacion, opcionEditarProducto, selectedSize,
    handleSizeChange, ColorProducto, setColorProducto
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "50%",
          marginLeft: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
          }}
        >
          <Typography
            sx={{
              color: "black",
              fontSize: "24px",
              width: "100%",
            }}
          >
            Tallas disponibles:
          </Typography>
          <FormControl
            fullWidth
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  borderWidth: "2px",
                },
              },
            }}
          >
            <Select
              labelId="size-select-label"
              id="size-select"
              value={selectedSize}
              onChange={handleSizeChange}
              label="Talla"
              displayEmpty
              sx={{
                padding: "8px 12px",
                height: "42px",
                "& .MuiSelect-select": {
                  padding: "8px 14px",
                },
              }}
            >
              <MenuItem value="" disabled>
                Selecciona una talla
              </MenuItem>
              {[
                "Short (S)",
                "Medium (M)",
                "Large (L)",
                "XL (Extra Large)",
                "XXL (Extra Extra Large)",
              ].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "10px",
            width: "50%",
          }}
        >
          <Typography
            sx={{
              color: "black",
              fontSize: "24px",
              width: "100%",
            }}
          >
            Color:
          </Typography>
          <FormControl
            fullWidth
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  borderWidth: "2px",
                },
              },
            }}
          >
            <TextField
              sx={{
                height: 40,
                "& .MuiInputBase-root": {
                  height: "100%",
                },
              }}
              defaultValue={`${ColorProducto}`}
              onChange={(e) => setColorProducto(e.target.value)}
            />
          </FormControl>
        </Box>
      </Box>
    </>
  );
}
