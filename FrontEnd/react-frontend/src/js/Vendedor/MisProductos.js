import { Box, Button, Divider, IconButton, TextField, Typography, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CardMisProductos from './CardMisProductos';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MisProductos({setMostrarMisProductos, setMostrarDetalleProducto, setOpcionEditarProducto, setProductoInformacion, setMostrarEditarProducto,
    informacionTienda}) {
    
    const idTienda = informacionTienda.idTienda;
    const [productosList, setProductosList] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [Busqueda, setBusqueda] = useState("");
    const [ModalEliminarProducto, setModalEliminarProducto] = useState(false);

    const handleChangeDetalleProductoVendedor = () =>{
        setMostrarMisProductos(false);
        setMostrarDetalleProducto(true);
    }

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
            fetch(`https://localhost:7240/EliminarProducto?idProducto=${productoSeleccionado.idProducto}`, {
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
            `https://localhost:7240/ListasProductos?idTienda=${idTienda}&busqueda=${Busqueda === ""? "nada" : Busqueda}`,
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
                `https://localhost:7240/ListasProductos?idTienda=${idTienda}&busqueda=${Busqueda === ""? "nada" : Busqueda}`,
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
        obtenerListaProducto();
      }, [idTienda, Busqueda]);

  return (
    <Box sx={{padding:"20px", width:"85.1%", marginTop:"-1.9px", minHeight:"86vh", maxHeight:"auto"}}>
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
            <Box sx={{marginTop:"10px", border:"2px solid black", borderRadius:"6px", width:"100%", padding:"10px"}}>
                <Typography sx={{fontWeight:"bold", fontSize:"24px", marginRight:"200px", color:"#00A307"}}>
                    Producto con mayor venta:
                </Typography>

                <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                    <img src={productosList && productosList[0].imagen} alt="Descripción de la imagen" 
                        style={{height:"110px", maxWidth:"180px", minWidth:"180px"}}
                    />
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
                    <Box sx={{display:"flex", flexDirection:"column", width:"50%"}}>
                        <Typography
                            sx={{
                                color: "black",
                                fontWeight: "bold",
                                fontSize: "24px",
                                width: "100%",
                            }}
                            >
                            {productosList && productosList[0].nombre}
                            </Typography>
                            <Typography
                            sx={{
                                color: "black",
                                fontWeight: "bold",
                                fontSize: "24px",
                                width: "100%",
                            }}
                            >
                            Fecha de creación: {productosList && new Date(productosList[0].fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} {productosList && new Date(productosList[0].fechaCreacion).toLocaleTimeString()}
                            </Typography>
                            <Typography
                            sx={{
                                color: "black",
                                fontWeight: "bold",
                                fontSize: "24px",
                                width: "100%",
                            }}
                            >
                            {productosList && productosList[0].cantidadVentas} {productosList && productosList[0].cantidadVentas>1?"ventas":"venta"} - Cantidad de Stock: <b style={{color:productosList && productosList[0].stock===0?"red":"#286C23"}}>{productosList && productosList[0].stock}</b>
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
                    <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:"20%"}}>
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
                                color: productosList && productosList[0].estadoAprobacion==="Aprobado"?"#019935": 
                                productosList && productosList[0].estadoAprobacion==="Pendiente"?"#999301":"#990A01",
                                fontWeight: "bold",
                                fontSize: "24px",
                            }}
                        >
                            {productosList && productosList[0]? productosList[0].estadoAprobacion === "Pendiente"? "En espera" : productosList[0].estadoAprobacion : ""}
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
                    <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"12%", justifyContent:"center"}}>
                        <IconButton sx={{marginRight:"10px", height:"50%"}} onClick={() => handleChangeEditarProducto(2)}>
                            <EditIcon sx={{fontSize:"40px"}}/>
                        </IconButton>
                        <IconButton sx={{marginRight:"10px", height:"50%"}} onClick={handleChangeDetalleProductoVendedor}>
                            <VisibilityIcon sx={{fontSize:"40px"}}/>
                        </IconButton>
                        <IconButton sx={{marginRight:"10px", height:"50%"}} onClick={() => {handleOpenModal(productosList[0]);}}>
                            <DeleteIcon sx={{fontSize:"40px"}}/>
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        )
        :
        (
            <></>
        )}

        {productosList && productosList.slice(1).map(producto => (
            <CardMisProductos
                key={producto.IdProducto}
                producto={producto}
                setMostrarMisProductos={setMostrarMisProductos}
                setMostrarDetalleProducto={setMostrarDetalleProducto}
                setProductoInformacion={setProductoInformacion}
                setOpcionEditarProducto={setOpcionEditarProducto}
                setMostrarEditarProducto={setMostrarEditarProducto}
                handleOpenModal={handleOpenModal}
            />
        ))}

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
