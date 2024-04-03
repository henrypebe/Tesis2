import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React from 'react'

export default function DetallePedidoAdministrador({setMostrarEstadistica, setMostrarPedidoDetalle}) {
    const handleChange = () =>{
        setMostrarPedidoDetalle(false);
        setMostrarEstadistica(true);
    }

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
        { id: 'nombreProduct', label: 'Nombre', minWidth: 200, maxWidth: 200},
        { id: 'cantidadProduct', label: 'Cantidad', minWidth: 50, maxWidth: 50 },
        { id: 'costoUnitario', label: 'Costo Unitario', minWidth: 50, maxWidth: 50 },
        { id: 'total', label: 'Total', minWidth: 50, maxWidth: 50},
    ];

    const rows = [
        { nombreProduct: "Producto 01", cantidadProduct: "100", costoUnitario: "S/.100.00", total: "S/.1000"},
        { nombreProduct: "Producto 01", cantidadProduct: "100", costoUnitario: "S/.100.00", total: "S/.1000"},
        { nombreProduct: "Producto 01", cantidadProduct: "100", costoUnitario: "S/.100.00", total: "S/.1000"},
        { nombreProduct: "Producto 01", cantidadProduct: "100", costoUnitario: "S/.100.00", total: "S/.1000"},
        { nombreProduct: "Producto 01", cantidadProduct: "100", costoUnitario: "S/.100.00", total: "S/.1000"},
        { nombreProduct: "Producto 01", cantidadProduct: "100", costoUnitario: "S/.100.00", total: "S/.1000"},
        { nombreProduct: "Producto 01", cantidadProduct: "100", costoUnitario: "S/.100.00", total: "S/.1000"},
    ];
    return (
        <Box sx={{padding:"20px", width:"80.37%", marginTop:"-1.9px", height:"84vh"}}>
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
                    29/02/2024
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Nombre del dueño:
                </Typography>
                <Typography sx={{color:"black", fontSize:"20px", width:"100%"}}>
                    Jorge Piñeda Lopez
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Estado:
                </Typography>
                <Typography sx={{color:"black", fontSize:"20px", width:"100%"}}>
                    Completado
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Fecha de entrega:
                </Typography>
                <Typography sx={{color:"black", fontSize:"20px", width:"100%"}}>
                    29/02/2024
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Presenta reclamo:
                </Typography>
                <Typography sx={{color:"black", fontSize:"20px", width:"100%"}}>
                    Si (29/02/2024)
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"column", marginBottom:"10px"}}>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"40%"}}>
                    Productos comprados:
                </Typography>

                <Paper sx={{ width: '100%', overflow: 'hidden', border:"2px solid black", borderRadius:"6px", marginTop:"10px"}}>
                    <TableContainer sx={{ maxHeight: 240 }}>
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
                        {rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                            return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                    <TableCell key={column.id} align={column.align} sx={{minWidth: column.minWidth,
                                        maxWidth: column.maxWidth,
                                        textAlign: column.id !== 'nombreProduct' ? 'center' : undefined,
                                        borderBottom:"1px solid black", fontSize:"18px"
                                        }}>
                                        {value}
                                    </TableCell>
                                );
                                })}
                            </TableRow>
                            );
                        })}
                        </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>

                <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid black", marginTop:"10px", marginBottom:"10px"}} />

                <Box sx={{display:"flex", flexDirection:"row", marginBottom:"10px"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"100%", marginRight:"1010px"}}>
                        Total
                    </Typography>
                    <Typography sx={{color:"black", fontSize:"20px", width:"100%"}}>
                        S/. 3000.00
                    </Typography>
                </Box>
            </Box>
        </Box>
  )
}