import { Box, Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';

const columnsPendiente = [
  { id: 'fechaEntregado', label: 'Fecha entregado', minWidth: 80, maxWidth: 100},
  { id: 'tienda', label: 'Nombre de tienda', minWidth: 100, maxWidth: 100 },
  { id: 'nombreProducto', label: 'Nombre Producto', minWidth: 200, maxWidth: 200 },
  { id: 'costoTotal', label: 'Costo total', minWidth: 200, maxWidth: 200 },
  { id: 'boton', label: '', minWidth: 100, maxWidth: 100},
];
const columnsComplete = [
  { id: 'fechaEntregado', label: 'Fecha entregado', minWidth: 80, maxWidth: 100},
  { id: 'tienda', label: 'Nombre de tienda', minWidth: 100, maxWidth: 100 },
  { id: 'nombreProducto', label: 'Nombre Producto', minWidth: 200, maxWidth: 200 },
  { id: 'costoTotal', label: 'Costo total', minWidth: 200, maxWidth: 200 },
  { id: 'boton', label: '', minWidth: 100, maxWidth: 100},
];

export default function PedidoComprador({idUsuario, HandleChangePedidoSeleccionado}) {
  const [fechaHabilitada, setFechaHabitada] = React.useState(true);
  const [pageCompleto, setPageCompleto] = React.useState(0);
  const [pagePendiente, setPagePendiente] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);

  const [pedidosCompleteList, setPedidosCompleteList] = useState(null);
  const [pedidosPendienteList, setPedidosPendienteList] = useState(null);
  // console.log(pedidosPendienteList);
  const [BusquedaFecha, setBusquedaFecha] = useState(null);
  
  const handleChangePageComplete = (event, newPage) => {
    setPageCompleto(newPage);
  };
  const handleChangePagePendiente = (event, newPage) => {
    setPagePendiente(newPage);
  };
  
  const handleChangeRowsPerPagePendiente = (event) => {
    setRowsPerPage(+event.target.value);
    setPagePendiente(0);
  };
  const handleChangeRowsPerPageCompleto = (event) => {
    setRowsPerPage(+event.target.value);
    setPageCompleto(0);
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
            setPageCompleto(0);
            setPagePendiente(0);
            const pedidosFuturos = pedido.filter(_pedido => {
              const EstadoPedido = _pedido.estado
              return EstadoPedido===1 || EstadoPedido === 4;
            });
            pedidosFuturos.sort((a, b) => b.estado - a.estado);
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

  // function concatenarFechasEntregasSeparadas(pedido) {
  //   const nombresTiendasSet = new Set();

  //   pedido.productosLista.forEach(producto => {
  //     const fechaEntrega = new Date(producto.fechaEnvio);
  //     const dia = fechaEntrega.getDate();
  //     const mes = fechaEntrega.getMonth() + 1;
  //     const año = fechaEntrega.getFullYear();
  //     const diaFormateado = dia < 10 ? '0' + dia : dia;
  //     const mesFormateado = mes < 10 ? '0' + mes : mes;
  //     const fechaFormateada = `${diaFormateado}/${mesFormateado}/${año}`;
  //     nombresTiendasSet.add(fechaFormateada);
  //   });
  //   const nombresTiendasArray = Array.from(nombresTiendasSet);
  //   const nombresTiendasConcatenados = nombresTiendasArray.join(", ");

  //   return nombresTiendasConcatenados;
  // }
  // function concatenarFechasEntregasSeparadasConRecorte(pedidos) {
  //   const nombresTiendas = concatenarFechasEntregasSeparadas(pedidos);
  //   const maxLongitud = 100;
  //   if (nombresTiendas.length > maxLongitud) {
  //       return nombresTiendas.substring(0, maxLongitud) + " ...";
  //   } else {
  //       return nombresTiendas;
  //   }
  // }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{padding:"20px", width:"86.7%", marginTop:"-1.9px", height:"88vh"}}>
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", marginTop:"-12px"}}>
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"25px", marginRight:"40px"}}>Pedidos</Typography>
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"60%"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"25px", marginRight:"20px"}}>Fecha de entrega:</Typography>

            <DateTimePicker
              label="Ingrese la fecha"
              views={['year', 'month', 'day']}
              format="DD/MM/YYYY"
              sx={{
                marginRight: "10px",
                width: "40%",
                '& .MuiInputBase-root': {
                  height: "40px",
                  minHeight: "40px",
                  display: 'flex',
                  alignItems: 'center'
                },
                '& .MuiInputLabel-root': {
                  marginTop: BusquedaFecha ? "-5px" : "-18px",
                  lineHeight: "40px",
                }
              }}
              disabled={fechaHabilitada}
              value={BusquedaFecha}
              onChange={handleDateChange}
            />

            <Checkbox checked={!fechaHabilitada} onChange={() => setFechaHabitada(!fechaHabilitada)} />

            <Typography sx={{color:"black", fontSize:"20px", marginRight:"20px"}}>Filtrar por fecha</Typography>
          </Box>
        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"10px"}} />

        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", marginBottom:"5px"}}>Pedidos completados:</Typography>

        {pedidosCompleteList && pedidosCompleteList.length>0?
        (
          <Paper sx={{ width: '100%', overflow: 'hidden', height:"40.5%" }}>
            <TableContainer sx={{ height:"85%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columnsComplete.map((column) => (
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
                {pedidosCompleteList && pedidosCompleteList.slice(pageCompleto * rowsPerPage, pageCompleto * rowsPerPage + rowsPerPage).map((pedido) => {
                  const fechaEntrega = new Date(pedido.fechaEntrega);
                  const dia = fechaEntrega.getDate();
                  const mes = fechaEntrega.getMonth() + 1;
                  const año = fechaEntrega.getFullYear();
                  const diaFormateado = dia < 10 ? '0' + dia : dia;
                  const mesFormateado = mes < 10 ? '0' + mes : mes;
                  const fechaFormateada = `${diaFormateado}/${mesFormateado}/${año}`;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={pedido.idPedido} sx={{height:"70%"}}>
                      <TableCell sx={{fontSize:"16px", width:"17%"}}>
                        {fechaFormateada}
                      </TableCell>
                      <TableCell sx={{fontSize:"16px", width:"17.4%"}}>{concatenarNombresTiendasConRecorte(pedido)}</TableCell>
                      <TableCell sx={{fontSize:"16px"}}>{pedido.productosLista[0].nombreProducto}</TableCell>
                      <TableCell sx={{fontSize:"16px"}}>S/. {(pedido.total + pedido.costoEnvio).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          sx={{backgroundColor:"#1C2536", '&:hover': {backgroundColor:"#1C2536"}}}
                          onClick={() => HandleChangePedidoSeleccionado(pedido, 1)}
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
              rowsPerPageOptions={[1]}
              component="div"
              count={pedidosCompleteList.length}
              rowsPerPage={rowsPerPage}
              page={pageCompleto}
              onPageChange={handleChangePageComplete}
              onRowsPerPageChange={handleChangeRowsPerPageCompleto}
            />
          </Paper>
        ):
        (
          <Box sx={{ height:"30%", padding:"5px"}}>
            <Typography sx={{fontWeight:"bold", fontSize:"20px"}}>No se tiene pedidos completados por el momento</Typography>
          </Box>
        )}

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"15px", marginBottom:"10px"}} />

        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", marginBottom:"5px"}}>Pedidos pendientes:</Typography>

        {pedidosPendienteList && pedidosPendienteList.length > 0?
        (
          <Paper sx={{ width: '100%', overflow: 'hidden', height:"40.5%" }}>
            <TableContainer sx={{ height:"85%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columnsPendiente.map((column) => (
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
                {pedidosPendienteList && pedidosPendienteList.slice(pagePendiente * rowsPerPage, pagePendiente * rowsPerPage + rowsPerPage)
                  .map((pedido) => {
                  const fechaEntrega = new Date(pedido.fechaEntrega);
                  const dia = fechaEntrega.getDate();
                  const mes = fechaEntrega.getMonth() + 1;
                  const año = fechaEntrega.getFullYear();
                  const diaFormateado = dia < 10 ? '0' + dia : dia;
                  const mesFormateado = mes < 10 ? '0' + mes : mes;
                  const fechaFormateada = `${diaFormateado}/${mesFormateado}/${año}`;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={pedido.idPedido}>
                      <TableCell sx={{fontSize:"16px", width:"17%"}}>
                        {fechaFormateada}
                      </TableCell>
                      <TableCell sx={{width:"17.4%", fontSize:"16px"}}>{concatenarNombresTiendasConRecorte(pedido)}</TableCell>
                      <TableCell sx={{fontSize:"16px"}}>{pedido.productosLista[0].nombreProducto}</TableCell>
                      <TableCell sx={{fontSize:"16px"}}>S/. {(pedido.total + pedido.costoEnvio).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          sx={{backgroundColor:pedido.estado === 4? "#86882D":"#1C2536", '&:hover': {backgroundColor:pedido.estado === 4? "#86882D":"#1C2536"}}}
                          onClick={() => HandleChangePedidoSeleccionado(pedido, 0)}
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
              rowsPerPageOptions={[1]}
              component="div"
              count={pedidosPendienteList.length}
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
