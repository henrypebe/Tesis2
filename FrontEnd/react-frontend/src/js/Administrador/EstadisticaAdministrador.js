import { Check } from '@mui/icons-material';
import { Box, Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React, { useState } from 'react'

export default function EstadisticaAdministrador({setMostrarEstadistica, setMostrarPedidoDetalle}) {
    const [isCheckedCompletado, setIsCheckedCompletados] = useState(false);
    const [isCheckedPendiente, setIsCheckedPendientes] = useState(false);
    const handleCheckboxChange = () => {
        setIsCheckedCompletados(!isCheckedCompletado);
    };
    const handleCheckboxChange2 = () => {
        setIsCheckedPendientes(!isCheckedPendiente);
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
      
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    
    const handleDetallePedido = () => {
        setMostrarPedidoDetalle(true);
        setMostrarEstadistica(false);
    };

    const columns = [
        { id: 'fechaEntregado', label: 'Fecha entregado', minWidth: 100, maxWidth: 100},
        { id: 'tienda', label: 'Tienda', minWidth: 300, maxWidth: 300 },
        { id: 'cliente', label: 'Cliente', minWidth: 300, maxWidth: 300 },
        { id: 'boton', label: '', minWidth: 100, maxWidth: 100},
    ];
      
    const rows = [
        { fechaEntregado: "20/04/2023", tienda: 'Camiseta', cliente: "S/.200.00"},
        { fechaEntregado: "20/04/2023", tienda: 'Pantalón', cliente: "S/.200.00"},
        { fechaEntregado: "20/04/2023", tienda: 'Zapatos', cliente: "S/.200.00"},
        { fechaEntregado: "20/04/2023", tienda: 'Sombrero', cliente: "S/.200.00"},
        { fechaEntregado: "20/04/2023", tienda: 'Calcetines', cliente: "S/.200.00"},
        { fechaEntregado: "20/04/2023", tienda: 'Bufanda', cliente: "S/.200.00"},
        { fechaEntregado: "20/04/2023", tienda: 'Guantes', cliente: "S/.200.00"},
    ];
    return (
    <Box sx={{padding:"20px", width:"80.37%", marginTop:"-1.9px", height:"95vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px"}}>Estadistica</Typography>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"22px", marginRight:"20px"}}>Pedidos:</Typography>
            <Box sx={{marginRight:"20px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <Checkbox 
                    checked={isCheckedCompletado} 
                    onChange={handleCheckboxChange}
                    checkedIcon={<Check style={{ color: 'black' }} />}
                />
                <Typography sx={{color:"black", fontSize:"22px"}}>Completados</Typography>
            </Box>
            <Box sx={{ display:"flex", flexDirection:"row", alignItems:"center"}}>
                <Checkbox 
                    checked={isCheckedPendiente} 
                    onChange={handleCheckboxChange2}
                    checkedIcon={<Check style={{ color: 'black' }} />}
                />
                <Typography sx={{color:"black", fontSize:"22px"}}>Pendientes</Typography>
            </Box>
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 240 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, maxWidth: column.maxWidth, fontSize:"20px", fontWeight:"bold" }}
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
                        style={{ minWidth: column.minWidth, maxWidth: column.maxWidth, fontSize:"18px"
                        }}
                        >
                          {column.id === 'boton' ? (
                            <Button variant="contained" sx={{backgroundColor:"#1C2536", '&:hover': {backgroundColor:"#1C2536"}}}
                            onClick={handleDetallePedido}>Ver Detalles</Button>
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

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"20px", marginBottom:"15px"}} />

        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"22px", marginRight:"20px"}}>Pedidos con reclamos:</Typography>
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 240 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, maxWidth: column.maxWidth, fontSize:"20px", fontWeight:"bold" }}
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
                        style={{ minWidth: column.minWidth, maxWidth: column.maxWidth, fontSize:"18px"
                        }}
                        >
                          {column.id === 'boton' ? (
                            <Button variant="contained" sx={{backgroundColor:"#1C2536", '&:hover': {backgroundColor:"#1C2536"}}}
                            onClick={handleDetallePedido}>Ver Detalles</Button>
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
  )
}
