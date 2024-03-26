import { Box, Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function RecuperarContrasenha() {
    const handleCreateUser = async () => {
        try {
            window.location.href = "/RecuperarContrasenhaSegundo";
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
        <Box sx={{display:"flex", flexDirection:"row"}}>
            <Link to="/Login" style={{ textDecoration: 'none' }}>
                <Button sx={{ maxWidth: "30px", minWidth: "30px", color: "black", background: "transparent" }}>
                    <ArrowBackIcon />
                </Button>
            </Link>
            <Typography sx={{ fontSize:"24px", fontFamily:"sans-serif", fontWeight:"600", width:"100%", textAlign:"center", marginBottom:"35px"}}>
                Recuperación de contraseña
            </Typography>
        </Box>

        <TextField id="outlined-basic" label="Correo electrónico (*)" variant="outlined" sx={{marginBottom:"19px"}}/>

        <TextField id="outlined-basic" label="Token (*)" variant="outlined" sx={{marginBottom:"19px"}}/>

        <Typography sx={{width:"100%", fontSize:"14px", color:"#ADADAD", marginBottom:"10px"}}>
            (*) El link se enviará a su correo, si los datos son correctos
        </Typography>

        <Button variant="contained" sx={{backgroundColor:"#286C23",'&:hover': {backgroundColor:"#286C23"}}}
        onClick={handleCreateUser}
        >
            Enviar enlace
        </Button>
      </Box>
    </div>
  )
}
