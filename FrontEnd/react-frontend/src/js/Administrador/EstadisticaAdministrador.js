import { Check } from '@mui/icons-material';
import { Box, Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { BASE_URL } from "../../config";

export default function EstadisticaAdministrador({handleChangePedidoSeleccionado}) {
    const [isCheckedCompletado, setIsCheckedCompletados] = useState(false);
    const [isCheckedPendiente, setIsCheckedPendientes] = useState(false);
    const handleCheckboxChange = () => {
        setIsCheckedCompletados(!isCheckedCompletado);
    };
    const handleCheckboxChange2 = () => {
        setIsCheckedPendientes(!isCheckedPendiente);
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(3);
    const [currentPage, setCurrentPage] = useState(0);

    const [pageReclamo, setPageReclamo] = React.useState(0);
    const [rowsPerPageReclamo, setRowsPerPageReclamo] = React.useState(3);
    const [currentPageReclamo, setCurrentPageReclamo] = useState(0);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
      setCurrentPage(newPage);
    };
      
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    
    const handleChangePageReclamo = (event, newPage) => {
      setPageReclamo(newPage);
      setCurrentPageReclamo(newPage);
    };
    const handleChangeRowsPerPageReclamo = (event) => {
      setRowsPerPageReclamo(+event.target.value);
      setPageReclamo(0);
    };

    const columns = [
        { id: 'fechaCreado', label: 'Fecha creado', minWidth: 100, maxWidth: 100},
        { id: 'tienda', label: 'Tienda', minWidth: 300, maxWidth: 300 },
        { id: 'cliente', label: 'Cliente', minWidth: 300, maxWidth: 300 },
        { id: 'boton', label: '', minWidth: 100, maxWidth: 100},
    ];

    function concatenarNombresTiendasConRecorte(pedidos) {
      const nombresTiendas = concatenarNombresTiendas(pedidos);
      const maxLongitud = 100;
      if (nombresTiendas.length > maxLongitud) {
          return nombresTiendas.substring(0, maxLongitud) + " ...";
      } else {
          return nombresTiendas;
      }
    }
    function concatenarNombresTiendas(pedido) {
      const nombresTiendasSet = new Set();
  
      pedido.productosLista.forEach(producto => {
        nombresTiendasSet.add(producto.nombreTienda);
      });
      const nombresTiendasArray = Array.from(nombresTiendasSet);
      const nombresTiendasConcatenados = nombresTiendasArray.join(", ");
  
      return nombresTiendasConcatenados;
    }

    const [Pedidos, setPedidos] = React.useState();
    const [PedidosReclamo, setPedidosReclamo] = React.useState();
    useEffect(() => {
      const obtenerListaPedidos = async () => {
          try {
            const response = await fetch(
              `${BASE_URL}/ListarPedidosAdministrador?completados=${isCheckedCompletado}&pendientes=${isCheckedPendiente}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
      
            if (response.ok) {
              const producto = await response.json();
              setPedidos(producto);
              // console.log(producto);
            } else if (response.status === 404) {
              throw new Error("Pedidos no encontrado");
            } else {
              throw new Error("Error al obtener la lista de Pedidos");
            }
          } catch (error) {
            console.error("Error al obtener la lista de Pedidos", error);
            throw new Error("Error al obtener la lista de Pedidos");
          }
      };

      const obtenerListaPedidosReclamo = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/ListarPedidosReclamosAdministrador`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.ok) {
            const producto = await response.json();
            setPedidosReclamo(producto);
          } else if (response.status === 404) {
            throw new Error("Pedidos Reclamados no encontrado");
          } else {
            throw new Error("Error al obtener la lista de Pedidos Reclamados");
          }
        } catch (error) {
          console.error("Error al obtener la lista de Pedidos Reclamados", error);
          throw new Error("Error al obtener la lista de Pedidos Reclamados");
        }
    };
      obtenerListaPedidos();
      obtenerListaPedidosReclamo();
    }, [isCheckedCompletado, isCheckedPendiente]);

    return (
    <Box sx={{padding:"20px", width:"80.37%", marginTop:"-1.9px", height:"89vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px"}}>Estadistica</Typography>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"10px"}} />

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

        <Paper sx={{ width: '100%', overflow: 'hidden', height:"40%" }}>
          <TableContainer sx={{height:"86%" }}>
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
              {Pedidos && Pedidos.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((pedido) => {
                const fechaEntrega = new Date(pedido.fechaCreacion);
                const dia = fechaEntrega.getDate();
                const mes = fechaEntrega.getMonth() + 1;
                const año = fechaEntrega.getFullYear();
                const diaFormateado = dia < 10 ? '0' + dia : dia;
                const mesFormateado = mes < 10 ? '0' + mes : mes;
                const fechaFormateada = `${diaFormateado}/${mesFormateado}/${año}`;
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} sx={{border:"2px solid black"}}>
                            <TableCell sx={{fontSize:"16px", width:"20%"}}>{fechaFormateada}</TableCell>
                            <TableCell sx={{fontSize:"16px", width:"30%"}}>{concatenarNombresTiendasConRecorte(pedido)}</TableCell>
                            <TableCell sx={{fontSize:"16px"}}>{pedido.nombreCliente} {pedido.apellidoCliente}</TableCell>
                            <TableCell sx={{textAlign:"center", width:"20%"}}>
                              <Button variant="contained" sx={{backgroundColor:"#1C2536", '&:hover': {backgroundColor:"#1C2536"}}}
                              onClick={()=>{handleChangePedidoSeleccionado(pedido);}}>Ver Detalles</Button>
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
            count={Pedidos? Pedidos.length:0}
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

        <Paper sx={{ width: '100%', overflow: 'hidden', height:"40%" }}>
          <TableContainer sx={{ height:"86%" }}>
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
              {PedidosReclamo && PedidosReclamo.slice(currentPageReclamo * rowsPerPageReclamo, (currentPageReclamo + 1) * rowsPerPageReclamo).map((pedido) => {
                const fechaEntrega = new Date(pedido.fechaCreacion);
                const dia = fechaEntrega.getDate();
                const mes = fechaEntrega.getMonth() + 1;
                const año = fechaEntrega.getFullYear();
                const diaFormateado = dia < 10 ? '0' + dia : dia;
                const mesFormateado = mes < 10 ? '0' + mes : mes;
                const fechaFormateada = `${diaFormateado}/${mesFormateado}/${año}`;
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} sx={{border:"2px solid black"}}>
                            <TableCell sx={{fontSize:"16px", width:"20%"}}>{fechaFormateada}</TableCell>
                            <TableCell sx={{fontSize:"16px", width:"30%"}}>{concatenarNombresTiendasConRecorte(pedido)}</TableCell>
                            <TableCell sx={{fontSize:"16px"}}>{pedido.nombreCliente} {pedido.apellidoCliente}</TableCell>
                            <TableCell sx={{textAlign:"center", width:"20%"}}>
                              <Button variant="contained" sx={{backgroundColor:"#1C2536", '&:hover': {backgroundColor:"#1C2536"}}}
                              onClick={()=>{handleChangePedidoSeleccionado(pedido);}}>Ver Detalles</Button>
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
            count={PedidosReclamo?PedidosReclamo.length:0}
            rowsPerPage={rowsPerPageReclamo}
            page={pageReclamo}
            onPageChange={handleChangePageReclamo}
            onRowsPerPageChange={handleChangeRowsPerPageReclamo}
          />
        </Paper>
    </Box>
  )
}
