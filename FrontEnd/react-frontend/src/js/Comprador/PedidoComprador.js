import { Box, Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';

const columns = [
  { id: 'fechaEntregado', label: 'Fecha entregado', minWidth: 80, maxWidth: 100},
  { id: 'producto', label: 'Nombre de tienda', minWidth: 200, maxWidth: 200 },
  { id: 'costoTotal', label: 'Costo total', minWidth: 200, maxWidth: 200 },
  { id: 'boton', label: '', minWidth: 100, maxWidth: 100},
];

const rows = [
  { fechaEntregado: "20/04/2023", producto: 'Camiseta', costoTotal: "S/.200.00"},
  { fechaEntregado: "20/04/2023", producto: 'Pantalón', costoTotal: "S/.200.00"},
  { fechaEntregado: "20/04/2023", producto: 'Zapatos', costoTotal: "S/.200.00"},
  { fechaEntregado: "20/04/2023", producto: 'Sombrero', costoTotal: "S/.200.00"},
  { fechaEntregado: "20/04/2023", producto: 'Calcetines', costoTotal: "S/.200.00"},
  { fechaEntregado: "20/04/2023", producto: 'Bufanda', costoTotal: "S/.200.00"},
  { fechaEntregado: "20/04/2023", producto: 'Guantes', costoTotal: "S/.200.00"},
];


export default function PedidoComprador({setMostrarDetallePedido, setMostrarPedidos, idUsuario}) {
  const [fechaHabilitada, setFechaHabitada] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [pedidosCompleteList, setPedidosCompleteList] = useState(null);
  const [BusquedaFecha, setBusquedaFecha] = useState();
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDetallePedido = () => {
    setMostrarDetallePedido(true);
    setMostrarPedidos(false);
  };

  const handleDateChange = (newDate) => {
    setBusquedaFecha(newDate);
  };

  if(BusquedaFecha){
    console.log(BusquedaFecha.$d);
  }

  useEffect(() => {
    const handlePedidoCompleteList = async () => {
        try {
          const response = await fetch(
            `https://localhost:7240/ListarPedidosCompletadosPorFecha?idUsuario=${idUsuario}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const pedido = await response.json();
            setPedidosCompleteList(pedido);
            console.log(pedidosCompleteList);
          } else if (response.status === 404) {
            throw new Error("Pedido no encontrado");
          } else {
            throw new Error("Error al obtener la lista de pedidos");
          }
        } catch (error) {
          console.error("Error al obtener la lista de pedidos", error);
          throw new Error("Error al obtener la lista de pedidos");
        }
      };
      handlePedidoCompleteList();
  }, [idUsuario]);

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
            disabled={fechaHabilitada}
            value={BusquedaFecha}
            onChange={handleDateChange}
          />

          <Checkbox checked={!fechaHabilitada} onChange={() => setFechaHabitada(!fechaHabilitada)} />

          <Typography sx={{color:"black", fontSize:"20px", marginRight:"20px"}}>Filtrar por fecha</Typography>
        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"15px", marginBottom:"15px"}} />

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
    </LocalizationProvider>
  )
}
