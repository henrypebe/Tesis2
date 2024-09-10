import { Box, Button, IconButton, TextField, Typography, Modal, Pagination } from '@mui/material'
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CardMisProductos from './CardMisProductos';
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductoMayorDem from './ProductoMayorDem';
import { BASE_URL } from "../../config";

export default function MisProductos({setMostrarMisProductos, setMostrarDetalleProducto, setOpcionEditarProducto, setProductoInformacion, setMostrarEditarProducto,
    informacionTienda, setOpcionSeleccionado}) {
    
    const idTienda = informacionTienda.idTienda;
    const [productosList, setProductosList] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [Busqueda, setBusqueda] = useState("");
    const [ModalEliminarProducto, setModalEliminarProducto] = useState(false);

    const handleChangeEditarProducto = (value) =>{
        setMostrarMisProductos(false);
        setOpcionEditarProducto(value);
        setMostrarEditarProducto(true);
    }

    const handleOpenModal = (producto) => {
        setModalEliminarProducto(true);
        setProductoSeleccionado(producto);
    };

    const handleCloseModal = () => {
        setModalEliminarProducto(false);
    };

    const styleQuinto = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 1000,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        padding: "10px",
        borderRadius: "8px",
        height: "24%",
    };

    const handleEliminarProducto = async() =>{
        console.log(productoSeleccionado);
        const response = await 
            fetch(`${BASE_URL}/EliminarProducto?idProducto=${productoSeleccionado.idProducto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            toast.success("Producto eliminado", { autoClose: 2000 });
        } else {
            throw new Error("Error al eliminar producto");
        }
        handleCloseModal();
        obtenerListaProducto();
    }

    const obtenerListaProducto = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/ListasProductos?idTienda=${idTienda}&busqueda=${Busqueda === ""? "nada" : Busqueda}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const producto = await response.json();
            setProductosList(producto);
            // console.log(producto);
          } else if (response.status === 404) {
            throw new Error("Productos no encontrado");
          } else {
            throw new Error("Error al obtener la lista de productos");
          }
        } catch (error) {
          console.error("Error al obtener la lista de productos", error);
          throw new Error("Error al obtener la lista de productos");
        }
      };

    useEffect(() => {
        const obtenerListaProducto = async () => {
            try {
              const response = await fetch(
                `${BASE_URL}/ListasProductos?idTienda=${idTienda}&busqueda=${Busqueda === ""? "nada" : Busqueda}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
        
              if (response.ok) {
                const producto = await response.json();
                setProductosList(producto);
                // console.log(producto);
              } else if (response.status === 404) {
                throw new Error("Productos no encontrado");
              } else {
                throw new Error("Error al obtener la lista de productos");
              }
            } catch (error) {
              console.error("Error al obtener la lista de productos", error);
              throw new Error("Error al obtener la lista de productos");
            }
          };
        // obtenerListaProducto();
        const interval = setInterval(() => {
          obtenerListaProducto();
        }, 100);
        return () => clearInterval(interval);
      }, [idTienda, Busqueda]);

    const [currentPage, setCurrentPage] = React.useState(0);
    const rowsPerPage = 4;
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage - 1);
    };

  return (
    <Box sx={{padding:"20px", width:"87%", marginTop:"-1.9px", height:"87.8vh"}}>
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"26px", marginRight:"20px"}}>Mis Productos</Typography>
            <TextField
                id="outlined-basic"
                label="Búsqueda del producto"
                variant="outlined"
                sx={{
                    height: 40,
                    '& .MuiInputBase-root': {
                    height: '100%',
                    },
                }}
                InputProps={{
                    startAdornment: (
                    <SearchIcon sx={{marginRight:"10px"}} />
                    ),
                }}
                defaultValue={Busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />
        </Box>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box display={{display:"flex"}}>
            <Button variant="outlined" sx={{color:"black", borderColor:"black", width:"100%", '&:hover':{borderColor:"black"}}}
            onClick={() => handleChangeEditarProducto(1)}
            >
                Agregar nuevo producto +
            </Button>
        </Box>

        {productosList && productosList.length>0?
        (
            <>
                <Box sx={{height:"82%"}}>
                    {productosList && productosList.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((producto, index) => {
                        const isFirstElement = index === 0;
                        return isFirstElement && currentPage===0 && Busqueda === "" ? 
                        (
                            <ProductoMayorDem productoPrimero={producto} handleOpenModal={handleOpenModal}
                              setMostrarMisProductos={setMostrarMisProductos} setMostrarDetalleProducto={setMostrarDetalleProducto}
                              setOpcionSeleccionado={setOpcionSeleccionado} setProductoInformacion={setProductoInformacion}
                              setOpcionEditarProducto={setOpcionEditarProducto} setMostrarEditarProducto={setMostrarEditarProducto}
                            />
                        )
                        : (
                            <CardMisProductos
                                key={producto.IdProducto}
                                producto={producto}
                                setMostrarMisProductos={setMostrarMisProductos}
                                setMostrarDetalleProducto={setMostrarDetalleProducto}
                                setProductoInformacion={setProductoInformacion}
                                setOpcionEditarProducto={setOpcionEditarProducto}
                                setMostrarEditarProducto={setMostrarEditarProducto}
                                handleOpenModal={handleOpenModal}
                                setOpcionSeleccionado={setOpcionSeleccionado}
                            />
                        );
                    })}
                </Box>
                <Box sx={{ display:"flex", justifyContent:"center", marginTop:"6px"}}>
                    <Pagination count={Math.ceil(productosList.length / rowsPerPage)} page={currentPage + 1} onChange={handleChangePage}/>
                </Box>
            </>
        )
        :
        (
            <></>
        )}

        <Modal
          open={ModalEliminarProducto}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={{ ...styleQuinto }}>
                <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                >
                    <Typography
                        sx={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "30px",
                        width: "100%",
                        paddingLeft:"10px"
                        }}
                    >
                        Eliminar producto
                    </Typography>

                    <IconButton
                        sx={{
                        backgroundColor: "white",
                        color: "black",
                        width: "80px",
                        fontSize: "17px",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "white" },
                        }}
                        onClick={handleCloseModal}
                    >
                        <CancelIcon sx={{ fontSize: "50px" }} />
                    </IconButton>
                </Box>

                <hr
                style={{
                    margin: "10px 0",
                    border: "0",
                    borderTop: "2px solid #ccc",
                    marginTop: "10px",
                    marginBottom: "15px",
                }}
                />

                <Typography
                    sx={{
                    color: "black",
                    fontSize: "30px",
                    width: "100%",
                    textAlign:"center",
                    fontWeight:"bold"
                    }}
                >
                    ¿Desea eliminar el producto {productoSeleccionado? productoSeleccionado.nombre:""}?
                </Typography>

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#1C2536",
                        marginTop: "24px",
                        fontSize: "25px",
                        height: "20%",
                        width: "100%",
                        "&:hover": { backgroundColor: "#1C2536" },
                    }}
                    onClick={handleEliminarProducto}
                >
                    Continuar
                </Button>
            </Box>
        </Modal>

    </Box>
  )
}
