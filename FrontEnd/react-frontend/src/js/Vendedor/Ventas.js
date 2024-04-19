import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider'
import React, { useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function Ventas({HandleChangeVentaSeleccionado, informacionTienda}) {
    const [pageCompleto, setPageCompleto] = React.useState(0);
    const [pagePendiente, setPagePendiente] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(2);
    const [fechaHabilitada, setFechaHabitada] = React.useState(true);

    const [VentasCompleteList, setVentasCompleteList] = React.useState(null);
    const [VentasPendienteList, setVentasPendienteList] = React.useState(null);
    const [BusquedaFecha, setBusquedaFecha] = React.useState(null);

    const handleChangePageCompleto = (event, newPage) => {
      setPageCompleto(newPage);
    };
    const handleChangePagePendiente = (event, newPage) => {
      setPagePendiente(newPage);
  };
      
    const handleChangeRowsPerPageCompleto = (event) => {
        setRowsPerPage(+event.target.value);
        setPageCompleto(0);
    };
    const handleChangeRowsPerPagePendiente = (event) => {
      setRowsPerPage(+event.target.value);
      setPagePendiente(0);
    };
    
    const handleDateChange = (newDate) => {
      setBusquedaFecha(newDate);
    };

    const columns = [
        { id: 'fechaEntregado', label: 'Fecha entregado', minWidth: 100, maxWidth: 100},
        { id: 'cliente', label: 'Cliente', minWidth: 300, maxWidth: 300 },
        { id: 'costoTotal', label: 'Ganacia', minWidth: 200, maxWidth: 200 },
        { id: 'boton', label: '', minWidth: 100, maxWidth: 100},
    ];

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
              `https://localhost:7240/ListarVentasCompletadosPorFecha?idTienda=${informacionTienda.idTienda}&FechaFiltro=${fechaISO}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
      
            if (response.ok) {
              const pedido = await response.json();
              const pedidosFuturos = pedido.filter(_pedido => {
                const EstadoPedido = _pedido.estado
                return EstadoPedido===1;
              });
              const pedidosPasados = pedido.filter(_pedido => {
                const EstadoPedido = _pedido.estado
                return EstadoPedido===2;
              });
              setVentasCompleteList(pedidosPasados);
              setVentasPendienteList(pedidosFuturos);
            } else if (response.status === 404) {
              // console.error("Error al obtener la lista de pedidos");
            } else {
              // console.error("Error al obtener la lista de pedidos");
            }
          } catch (error) {
            console.error("Error al obtener la lista de pedidos", error);
            throw new Error("Error al obtener la lista de pedidos");
          }
        };
        handleActualizarFecha();
        handlePedidoCompleteList();
    }, [informacionTienda.idTienda, BusquedaFecha, fechaHabilitada]);

    return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", height:"88vh"}}>
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

          <Checkbox checked={!fechaHabilitada} onChange={() => setFechaHabitada(!fechaHabilitada)}/>

          <Typography sx={{color:"black", fontSize:"20px", marginRight:"20px"}}>Filtrar por fecha</Typography>
        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"15px", marginBottom:"15px"}} />

        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", marginBottom:"10px"}}>Pedidos completados:</Typography>

        {VentasCompleteList && VentasCompleteList.length>0?
        (
          <Paper sx={{ width: '100%', overflow: 'hidden', height:"33%" }}>
            <TableContainer sx={{ height:"84%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, maxWidth: column.maxWidth, fontWeight:"bold", fontSize:"20px" }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                {VentasCompleteList && VentasCompleteList.slice(pageCompleto * rowsPerPage, pageCompleto * rowsPerPage + rowsPerPage).map((pedido) => {
                  const fechaEntrega = new Date(pedido.fechaEntrega);
                  const dia = fechaEntrega.getDate();
                  const mes = fechaEntrega.getMonth() + 1;
                  const año = fechaEntrega.getFullYear();
                  const diaFormateado = dia < 10 ? '0' + dia : dia;
                  const mesFormateado = mes < 10 ? '0' + mes : mes;
                  const fechaFormateada = `${diaFormateado}/${mesFormateado}/${año}`;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={pedido.idPedido}>
                      <TableCell sx={{fontSize:"16px"}}>{fechaFormateada}</TableCell>
                      <TableCell sx={{fontSize:"16px"}}>{pedido.nombreCliente} {pedido.apellidoCliente}</TableCell>
                      <TableCell sx={{fontSize:"16px"}}>S/. {pedido.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          sx={{backgroundColor:"#1C2536", '&:hover': {backgroundColor:"#1C2536"}}}
                          onClick={() => HandleChangeVentaSeleccionado(pedido)}>Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[1]}
              component="div"
              count={VentasCompleteList.length}
              rowsPerPage={rowsPerPage}
              page={pageCompleto}
              onPageChange={handleChangePageCompleto}
              onRowsPerPageChange={handleChangeRowsPerPageCompleto}
            />
          </Paper>
        ):
        (
          <Box sx={{ height:"26%", padding:"5px"}}>
            <Typography sx={{fontWeight:"bold", fontSize:"20px"}}>No se tiene pedidos completados por el momento</Typography>
          </Box>
        )}

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"15px", marginBottom:"10px"}} />

        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", marginBottom:"10px"}}>Pedidos pendientes:</Typography>

        {VentasPendienteList && VentasPendienteList.length > 0?
        (
          <Paper sx={{ width: '100%', overflow: 'hidden', height:"33%" }}>
            <TableContainer sx={{ height:"84%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, maxWidth: column.maxWidth, fontWeight:"bold", fontSize:"20px" }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                {VentasPendienteList && VentasPendienteList.slice(pagePendiente * rowsPerPage, pagePendiente * rowsPerPage + rowsPerPage).map((pedido) => {
                  const fechaEntrega = new Date(pedido.fechaEntrega);
                  const dia = fechaEntrega.getDate();
                  const mes = fechaEntrega.getMonth() + 1;
                  const año = fechaEntrega.getFullYear();
                  const diaFormateado = dia < 10 ? '0' + dia : dia;
                  const mesFormateado = mes < 10 ? '0' + mes : mes;
                  const fechaFormateada = `${diaFormateado}/${mesFormateado}/${año}`;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={pedido.idPedido}>
                      <TableCell sx={{fontSize:"16px"}}>{fechaFormateada}</TableCell>
                      <TableCell sx={{fontSize:"16px"}}>{pedido.nombreCliente} {pedido.apellidoCliente}</TableCell>
                      <TableCell sx={{fontSize:"16px"}}>S/. {pedido.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          sx={{backgroundColor:"#1C2536", '&:hover': {backgroundColor:"#1C2536"}}}
                          onClick={() => HandleChangeVentaSeleccionado(pedido)}>Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[1]}
              component="div"
              count={VentasPendienteList.length}
              rowsPerPage={rowsPerPage}
              page={pagePendiente}
              onPageChange={handleChangePagePendiente}
              onRowsPerPageChange={handleChangeRowsPerPagePendiente}
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
