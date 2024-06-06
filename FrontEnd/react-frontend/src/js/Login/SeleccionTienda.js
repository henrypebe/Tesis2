import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useParams } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../config";

export default function SeleccionTienda({onLoginVendedor}) {
    const { idUsuario } = useParams();
    
    const handleChangeMantenerTienda = async() =>{
        const response = await fetch(`${BASE_URL}/IniciarTiendaExistente?idUsuario=${idUsuario}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
            onLoginVendedor(idUsuario);
        } else {
          if (response.status === 400) {
            const errorMessage = await response.text();
            toast.error(errorMessage);
          } else {
              toast.error('Error al ingresar los datos, verifique nuevamente.');
          }
        }
    }

    const handleChangeNoMantener = () =>{
        window.location.href = `/RolVendedor/${idUsuario}`;
    }
    
    return (
        <div className='loginTotal'>
            <Box
            sx={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '20px 37px 20px 37px',
                display: "flex",
                flexDirection: "column",
                width: "600px",
                height:"18%",
            }}
            >
                <Box sx={{display:"flex", flexDirection:"row", height:"28%", marginBottom:"10px", width:"100%", justifyContent:"center", alignItems:"center"}}>
                    <BusinessIcon sx={{fontSize:"26px", marginRight:"10px"}}/>
                    <Typography sx={{ fontSize:"26px", fontFamily:"sans-serif", fontWeight:"600", textAlign:"center"}}>
                        Tiene una tienda creada
                    </Typography>
                </Box>
                <Box sx={{display:"flex", flexDirection:"row", marginBottom:"0px", height:"60%", alignItems:"center"}}>
                    <Button sx={{border:"1px solid #C2C2C2", borderRadius:"6px", display:"flex", flexDirection:"row", width:"50%", marginRight:"10px",
                    color:"black", height:"80%"}}
                    onClick={handleChangeMantenerTienda}
                    >
                        Deseo mantener la tienda anterior
                    </Button>
                    <Button sx={{border:"1px solid #C2C2C2", borderRadius:"6px", display:"flex", flexDirection:"row", width:"50%", marginRight:"10px",
                    color:"black", height:"80%"}} onClick={handleChangeNoMantener}>
                        No deseo mantener la tienda anterior
                    </Button>
                </Box>
            </Box>
        </div>
    )
}
