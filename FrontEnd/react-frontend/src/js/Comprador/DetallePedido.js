import { Box, Button, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React, { useEffect } from 'react';
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../config";

export default function DetallePedido({setMostrarDetallePedido, setMostrarPedidos, setMostrarSeguimiento, PedidoSeleccionado, idUsuario, opcionPedidoDetalle}) {
    // console.log(PedidoSeleccionado);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [FinalizarCliente, setFinalizarCliente] = React.useState();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {setOpen(true);};
    const handleClose = () => {setOpen(false);};

    useEffect(() => {
        const handlePedidoCompleteList = async () => {
            try {
              const response = await fetch(
                `${BASE_URL}/ObtenerInformacionChat?IdPedido=${PedidoSeleccionado.idPedido}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
        
              if (response.ok) {
                const valor = await response.json();
                setFinalizarCliente(valor);
                // console.log(valor);
              }
            } catch (error) {
              console.error("Error al obtener la lista de pedidos", error);
              throw new Error("Error al obtener la lista de pedidos");
            }
        };
        handlePedidoCompleteList();
    }, [PedidoSeleccionado.idPedido]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

    const columns = [
        { id: 'nombreProduct', label: 'Nombre', minWidth: 100, maxWidth: 100},
        { id: 'tienda', label: 'Tienda', minWidth: 100, maxWidth: 100},
        { id: 'cantidadProduct', label: 'Cantidad', minWidth: 50, maxWidth: 50 },
        { id: 'costoUnitario', label: 'Costo Unitario', minWidth: 50, maxWidth: 50 },
        { id: 'descuento', label: 'Descuento', minWidth: 70, maxWidth: 70 },
        { id: 'total', label: 'Total', minWidth: 50, maxWidth: 50},
        { id: 'BtnSeguimiento', label: 'Acción', minWidth: 50, maxWidth: 50},
    ];

    const handleBackPedido = () => {
        setMostrarDetallePedido(false);
        setMostrarPedidos(true);
    };

    const handleSinEntregaPedido = async () => {
        try {
            const realizarReclamoResponse = await fetch(
                `${BASE_URL}/RealizarReclamoPedido?idPedido=${PedidoSeleccionado.idPedido}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (!realizarReclamoResponse.ok) {
                throw new Error('Error al realizar el reclamo del pedido');
            }
    
            const actualizarConfirmacionResponse = await fetch(
                `${BASE_URL}/ActualizarConfirmacionPedido?idPedido=${PedidoSeleccionado.idPedido}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (!actualizarConfirmacionResponse.ok) {
                throw new Error('Error al actualizar la confirmación del pedido');
            }
    
            toast.success('El pedido fue reclamado', { autoClose: 2000 });
            handleBackPedido();
        } catch (error) {
            toast.error(error.message, { autoClose: 2000 });
        }
    };    

    const handleConfirmacionPedido = async () =>{
        const response = await fetch(
            `${BASE_URL}/ActualizarConfirmacionPedido?idPedido=${PedidoSeleccionado.idPedido}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            }
        );
        if (response.ok) {
            handleBackPedido();
        }
    }

    const handleSeguimiento = async (producto) => {

        if(!producto.tieneSeguimiento){
            const response = await fetch(
                `${BASE_URL}/EditarSeguimientoPedido?idPedidoXProducto=${producto.idPedidoXProducto}&idUsuario=${idUsuario}&idTienda=${producto.idTienda}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
            );
    
            if (response.ok) {
                setMostrarSeguimiento(true);
                setMostrarDetallePedido(false);
                setMostrarPedidos(false);
            }
        }else{
            setMostrarSeguimiento(true);
            setMostrarDetallePedido(false);
            setMostrarPedidos(false);
        }
    };

    function concatenarNombresTiendas(pedido) {
        const nombresTiendasSet = new Set();
    
        pedido.productosLista.forEach(producto => {
          nombresTiendasSet.add(producto.nombreTienda);
        });
        const nombresTiendasArray = Array.from(nombresTiendasSet);
        const nombresTiendasConcatenados = nombresTiendasArray.join(", ");
    
        return nombresTiendasConcatenados;
    }

    function concatenarNombresDueño(pedido) {
        const nombresTiendasSet = new Set();
    
        pedido.productosLista.forEach(producto => {
          nombresTiendasSet.add(producto.nombreDueño + " " + producto.apellidoDuenho);
        });
        const nombresTiendasArray = Array.from(nombresTiendasSet);
        const nombresTiendasConcatenados = nombresTiendasArray.join(", ");
    
        return nombresTiendasConcatenados;
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 1000,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        padding: "20px",
        borderRadius: "8px",
        height: "auto"
    };

    return (
    <Box sx={{width:"87.1%", marginTop:"-1.9px", height:"89vh", padding:"20px"}}>
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"60%"}}>
                ID Pedido {PedidoSeleccionado.idPedido.toFixed(0).padStart(2, '0')} - {concatenarNombresTiendas(PedidoSeleccionado)}
            </Typography>
            {PedidoSeleccionado.estado === 4? (
                <Box sx={{display:"flex", flexDirection:"row", width:"38%", justifyContent:"flex-end"}}>
                     <Button variant="contained" sx={{backgroundColor:"#86882D", color:"white", border:"2px solid 86882D", width:"36%", 
                    fontSize:"17px", marginRight:"20px",
                    fontWeight:"bold", '&:hover':{backgroundColor:"#86882D"}}} onClick={handleOpen}>
                        Confirmar entrega
                    </Button>
                    <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
                    fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleBackPedido}>
                        Atrás
                    </Button>
                </Box>
            ):
            (
                <Box sx={{display:"flex", flexDirection:"row"}}>
                    {PedidoSeleccionado.reclamoPedido && (
                        <Box sx={{backgroundColor:"#850E0E", height:"40px", width:"200px", padding:"5px", borderRadius:"6px", color:"white", fontWeight:"bold",
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:"23px", marginRight:"10px"}}>
                            Hecho reclamo
                        </Box>
                    )}
                    <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
                    fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleBackPedido}>
                        Atrás
                    </Button>
                </Box>
            )}
            
        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Fecha creación:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                {PedidoSeleccionado && new Date(PedidoSeleccionado.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Nombre del dueño:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                {concatenarNombresDueño(PedidoSeleccionado)}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Estado:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                {PedidoSeleccionado.estado === 1? "Pendiente a entregar" : PedidoSeleccionado.estado === 2? "Completado" : 
                PedidoSeleccionado.estado === 3? "Rechazado" : PedidoSeleccionado.estado === 4? "Pendiente a confirmar" : ""}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Fecha de entrega:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                {PedidoSeleccionado && new Date(PedidoSeleccionado.fechaEntrega).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Box sx={{width:"40%", display:"flex", flexDirection:"row"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"71%"}}>
                    Costo del pedido (sin costo de envío):
                </Typography>
                <Typography sx={{color:"black", fontSize:"24px"}}>
                    S/. {PedidoSeleccionado.total.toFixed(2)}
                </Typography>
            </Box>
            <Box sx={{width:"28%", display:"flex", flexDirection:"row"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"65%"}}>
                    Costo de envío:
                </Typography>
                <Typography sx={{color:"black", fontSize:"24px"}}>
                    S/. {PedidoSeleccionado.costoEnvio.toFixed(2)}
                </Typography>
            </Box>
            <Box sx={{width:"20%", display:"flex", flexDirection:"row"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"55%"}}>
                    Costo total:
                </Typography>
                <Typography sx={{color:"black", fontSize:"24px"}}>
                    S/. {(PedidoSeleccionado.total + PedidoSeleccionado.costoEnvio).toFixed(2)}
                </Typography>
            </Box>
        </Box>

        <Box sx={{display:"flex", flexDirection:"column", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Productos comprados:
            </Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden', border:"2px solid black", borderRadius:"6px", marginTop:"10px", height:"410px"}}>
                <TableContainer sx={{ height:"87%" }}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, maxWidth: column.maxWidth,
                                textAlign: column.id !== 'nombreProduct' ? 'center' : undefined,
                                fontWeight:"bold", fontSize:"18px", borderBottom:"1px solid black"
                            }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>

                    {PedidoSeleccionado && PedidoSeleccionado.productosLista.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((producto) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={producto.idProducto} sx={{border:"2px solid black"}}>
                            <TableCell sx={{minWidth:"250px", maxWidth:"250px", fontSize:"16px"}}>
                                {producto.nombreProducto}{' '}
                                {producto.tipoProducto === 'Vestimenta' ? producto.talla : ''}{' '}
                                {producto.color !== 'NA' ? producto.color : ''}
                            </TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>{producto.nombreTienda}</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>{producto.cantidad}</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>S/. {producto.precio.toFixed(2)}</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>{producto.cantidadOferta}%</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>
                                S/. {(producto.precio * producto.cantidad - (producto.precio * producto.cantidad*producto.cantidadOferta/100)).toFixed(2)}
                            </TableCell>
                            <TableCell sx={{textAlign:"center", width:"20%"}}>
                                {(FinalizarCliente && !FinalizarCliente.finalizarCliente) && (producto.tieneSeguimiento)?
                                (
                                    <>Se finalizó el seguimiento</>
                                )
                                :
                                (
                                    <Button variant="contained" disabled={opcionPedidoDetalle === 0}
                                    sx={{width:"100%", backgroundColor:"#1C2536", '&:hover':{backgroundColor:"#1C2536"}}}
                                    onClick={() => {handleSeguimiento(producto)}}
                                    >
                                        {producto.tieneSeguimiento? "Seguir Seguimiento": "Iniciar Seguimiento"}
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                    })}
                    </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={PedidoSeleccionado.productosLista.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
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
                        }}
                    >
                        Confirmación de entrega de pedido
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
                        onClick={handleClose}
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

                <Box sx={{marginBottom:"20px"}}>
                    <Typography sx={{fontSize:"25px", marginBottom:"10px"}}>
                        Se entregó el pedido con ID {PedidoSeleccionado.idPedido} junto a estos productos:
                    </Typography>
                    {PedidoSeleccionado.productosLista.map((producto, index) => (
                        <ul key={index} style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                            <li style={{fontSize:"23px", marginBottom:"10px", width:"100%"}}>
                                <span style={{ display: 'inline-block', minWidth: "15%", maxWidth: "15%" }}>{producto.nombreProducto}</span>
                                <span> - cantidad: {producto.cantidad}</span>
                            </li>
                        </ul>
                    ))}
                </Box>

                <Box sx={{display:"flex", flexDirection:"row"}}>
                    <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#286C23",
                        width: "50%",
                        marginBottom:"10px",
                        height:"100%",
                        border:"2px solid #286C23",
                        marginRight:"10px",
                        "&:hover": { backgroundColor: "#286C23" },
                    }}
                    onClick={() => {handleConfirmacionPedido()}}
                    >
                        Confirmación de la entrega
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                        backgroundColor: "#C84C31",
                        width: "50%",
                        height:"100%",
                        border:"2px solid #C84C31",
                        "&:hover": { backgroundColor: "#C84C31" },
                        }}
                        onClick={() => {handleSinEntregaPedido()}}
                    >
                        No se entregó
                    </Button>
                </Box>
            </Box>
        </Modal>
    </Box>
  )
}
