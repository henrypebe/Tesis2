import { Box, Button, Divider, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React from 'react';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

export default function DetalleProductoVendedor({setMostrarMisProductos, setMostrarDetalleProducto}) {
  
    const handleChange = () =>{
        setMostrarMisProductos(true);
        setMostrarDetalleProducto(false);
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
    
    const handleComentario = () => {
        
    };

    const columns = [
        { id: 'nombreCliente', label: 'Nombre', minWidth: 100, maxWidth: 100},
        { id: 'fechaEntrega', label: 'Fecha entrega', minWidth: 300, maxWidth: 300 },
        { id: 'lugarEntrega', label: 'Lugar entrega', minWidth: 200, maxWidth: 200 },
        { id: 'estado', label: 'Estado', minWidth: 100, maxWidth: 100},
        { id: 'comentario', label: '', minWidth: 100, maxWidth: 100},
    ];
      
    const rows = [
        { nombreCliente: "Felix Sanchez", fechaEntrega: '27/08/2024', lugarEntrega: "Lima, Perú"},
        { nombreCliente: "Felix Sanchez", fechaEntrega: '27/08/2024', lugarEntrega: "Lima, Perú"},
        { nombreCliente: "Felix Sanchez", fechaEntrega: '27/08/2024', lugarEntrega: "Lima, Perú"},
        { nombreCliente: "Felix Sanchez", fechaEntrega: '27/08/2024', lugarEntrega: "Lima, Perú"},
        { nombreCliente: "Felix Sanchez", fechaEntrega: '27/08/2024', lugarEntrega: "Lima, Perú"},
        { nombreCliente: "Felix Sanchez", fechaEntrega: '27/08/2024', lugarEntrega: "Lima, Perú"},
        { nombreCliente: "Felix Sanchez", fechaEntrega: '27/08/2024', lugarEntrega: "Lima, Perú"},
    ];

    return (
    <Box sx={{padding:"20px", width:"85.65%", marginTop:"-1.9px", minHeight:"108vh", maxHeight:"108vh"}}>
        <Box sx={{display:"flex", flexDirection:"row"}}>
            
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"90%"}}>Detalle del producto</Typography>

            <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
                fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleChange}>
                Atrás
            </Button>

        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{border:"2px solid black", borderRadius:"6px", display:"flex", flexDirection:"column", padding:"10px"}}>
            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                <Typography
                    sx={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "24px",
                        width: "90%",
                    }}
                >
                    Detalles generales del producto:
                </Typography>
                <IconButton>
                    <HistoryIcon sx={{fontSize:"40px", color:"black"}}/>
                </IconButton>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row"}}>
                <img src="https://promart.vteximg.com.br/arquivos/ids/570404-1000-1000/22773.jpg?v=637401121588630000" alt="Descripción de la imagen" 
                    style={{height:"120px"}}
                />
                <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
                <Box sx={{display:"flex", flexDirection:"column", width:"50%", justifyContent:"center"}}>
                    <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        Productos 1
                        </Typography>
                        <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        Fecha de creación: 17/08/2024
                        </Typography>
                        <Typography
                        sx={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "24px",
                            width: "100%",
                        }}
                        >
                        10 ventas
                    </Typography>
                </Box>
            </Box>
        </Box>

        <Box sx={{display:"flex", flexDirection:"column", marginTop:"15px", padding:"10px", border:"2px solid black", borderRadius:"6px",
        height:"25%"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"90%"}}>Descripción del producto:</Typography>
            <Typography sx={{minHeight:"80%"}}>

            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"column", marginTop:"15px", padding:"10px", border:"2px solid black", borderRadius:"6px",
        height:"35%"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"90%"}}>Clientes:</Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 240 }}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, maxWidth: column.maxWidth, fontSize:"20px", fontWeight:"bold",
                            textAlign: column.id === 'estado'?"center":""}}
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
                                <TableCell key={column.id} align={column.align}
                                style={{ minWidth: column.minWidth, maxWidth: column.maxWidth, fontSize:"18px",
                                textAlign: column.id === 'estado' || column.id === 'comentario'?"center":""
                                }}
                                >
                                {column.id === 'estado' ? (
                                    <CheckCircleIcon />
                                ) : column.id === 'comentario' ? (
                                    <IconButton onClick={handleComentario}>
                                        <QuestionAnswerIcon />
                                    </IconButton>
                                ) : (
                                    value
                                )}
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
        </Box>
    </Box>
  )
}
