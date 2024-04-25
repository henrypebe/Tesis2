import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Divider, IconButton, Typography} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ProductoMayorDem({productoPrimero, handleChangeEditarProducto, handleOpenModal, setMostrarMisProductos, setMostrarDetalleProducto,
  setOpcionSeleccionado}) {
    const handleChangeDetalleProductoVendedor = () =>{
        setMostrarMisProductos(false);
        setMostrarDetalleProducto(true);
        setOpcionSeleccionado(0);
    }
    return (
    <Box
      sx={{
        marginTop: "10px",
        border: "2px solid black",
        borderRadius: "6px",
        width: "98.5%",
        padding: "10px",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "24px",
          marginRight: "200px",
          color: "#00A307",
        }}
      >
        Producto con mayor venta:
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <img
          src={productoPrimero && productoPrimero.imagen}
          alt="Descripción de la imagen"
          style={{ height: "110px", maxWidth: "180px", minWidth: "180px" }}
        />
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            backgroundColor: "black",
            height: "auto",
            marginRight: "20px",
            marginLeft: "20px",
            border: "2px solid black",
          }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <Typography
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: "24px",
              width: "100%",
            }}
          >
            {productoPrimero && productoPrimero.nombre}
          </Typography>
          <Typography
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: "24px",
              width: "100%",
            }}
          >
            Fecha de creación:{" "}
            {productoPrimero &&
              new Date(productoPrimero.fechaCreacion).toLocaleDateString(
                "es-ES",
                { day: "2-digit", month: "2-digit", year: "numeric" }
              )}{" "}
            {productoPrimero &&
              new Date(productoPrimero.fechaCreacion).toLocaleTimeString()}
          </Typography>
          <Typography
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: "24px",
              width: "100%",
            }}
          >
            {productoPrimero && productoPrimero.cantidadVentas}{" "}
            {productoPrimero && productoPrimero.cantidadVentas > 1
              ? "ventas"
              : "venta"}{" "}
            - Cantidad de Stock:{" "}
            <b
              style={{
                color:
                productoPrimero && productoPrimero.stock === 0
                    ? "red"
                    : "#286C23",
              }}
            >
              {productoPrimero && productoPrimero.stock}
            </b>
          </Typography>
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            backgroundColor: "black",
            height: "auto",
            marginRight: "20px",
            marginLeft: "20px",
            border: "2px solid black",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "20%",
          }}
        >
          <Typography
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            Estado:
          </Typography>
          <Typography
            sx={{
              color:
                productoPrimero &&
                productoPrimero.estadoAprobacion === "Aprobado"
                  ? "#019935"
                  : productoPrimero &&
                    productoPrimero.estadoAprobacion === "Pendiente"
                  ? "#999301"
                  : "#990A01",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            {productoPrimero && productoPrimero
              ? productoPrimero.estadoAprobacion === "Pendiente"
                ? "En espera"
                : productoPrimero.estadoAprobacion
              : ""}
          </Typography>
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            backgroundColor: "black",
            height: "auto",
            marginRight: "20px",
            marginLeft: "20px",
            border: "2px solid black",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "12%",
            justifyContent: "center",
          }}
        >
          <IconButton
            sx={{ marginRight: "10px", height: "50%" }}
            onClick={() => handleChangeEditarProducto(2)}
          >
            <EditIcon sx={{ fontSize: "40px" }} />
          </IconButton>
          <IconButton
            sx={{ marginRight: "10px", height: "50%" }}
            onClick={handleChangeDetalleProductoVendedor}
          >
            <VisibilityIcon sx={{ fontSize: "40px" }} />
          </IconButton>
          <IconButton
            sx={{ marginRight: "10px", height: "50%" }}
            onClick={() => {
              handleOpenModal(productoPrimero);
            }}
          >
            <DeleteIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
