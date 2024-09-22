import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import React from "react";

export default function DetalleVestimenta({
  selectedSize,
  handleSizeChange,
}) {
  return (
    <>
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
    </>
  );
}
