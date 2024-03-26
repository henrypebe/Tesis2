import { Box, Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';

const columns = [
  { id: 'fechaEntregado', label: 'Fecha entregado', minWidth: 80, maxWidth: 100},
  { id: 'producto', label: 'Nombre de tienda', minWidth: 200, maxWidth: 200 },
  { id: 'nombreProducto', label: 'Producto', minWidth: 200, maxWidth: 200 },
  { id: 'boton', label: 'Acción', minWidth: 100, maxWidth: 100},
];

const rows = [
  { fechaEntregado: 1, producto: 'Camiseta', nombreProducto: "Papel toalla"},
  { fechaEntregado: 2, producto: 'Pantalón', nombreProducto: "Papel toalla"},
  { fechaEntregado: 3, producto: 'Zapatos', nombreProducto: "Papel toalla"},
  { fechaEntregado: 4, producto: 'Sombrero', nombreProducto: "Papel toalla"},
  { fechaEntregado: 5, producto: 'Calcetines', nombreProducto: "Papel toalla"},
  { fechaEntregado: 6, producto: 'Bufanda', nombreProducto: "Papel toalla"},
  { fechaEntregado: 7, producto: 'Guantes', nombreProducto: "Papel toalla"},
];


export default function PedidoComprador() {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleButtonClick = (pedidoId) => {
    console.log(`Botón clickeado para el pedido ID: ${pedidoId}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px"}}>Pedidos</Typography>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"25px", marginRight:"20px"}}>Fecha:</Typography>

          <DateTimePicker
            label="Ingrese la fecha"
            views={['year', 'month', 'day']}
            format="DD/MM/YYYY"
            sx={{marginRight:"10px"}}
          />

          <Checkbox {...label} />

          <Typography sx={{color:"black", fontSize:"20px", marginRight:"20px"}}>Filtrar por fecha</Typography>
        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"20px", marginBottom:"15px"}} />

        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", marginBottom:"10px"}}>Pedidos completados:</Typography>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 240 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
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
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'boton' ? (
                            <Button variant="contained" sx={{backgroundColor:"#1C2536", '&:hover': {backgroundColor:"#1C2536"}}}
                            onClick={() => handleButtonClick(row.pedidoId)}>Ver Detalles</Button>
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

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"15px", marginBottom:"10px"}} />

        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", marginBottom:"10px"}}>Pedidos pendientes:</Typography>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 240 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
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
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'boton' ? (
                            <Button variant="contained" sx={{backgroundColor:"#1C2536", '&:hover': {backgroundColor:"#1C2536"}}}
                            onClick={() => handleButtonClick(row.pedidoId)}>Ver Detalles</Button>
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
    </LocalizationProvider>
  )
}
