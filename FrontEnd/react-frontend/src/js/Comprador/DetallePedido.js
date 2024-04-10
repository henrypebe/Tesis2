import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React from 'react'

export default function DetallePedido({setMostrarDetallePedido, setMostrarPedidos, setMostrarSeguimiento, PedidoSeleccionado, idUsuario}) {
    // console.log(PedidoSeleccionado);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
        { id: 'total', label: 'Total', minWidth: 50, maxWidth: 50},
        { id: 'BtnSeguimiento', label: 'Acción', minWidth: 50, maxWidth: 50},
    ];

    const handleBackPedido = () => {
        setMostrarDetallePedido(false);
        setMostrarPedidos(true);
    };

    const handleSeguimiento = async (producto) => {

        if(!producto.tieneSeguimiento){
            const response = await fetch(
                `https://localhost:7240/EditarSeguimientoPedido?idPedidoXProducto=${producto.idPedidoXProducto}&idUsuario=${idUsuario}&idTienda=${producto.idTienda}`,
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

    return (
    <Box sx={{width:"87.6%", marginTop:"-1.9px", height:"86vh", padding:"20px"}}>
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Pedidos - {concatenarNombresTiendas(PedidoSeleccionado)}</Typography>
            <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
            fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleBackPedido}>
                Atrás
            </Button>
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
                {PedidoSeleccionado.estado === 1? "Pendiente" : PedidoSeleccionado.estado === 2? "Completado" : PedidoSeleccionado.estado === 3? "Rechazado" : ""}
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
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Costo total del pedido:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                S/. {PedidoSeleccionado.total.toFixed(2)}
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

                    {PedidoSeleccionado && PedidoSeleccionado.productosLista.map((producto) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={producto.idProducto} sx={{border:"2px solid black"}}>
                            <TableCell sx={{minWidth:"250px", maxWidth:"250px", fontSize:"16px"}}>{producto.nombreProducto}</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>{producto.nombreTienda}</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>{producto.cantidad}</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>S/. {producto.precio.toFixed(2)}</TableCell>
                            <TableCell sx={{textAlign:"center", fontSize:"16px"}}>S/. {(producto.precio * producto.cantidad).toFixed(2)}</TableCell>
                            <TableCell sx={{textAlign:"center", width:"20%"}}>
                                <Button variant="contained" sx={{width:"100%", backgroundColor:"#1C2536", '&:hover':{backgroundColor:"#1C2536"}}}
                                    onClick={() => {handleSeguimiento(producto)}}
                                >
                                    {producto.tieneSeguimiento? "Seguir Seguimiento": "Iniciar Seguimiento"}
                                </Button>
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
