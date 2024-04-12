import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React from 'react'

export default function DetallePedidoAdministrador({setMostrarEstadistica, setMostrarPedidoDetalle, PedidoSeleccionado}) {
    const handleChange = () =>{
        setMostrarPedidoDetalle(false);
        setMostrarEstadistica(true);
    }

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

    const columns = [
        { id: 'nombreProduct', label: 'Producto', minWidth: "auto", maxWidth: "auto"},
        { id: 'nombreTienda', label: 'Tienda', minWidth: "auto", maxWidth: "auto"},
        { id: 'cantidadProduct', label: 'Cantidad', minWidth: 50, maxWidth: 50 },
        { id: 'costoUnitario', label: 'Costo Unitario', minWidth: 50, maxWidth: 50 },
        { id: 'descuento', label: 'Descuento', minWidth: 50, maxWidth: 50 },
        { id: 'total', label: 'Total', minWidth: 50, maxWidth: 50},
        { id: 'contieneReclamo', label: 'Reclamo', minWidth: 50, maxWidth: 50},
    ];

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
        <Box sx={{padding:"20px", width:"80.37%", marginTop:"-1.9px", height:"88vh"}}>
            <Box sx={{display:"flex", flexDirection:"row"}}>
                
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"90%"}}>Pedidos - Tienda 1</Typography>

                <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
                    fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleChange}>
                    Atrás
                </Button>

            </Box>

            <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

            <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Fecha creación:
                </Typography>
                <Typography sx={{color:"black", fontSize:"20px", width:"100%"}}>
                    {PedidoSeleccionado && new Date(PedidoSeleccionado.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Nombre del dueño:
                </Typography>
                <Typography sx={{color:"black", fontSize:"20px", width:"100%"}}>
                    {concatenarNombresDueño(PedidoSeleccionado)}
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Estado:
                </Typography>
                <Typography sx={{color:"black", fontSize:"20px", width:"100%"}}>
                    {PedidoSeleccionado.estado === 1? "Pendiente" : PedidoSeleccionado.estado === 2? "Completado" : PedidoSeleccionado.estado === 3? "Rechazado" : ""}
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Fecha de entrega:
                </Typography>
                <Typography sx={{color:"black", fontSize:"20px", width:"100%"}}>
                    {PedidoSeleccionado && new Date(PedidoSeleccionado.fechaEntrega).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Presenta reclamo:
                </Typography>
                <Typography sx={{color:"black", fontSize:"20px", width:"100%"}}>
                    {PedidoSeleccionado.productosLista.some(producto => producto.tieneReclamo) ? 
                    "Si (" + PedidoSeleccionado.productosLista.filter(producto => producto.tieneReclamo)
                        .map(producto => { const fecha = new Date(producto.fechaReclamo);
                        return fecha.toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'});
                        }).join(", ") + ")" 
                    : "No"}
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Costo total:
                </Typography>
                <Typography sx={{color:"black", fontSize:"20px", width:"100%"}}>
                    S/. {PedidoSeleccionado.total.toFixed(2)}
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"column", marginBottom:"10px", height:"61%"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Productos comprados:
                </Typography>

                <Paper sx={{ width: '100%', overflow: 'hidden', border:"2px solid black", borderRadius:"6px", marginTop:"10px", height:"90%"}}>
                    <TableContainer sx={{ height:"90%" }}>
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
                        {PedidoSeleccionado && PedidoSeleccionado.productosLista.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((producto) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={producto.idProducto} sx={{border:"2px solid black"}}>
                                    <TableCell sx={{width:"10%", fontSize:"16px"}}>{producto.nombreProducto}</TableCell>
                                    <TableCell sx={{textAlign:"center", fontSize:"16px"}}>{producto.nombreTienda}</TableCell>
                                    <TableCell sx={{textAlign:"center", fontSize:"16px"}}>{producto.cantidad}</TableCell>
                                    <TableCell sx={{textAlign:"center", fontSize:"16px"}}>S/. {producto.precio.toFixed(2)}</TableCell>
                                    <TableCell sx={{textAlign:"center", fontSize:"16px"}}>{producto.cantidadOferta}%</TableCell>
                                    <TableCell sx={{textAlign:"center", fontSize:"16px"}}>
                                        S/. {(producto.precio * producto.cantidad - (producto.precio * producto.cantidad*producto.cantidadOferta/100)).toFixed(2)}
                                    </TableCell>
                                    <TableCell sx={{textAlign:"center", width:"20%"}}>
                                        {producto.tieneReclamo? "Contiene reclamo": "No tiene reclamo"}
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
        </Box>
  )
}
