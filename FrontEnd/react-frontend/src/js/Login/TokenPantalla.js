import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

export default function TokenPantalla() {
  
    const { idUsuario } = useParams();
    const [token, setToken] = useState('');

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

    useEffect(() => {
      obtenerTokenPorIdUsuario(idUsuario)
          .then(token => {
              setToken(token);
          })
          .catch(error => {
              console.error('Error al obtener el token:', error.message);
          });
    }, [idUsuario]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(token).then(() => {
            toast.success('Token copiado al portapapeles', { autoClose: 2000 });
        }).catch((error) => {
          console.error('Error al copiar el token:', error);
          toast.error('Error al copiar el token. Por favor, inténtalo de nuevo');
        });
    };

    const handleCreateUser = async () => {
        try {
            window.location.href = `/Rol/${idUsuario}`;
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
            Token para el inicio de sesión
        </Typography>

        <Box sx={{display:"flex", flexDirection:"row", border:"1px solid #C2C2C2", borderRadius:"6px", alignItems:"center", padding:"10px"}}>
            <Typography sx={{width:"90%"}}>
              {token}
            </Typography>
            
            <Button sx={{color:"black", maxWidth:"30px", minWidth:"30px"}} onClick={copyToClipboard}>
                <ContentCopyIcon />
            </Button>
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
