import { Box, Pagination, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import CardGestionVendedor from './CardGestionVendedor';
import { BASE_URL } from "../../config";

export default function GestionVendedor({informacionTienda}) {

  const [ListaVendedoresAsistentesPendientes, setListaVendedoresAsistentesPendientes] = React.useState([]);
  const [ListaVendedoresAsistentesAceptados, setListaVendedoresAsistentesAceptados] = React.useState([]);
    
  const handleInformacionVendedorAsistente = async () => {
    try {
        // Llamada para vendedores pendientes
        const responsePendientes = await fetch(
            `${BASE_URL}/ListarVendedoresAsistentesPendientes?idTienda=${informacionTienda ? informacionTienda.idTienda : 0}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Llamada para vendedores confirmados
        const responseAceptados = await fetch(
            `${BASE_URL}/ListarVendedoresAsistentesAceptados?idTienda=${informacionTienda ? informacionTienda.idTienda : 0}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Verificación de las respuestas
        if (responsePendientes.ok && responseAceptados.ok) {
            const pendientes = await responsePendientes.json();
            const aceptados = await responseAceptados.json();
            setListaVendedoresAsistentesPendientes(pendientes);
            setListaVendedoresAsistentesAceptados(aceptados);
        } else {
            throw new Error("Error al obtener las listas de vendedores asistentes");
        }
    } catch (error) {
        console.error("Error al obtener la lista de vendedores asistentes", error);
    }
  };

    useEffect(() => {
      const handleInformacionVendedorAsistente = async () => {
        try {
            // Llamada para vendedores pendientes
            const responsePendientes = await fetch(
                `${BASE_URL}/ListarVendedoresAsistentesPendientes?idTienda=${informacionTienda ? informacionTienda.idTienda : 0}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            // Llamada para vendedores confirmados
            const responseAceptados = await fetch(
                `${BASE_URL}/ListarVendedoresAsistentesAceptados?idTienda=${informacionTienda ? informacionTienda.idTienda : 0}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            // Verificación de las respuestas
            if (responsePendientes.ok && responseAceptados.ok) {
                const pendientes = await responsePendientes.json();
                const aceptados = await responseAceptados.json();
                setListaVendedoresAsistentesPendientes(pendientes);
                setListaVendedoresAsistentesAceptados(aceptados);
            } else {
                throw new Error("Error al obtener las listas de vendedores asistentes");
            }
        } catch (error) {
            console.error("Error al obtener la lista de vendedores asistentes", error);
        }
      };
      const interval = setInterval(() => {
        handleInformacionVendedorAsistente();
      }, 100);
      return () => clearInterval(interval);
    }, [informacionTienda]);

  const [currentPagePendientes, setCurrentPagePendientes] = React.useState(0);
  const [currentPageAceptados, setCurrentPageAceptados] = React.useState(0);
  const rowsPerPage = 2;

  const handleChangePagePendientes = (event, newPage) => {
    setCurrentPagePendientes(newPage - 1);
  };

  const handleChangePageAceptados = (event, newPage) => {
    setCurrentPageAceptados(newPage - 1);
  };

  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", height:"88vh"}}>
      <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px"}}>Gestión de vendedores</Typography>
        
      <Box sx={{height:"45%"}}>
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Typography sx={{ fontSize: "25px", fontWeight: "bold", marginBottom: "10px" }}>Vendedores Pendientes</Typography>

        {ListaVendedoresAsistentesPendientes && ListaVendedoresAsistentesPendientes.length > 0 ? (
          <Box sx={{ height: "75%" }}>
            {ListaVendedoresAsistentesPendientes.slice(currentPagePendientes * rowsPerPage, (currentPagePendientes + 1) * rowsPerPage).map((vendedor) => {
              return (
                <CardGestionVendedor vendedor={vendedor} handleInformacionVendedorAsistente={handleInformacionVendedorAsistente} 
                opcionPendiente={1}/>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ height: "75%" }}>
            <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
              No se tienen vendedores pendientes
            </Typography>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(ListaVendedoresAsistentesPendientes ? ListaVendedoresAsistentesPendientes.length / rowsPerPage : 0)}
            page={currentPagePendientes + 1}
            onChange={handleChangePagePendientes}
          />
        </Box>
      </Box>

      <Box sx={{height:"49%", marginTop:"10px"}}>
        <hr style={{ margin: "20px 0", border: "0", borderTop: "2px solid #ccc" }} />

        <Typography sx={{ fontSize: "25px", fontWeight: "bold", marginBottom: "10px" }}>Vendedores Confirmados</Typography>

        {ListaVendedoresAsistentesAceptados && ListaVendedoresAsistentesAceptados.length > 0 ? (
          <Box sx={{ height: "71%"}}>
            {ListaVendedoresAsistentesAceptados.slice(currentPageAceptados * rowsPerPage, (currentPageAceptados + 1) * rowsPerPage).map((vendedor) => {
              return (
                <CardGestionVendedor vendedor={vendedor} handleInformacionVendedorAsistente={handleInformacionVendedorAsistente} 
                opcionPendiente={0}/>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ height: "71%" }}>
            <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
              No se tienen vendedores confirmados
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(ListaVendedoresAsistentesAceptados ? ListaVendedoresAsistentesAceptados.length / rowsPerPage : 0)}
            page={currentPageAceptados + 1}
            onChange={handleChangePageAceptados}
          />
        </Box>
      </Box>

    </Box>
  )
}
