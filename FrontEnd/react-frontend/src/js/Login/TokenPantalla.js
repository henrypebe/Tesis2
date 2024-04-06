import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

export default function TokenPantalla({onLoginAdministrador, onLoginComprador, onLoginVendedor}) {
  
    const { idUsuario } = useParams();
    // const [token, setToken] = useState('');
    const [TokenVerificar, setTokenVerificar] = useState('');

    const obtenerTokenPorIdUsuario = async (idUsuario) => {
        try {
            const response = await fetch(`https://localhost:7240/TokenIdUsuario?id=${idUsuario}`);
    
            if (response.ok) {
                const token = await response.text();
                return token;
            } else if (response.status === 404) {
                throw new Error('Usuario no encontrado');
            } else {
                throw new Error('Error al obtener el token');
            }
        } catch (error) {
            console.error('Error al obtener el token:', error);
            throw new Error('Error al obtener el token');
        }
    };

    const handleCreateUser = async () => {
        try {
            obtenerTokenPorIdUsuario(idUsuario)
            .then(async token => {
                if(token === TokenVerificar){
                    const response = await fetch(
                        `https://localhost:7240/ObtenerRol?idUsuario=${idUsuario}`,
                        {
                          method: "GET",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                    );
                    if (response.ok) {
                        const opcionPantalla = parseInt(await response.text());
                        switch (opcionPantalla) {
                            case 1:
                                onLoginAdministrador(idUsuario);
                                // Usar React Router si estás en un entorno de React Router
                                // history.push(`/MenuAdministrador/${idUsuario}`);
                                break;
                            case 2:
                                onLoginComprador(idUsuario);
                                // history.push(`/MenuComprador/${idUsuario}`);
                                break;
                            case 3:
                                onLoginVendedor(idUsuario);
                                // history.push(`/MenuVendedor/${idUsuario}`);
                                break;
                            default:
                                toast.error('Error al ingresar los datos, verifique nuevamente.');
                        }
                    } else if (response.status === 404) {
                        throw new Error("Rol no encontrado");
                    } else {
                        throw new Error("Error al obtener los roles");
                    }  
                }else{
                    toast.error('El token no es igual, verifiquelo.');
                }
            })
            .catch(error => {
                console.error('Error al obtener el token:', error.message);
            });
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
      };

    return (
    <div className='loginTotal'>
      <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '5px',
        padding: '20px 37px 20px 37px',
        display: "flex",
        flexDirection: "column",
        width: "400px"
      }}
      >
        <Typography sx={{ fontSize:"24px", fontFamily:"sans-serif", fontWeight:"600", width:"100%", textAlign:"center", marginBottom:"35px"}}>
            Ingrese el Token para el inicio de sesión
        </Typography>

        <Box sx={{width:"100%"}}>
            <TextField
                sx={{
                    height: 60, width:"100%",
                    fontSize: "25px",
                    "& .MuiInputBase-root": {
                    height: "100%",
                    fontSize: "25px",
                    },
                }}
                label="Token"
                defaultValue={TokenVerificar}
                onChange={(e) => setTokenVerificar(e.target.value)}
            />
        </Box>

        <Typography sx={{width:"100%", marginTop:"35px", fontSize:"14px", color:"#ADADAD", marginBottom:"10px"}}>
            (*) El token es enviado a su correo electrónico
        </Typography>

        <Button variant="contained" sx={{backgroundColor:"#286C23",'&:hover': {backgroundColor:"#286C23"}}}
        onClick={handleCreateUser}
        >
            Continuar
        </Button>

      </Box>
    </div>
  )
}
