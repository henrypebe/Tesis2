import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import React from 'react'

export default function DetalleVenta({setMostrarVentas, setMostrarDetalleVenta, setMostrarSeguimientoVendedor, VentaSeleccionada, informacionTienda}) {

    // console.log(VentaSeleccionada);

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
        { id: 'nombreProduct', label: 'Nombre', minWidth: 200, maxWidth: 200},
        { id: 'cantidadProduct', label: 'Cantidad', minWidth: 50, maxWidth: 50 },
        { id: 'costoUnitario', label: 'Costo Unitario', minWidth: 50, maxWidth: 50 },
        { id: 'descuento', label: 'Descuento', minWidth: 70, maxWidth: 70 },
        { id: 'total', label: 'Total', minWidth: 50, maxWidth: 50},
        { id: 'accion', label: 'Accion', minWidth: 50, maxWidth: 50},
    ];

    const handleBackPedido = () =>{
        setMostrarDetalleVenta(false);
        setMostrarVentas(true);
    }

    const handleSeguimiento = () =>{
        setMostrarDetalleVenta(false);
        setMostrarVentas(false);
        setMostrarSeguimientoVendedor(true);
    }

  return (
    <Box sx={{width:"87.2%", marginTop:"-1.9px", height:"88vh", padding:"20px"}}>
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Pedidos - {informacionTienda.nombre}</Typography>
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
                {VentaSeleccionada && new Date(VentaSeleccionada.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Nombre del cliente:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                {VentaSeleccionada.nombreCliente} {VentaSeleccionada.apellidoCliente}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Estado:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                {VentaSeleccionada.estado === 1? "Pendiente" : VentaSeleccionada.estado === 2? "Completado" : VentaSeleccionada.estado === 3? "Rechazado" : ""}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Fecha de entrega:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                {VentaSeleccionada && new Date(VentaSeleccionada.fechaEntrega).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Ganancia total del pedido:
            </Typography>
            <Typography sx={{color:"black", fontSize:"24px", width:"100%"}}>
                S/. {VentaSeleccionada.total.toFixed(2)}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"column", marginBottom:"10px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"40%"}}>
                Productos comprados:
            </Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden', border:"2px solid black", borderRadius:"6px", marginTop:"10px", height:"425px"}}>
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
                        {VentaSeleccionada &&
                            VentaSeleccionada.productosLista
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((producto) => {
                            const selectedSize = producto.talla;

                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={producto.idProducto} sx={{ border: '2px solid black' }}>
                                    <TableCell sx={{ minWidth: '250px', maxWidth: '250px', fontSize: '16px' }}>
                                        {producto.nombreProducto}{' '}
                                        {producto.tipoProducto === 'Vestimenta' ? selectedSize : ''}{' '}
                                        {producto.color !== 'NA' ? producto.color : ''}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', fontSize: '16px' }}>{producto.cantidad}</TableCell>
                                    <TableCell sx={{ textAlign: 'center', fontSize: '16px' }}>
                                        S/. {producto.precio.toFixed(2)}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', fontSize: '16px' }}>{producto.cantidadOferta}%</TableCell>
                                    <TableCell sx={{ textAlign: 'center', fontSize: '16px' }}>
                                        S/.{' '}
                                        {(
                                            producto.precio * producto.cantidad -
                                            (producto.precio * producto.cantidad * producto.cantidadOferta) / 100
                                        ).toFixed(2)}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', width: '20%' }}>
                                        {producto.tieneSeguimiento ? (
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    width: '100%',
                                                    backgroundColor: '#1C2536',
                                                    '&:hover': { backgroundColor: '#1C2536' },
                                                }}
                                                onClick={() => {
                                                    handleSeguimiento(producto);
                                                }}
                                            >
                                                Visualizar Seguimiento
                                            </Button>
                                        ) : (
                                            <Box sx={{ fontSize: '16.5px' }}>No se tiene seguimiento</Box>
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
                    count={VentaSeleccionada.productosLista.length}
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
