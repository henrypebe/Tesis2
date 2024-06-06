import { Box, Pagination, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import CardGestionVendedor from './CardGestionVendedor';
import { BASE_URL } from "../../config";

export default function GestionVendedor({informacionTienda}) {

    const [ListaVendedoresAsistentes, setListaVendedoresAsistentes] = React.useState();
    
    const handleInformacionVendedorAsistente = async () => {
        try {
        const response = await fetch(
          `${BASE_URL}/ListarVendedoresAsistentes?idTienda=${informacionTienda?informacionTienda.idTienda:0}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.ok) {
          const valor = await response.json();
          setListaVendedoresAsistentes(valor);
          // console.log(valor);
        } else if (response.status === 404) {
          throw new Error("Vendedor no encontrado");
        } else {
          throw new Error("Error al obtener la lista de vendedores asistentes");
        }
      } catch (error) {
        console.error("Error al obtener la lista de vendedores asistentes", error);
        throw new Error("Error al obtener la lista de vendedores asistentes");
      }
    };

    useEffect(() => {
        const handleInformacionVendedorAsistente = async () => {
          
            try {
            const response = await fetch(
              `${BASE_URL}/ListarVendedoresAsistentes?idTienda=${informacionTienda?informacionTienda.idTienda:0}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
      
            if (response.ok) {
              const valor = await response.json();
              setListaVendedoresAsistentes(valor);
              // console.log(valor);
            } else if (response.status === 404) {
              throw new Error("Vendedor no encontrado");
            } else {
              throw new Error("Error al obtener la lista de vendedores asistentes");
            }
          } catch (error) {
            console.error("Error al obtener la lista de vendedores asistentes", error);
            throw new Error("Error al obtener la lista de vendedores asistentes");
          }
        };
        handleInformacionVendedorAsistente();
    }, [informacionTienda]);

    const [currentPage, setCurrentPage] = React.useState(0);
    const rowsPerPage = 5;
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage - 1);
    };

  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", height:"88vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px"}}>Gestión de vendedores</Typography>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        {ListaVendedoresAsistentes && ListaVendedoresAsistentes.length>0?
        (
            <Box sx={{height:"88%"}}>
                {ListaVendedoresAsistentes && ListaVendedoresAsistentes.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((vendedor) => {
                    return(
                      <CardGestionVendedor vendedor={vendedor} handleInformacionVendedorAsistente={handleInformacionVendedorAsistente}/>
                    );
                })}
            </Box>
        )
        :
        (
            <Box sx={{height:"88%"}}>
                <Typography sx={{fontSize:"20px", fontWeight:"bold"}}>
                No se tiene vendedores en espera
                </Typography>
            </Box>
        )}

        <Box sx={{ display:"flex", justifyContent:"center"}}>
            <Pagination count={Math.ceil(ListaVendedoresAsistentes ? ListaVendedoresAsistentes.length / rowsPerPage : 0)} page={currentPage + 1} onChange={handleChangePage}/>
        </Box>
    </Box>
  )
}
