import { Box, Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { Link, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function TiendaInformacion() {
    const { idUsuario } = useParams();
    const handleCreateUser = async () => {
        try {
            window.location.href = `/MenuComprador/${idUsuario}`;
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
      };
      const handleBack = async () => {
        try {
            window.location.href = `/Rol/${idUsuario}`;
        } catch (error) {
            console.error('Error al volver a la pantalla Rol', error);
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
        width: "500px"
      }}
      >
        <Box sx={{display:"flex", flexDirection:"row"}}>
            <Link to="/Rol" style={{ textDecoration: 'none' }}>
                <Button sx={{ maxWidth: "30px", minWidth: "30px", color: "black", background: "transparent" }}
                onClick={handleBack}
                >
                    <ArrowBackIcon />
                </Button>
            </Link>
            <Typography sx={{ fontSize:"24px", fontFamily:"sans-serif", fontWeight:"600", width:"100%", textAlign:"center", marginBottom:"24px"}}>
                Información de tu tienda
            </Typography>
        </Box>

        <TextField id="outlined-basic" label="Nombre de la tienda (*)" variant="outlined" sx={{marginBottom:"19px"}}/>

        <TextField id="outlined-basic" label="Descripción de la tienda (*)" variant="outlined" sx={{marginBottom:"19px"}}/>

        <TextField id="outlined-basic" label="Dirección (*)" variant="outlined" sx={{marginBottom:"19px"}}/>

        <Box sx={{display:"flex", flexDirection:"row", justifyContent: "space-between"}}>
            <TextField id="outlined-basic" label="Distrito (*)" variant="outlined" sx={{width:"50%", marginRight:"10px"}}/>
            <TextField id="outlined-basic" label="País (*)" variant="outlined" sx={{width:"50%"}}/>
        </Box>

        <Typography sx={{width:"100%", marginTop:"25px", fontSize:"14px", color:"#ADADAD", marginBottom:"10px"}}>
            Campos obligatorios (*)
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
