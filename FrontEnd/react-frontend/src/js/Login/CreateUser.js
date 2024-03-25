import React, { useState } from 'react'
import '../../css/Login/LoginPage.css'
import { Box, Button, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

export default function CreateUser() {
    const [email, setEmail] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
      };

    const handleCreateUser = async () => {
        try {
            const response = await fetch(`https://localhost:7240/emailToken?email=${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                alert(`Correo electrónico enviado exitosamente`);
            } else {
                throw new Error('Error al enviar el correo electrónico');
            }
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
            alert('Error al enviar el correo electrónico. Por favor, inténtalo de nuevo más tarde');
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
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", marginBottom:"19px"}}>
            <Link to="/Login" style={{ textDecoration: 'none' }}>
                <Button sx={{ maxWidth: "30px", minWidth: "30px", color: "black", background: "transparent" }}>
                    <ArrowBackIcon />
                </Button>
            </Link>
            <Typography sx={{ fontSize:"24px", fontFamily:"sans-serif", fontWeight:"600", width:"100%", textAlign:"center"}}>
                Crear un usuario nuevo
            </Typography>
        </Box>

        <TextField id="outlined-basic" label="DNI" variant="outlined" sx={{marginBottom:"19px"}}/>

        <TextField id="outlined-basic" label="Nombre y Apellido" variant="outlined" sx={{marginBottom:"19px"}}/>

        <TextField id="outlined-basic" label="Correo electrónico" variant="outlined" sx={{marginBottom:"19px"}} value={email} onChange={handleEmailChange}/>

        <TextField id="outlined-basic" label="Contraseña" variant="outlined" sx={{marginBottom:"19px"}}/>

        <TextField id="outlined-basic" label="Confirmar contraseña" variant="outlined" sx={{marginBottom:"19px"}}/>

        <Button variant="contained" sx={{backgroundColor:"#1C2536",'&:hover': {backgroundColor:"#1C2536"}}}
        onClick={handleCreateUser}
        >
            Crear usuario
        </Button>
      </Box>
    </div>
  )
}
