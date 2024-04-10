import { Box, Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';

const columnsPendiente = [
  { id: 'fechaEntregado', label: 'Fecha entregado', minWidth: 80, maxWidth: 100},
  { id: 'producto', label: 'Nombre de tienda', minWidth: 200, maxWidth: 200 },
  { id: 'costoTotal', label: 'Costo total', minWidth: 200, maxWidth: 200 },
  // { id: 'boton', label: '', minWidth: 100, maxWidth: 100},
];
const columnsComplete = [
  { id: 'fechaEntregado', label: 'Fecha entregado', minWidth: 80, maxWidth: 100},
  { id: 'producto', label: 'Nombre de tienda', minWidth: 200, maxWidth: 200 },
  { id: 'costoTotal', label: 'Costo total', minWidth: 200, maxWidth: 200 },
  { id: 'boton', label: '', minWidth: 100, maxWidth: 100},
];

export default function PedidoComprador({idUsuario, HandleChangePedidoSeleccionado}) {
  const [fechaHabilitada, setFechaHabitada] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [pedidosCompleteList, setPedidosCompleteList] = useState(null);
  const [pedidosPendienteList, setPedidosPendienteList] = useState(null);
  console.log(pedidosPendienteList);
  const [BusquedaFecha, setBusquedaFecha] = useState(null);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDateChange = (newDate) => {
    setBusquedaFecha(newDate);
  };

  useEffect(() => {
    const handleActualizarFecha = async () => {
      try {
        await fetch(
          `https://localhost:7240/ActualizarFechasPedidos`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error al obtener Actualizar Fechas de pedidos", error);
      }
    };
    const handlePedidoCompleteList = async () => {
        try {
          
          const fechaString = BusquedaFecha != null && !fechaHabilitada? BusquedaFecha.$d : "";
          const fecha = new Date(fechaString);
          const fechaISO = BusquedaFecha != null && !fechaHabilitada? fecha.toISOString(): "0001-01-01T00:00:00.000Z";

          const response = await fetch(
            `https://localhost:7240/ListarPedidosCompletadosPorFecha?idUsuario=${idUsuario}&FechaFiltro=${fechaISO}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const pedido = await response.json();
            // console.log(pedido);
            // const fechaActual = new Date();
            const pedidosFuturos = pedido.filter(_pedido => {
              const EstadoPedido = _pedido.estado
              return EstadoPedido===1;
            });
            // console.log(pedidosFuturos);
            const pedidosPasados = pedido.filter(_pedido => {
              const EstadoPedido = _pedido.estado
              return EstadoPedido===2;
            });
            setPedidosCompleteList(pedidosPasados);
            setPedidosPendienteList(pedidosFuturos);
          } else if (response.status === 404) {
            // throw new Error("Pedido no encontrado");
          } else {
            // throw new Error("Error al obtener la lista de pedidos");
          }
        } catch (error) {
          console.error("Error al obtener la lista de pedidos", error);
          throw new Error("Error al obtener la lista de pedidos");
        }
      };
      handleActualizarFecha();
      handlePedidoCompleteList();
  }, [idUsuario, BusquedaFecha, fechaHabilitada]);

  function concatenarNombresTiendas(pedido) {
    const nombresTiendasSet = new Set();

    pedido.productosLista.forEach(producto => {
      nombresTiendasSet.add(producto.nombreTienda);
    });
    const nombresTiendasArray = Array.from(nombresTiendasSet);
    const nombresTiendasConcatenados = nombresTiendasArray.join(", ");

    return nombresTiendasConcatenados;
  }

  function concatenarNombresTiendasConRecorte(pedidos) {
    const nombresTiendas = concatenarNombresTiendas(pedidos);
    const maxLongitud = 100;
    if (nombresTiendas.length > maxLongitud) {
        return nombresTiendas.substring(0, maxLongitud) + " ...";
    } else {
        return nombresTiendas;
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{padding:"20px", width:"86.7%", marginTop:"-1.9px", height:"86vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px"}}>Pedidos</Typography>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"25px", marginRight:"20px"}}>Fecha de entrega:</Typography>

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

        {pedidosCompleteList && pedidosCompleteList.length>0?
        (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 240 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columnsComplete.map((column) => (
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
                {pedidosCompleteList && pedidosCompleteList.map((pedido) => {
                  const fechaEntrega = new Date(pedido.fechaEntrega);
                  const dia = fechaEntrega.getDate();
                  const mes = fechaEntrega.getMonth() + 1;
                  const año = fechaEntrega.getFullYear();
                  const diaFormateado = dia < 10 ? '0' + dia : dia;
                  const mesFormateado = mes < 10 ? '0' + mes : mes;
                  const fechaFormateada = `${diaFormateado}/${mesFormateado}/${año}`;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={pedido.idPedido}>
                      <TableCell>{fechaFormateada}</TableCell>
                      <TableCell>{concatenarNombresTiendasConRecorte(pedido)}</TableCell>
                      <TableCell>S/. {pedido.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          sx={{backgroundColor:"#1C2536", '&:hover': {backgroundColor:"#1C2536"}}}
                          onClick={() => HandleChangePedidoSeleccionado(pedido)}
                          disabled={pedido.tieneReclamo || pedido.finalizarReclamo}
                          >Ver Detalles
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
              count={pedidosCompleteList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        ):
        (
          <Box sx={{ height:"30%", padding:"5px"}}>
            <Typography sx={{fontWeight:"bold", fontSize:"20px"}}>No se tiene pedidos completados por el momento</Typography>
          </Box>
        )}

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"15px", marginBottom:"10px"}} />

        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", marginBottom:"10px"}}>Pedidos pendientes:</Typography>

        {pedidosPendienteList && pedidosPendienteList.length > 0?
        (
          <Paper sx={{ width: '100%', overflow: 'hidden', height:"35%" }}>
            <TableContainer sx={{ height:"80%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columnsPendiente.map((column) => (
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
                {pedidosPendienteList && pedidosPendienteList.map((pedido) => {
                  const fechaEntrega = new Date(pedido.fechaEntrega);
                  const dia = fechaEntrega.getDate();
                  const mes = fechaEntrega.getMonth() + 1;
                  const año = fechaEntrega.getFullYear();
                  const diaFormateado = dia < 10 ? '0' + dia : dia;
                  const mesFormateado = mes < 10 ? '0' + mes : mes;
                  const fechaFormateada = `${diaFormateado}/${mesFormateado}/${año}`;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={pedido.idPedido}>
                      <TableCell>{fechaFormateada}</TableCell>
                      <TableCell sx={{width:"50%"}}>{concatenarNombresTiendasConRecorte(pedido)}</TableCell>
                      <TableCell sx={{width:"30%"}}>S/. {pedido.total.toFixed(2)}</TableCell>
                      {/* <TableCell>
                        <Button 
                          variant="contained" 
                          sx={{backgroundColor:"#1C2536", '&:hover': {backgroundColor:"#1C2536"}}}
                          onClick={() => HandleChangePedidoSeleccionado(pedido)}>Ver Detalles
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  );
                })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={pedidosPendienteList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )
        :
        (
          <Box sx={{ height:"32%", padding:"5px"}}>
            <Typography sx={{fontWeight:"bold", fontSize:"20px"}}>No se tiene pedidos pendientes por el momento</Typography>
          </Box>
        )}

      </Box>
    </LocalizationProvider>
  )
}
