import React from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DetalleReclamo({ReclamoSeleccionado, setMostrarReclamo, setDetalleReclamo, setReclamoSeleccionado}) {
    
    console.log(ReclamoSeleccionado[0]);

    const HandleReclamar = async(reclamo) =>{
        const response = await fetch(
        `https://localhost:7240/EditarReclamoPedido?idPedidoXProducto=${reclamo.idPedidoXProducto}`,
        {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
        }
        );

        if (response.ok) {
            toast.success('El producto fue reclamado', { autoClose: 2000 });
            handleListarReclamo();
        }
    }

    const handleListarReclamo = async() =>{
        try {
          const response = await fetch(
            `https://localhost:7240/InformacionPedidoReclamo?IdPedido=${ReclamoSeleccionado[0].idPedido}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const valor = await response.json();
            setReclamoSeleccionado(valor);
          }
        } catch (error) {
          console.error("Error al obtener la lista de pedidos", error);
          throw new Error("Error al obtener la lista de pedidos");
        }
      }
    
    const columns = [
        { id: 'nombreProduct', label: 'Nombre', minWidth: 100, maxWidth: 100},
        { id: 'tienda', label: 'Tienda', minWidth: 100, maxWidth: 100},
        { id: 'cantidadProduct', label: 'Cantidad', minWidth: 50, maxWidth: 50 },
        { id: 'costoUnitario', label: 'Costo Unitario', minWidth: 50, maxWidth: 50 },
        { id: 'total', label: 'Total', minWidth: 50, maxWidth: 50},
        { id: 'BtnSeguimiento', label: 'Acción', minWidth: 50, maxWidth: 50},
    ];

    const [currentPage, setCurrentPage] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(2);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleBackPedido = () => {
        setDetalleReclamo(false);
        setMostrarReclamo(true);
    };

    const handleRealizarReclamoPedido = async() => {
        const response = await fetch(
            `https://localhost:7240/RealizarReclamoPedido?idPedido=${ReclamoSeleccionado[0].idPedido}`,
            {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
            }
        );
    
        if (response.ok) {
            toast.success('El pedido fue reclamado', { autoClose: 2000 });
            handleListarReclamo();
        }
    };

    function concatenarNombresTiendas(pedido) {
        if (!pedido || !pedido.productosLista) {
            return "";
        }
    
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

  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"88vh", maxHeight:"88vh"}}>
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Pedidos - {concatenarNombresTiendas(ReclamoSeleccionado[0])}</Typography>
            <Box sx={{width:"40%", display:"flex", flexDirection:"row", justifyContent:"flex-end", alignItems:"center"}}>
                {ReclamoSeleccionado[0].reclamoPedido?
                (
                    <Box sx={{backgroundColor:"#850E0E", height:"40px", width:"270px", padding:"5px", borderRadius:"6px", color:"white", fontWeight:"bold",
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:"23px"}}>
                        Hecho reclamo
                    </Box>
                )
                :
                (
                    <Button variant="contained" sx={{backgroundColor:"#1C2536", color:"white", border:"2px solid black", width:"270px", fontSize:"17px", height:"45px",
                    fontWeight:"bold", '&:hover':{backgroundColor:"#1C2536"}}} onClick={handleRealizarReclamoPedido}>
                        Realizar Reclamo
                    </Button>
                )}
                <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px", marginLeft:"10px",
                fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleBackPedido}>
                    Atrás
                </Button>
            </Box>
        </Box>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />
        
        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Fecha creación:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                {ReclamoSeleccionado && new Date(ReclamoSeleccionado[0].fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Nombre del dueño:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                {concatenarNombresDueño(ReclamoSeleccionado[0])}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Estado:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                {ReclamoSeleccionado[0].estado === 1? "Pendiente" : ReclamoSeleccionado[0].estado === 2? "Completado" : ReclamoSeleccionado[0].estado === 3? "Rechazado" : ""}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Fecha de entrega:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                {ReclamoSeleccionado[0] && new Date(ReclamoSeleccionado[0].fechaEntrega).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Costo total del pedido:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                S/. {ReclamoSeleccionado[0].total.toFixed(2)}
            </Typography>
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

                    {ReclamoSeleccionado[0] && ReclamoSeleccionado[0].productosLista.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((producto) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={producto.idProducto} sx={{border:"2px solid black"}}>
                            <TableCell sx={{minWidth:"250px", maxWidth:"250px", fontSize:"16px"}}>{producto.nombreProducto}</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>{producto.nombreTienda}</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>{producto.cantidad}</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>S/. {producto.precio.toFixed(2)}</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>S/. {(producto.precio * producto.cantidad).toFixed(2)}</TableCell>
                            <TableCell sx={{textAlign:"center", width:"90.4%", display:"flex", alignItems:"center", justifyContent:"center"}}>
                                {producto && producto.tieneReclamo?
                                (
                                    <Box sx={{backgroundColor:"#850E0E", height:"40px", width:"60%", padding:"5px", borderRadius:"6px", color:"white", fontWeight:"bold",
                                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:"23px"}}>
                                        Hecho reclamo
                                    </Box>
                                )
                                :
                                (
                                    <Button variant="contained" sx={{width:"100%", backgroundColor:"#850E0E", '&:hover':{backgroundColor:"#850E0E"}}}
                                    onClick={()=>{HandleReclamar(producto);}}
                                    >
                                        Realizar reclamo
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
                    count={ReclamoSeleccionado[0].productosLista.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    </Box>
  )
}
