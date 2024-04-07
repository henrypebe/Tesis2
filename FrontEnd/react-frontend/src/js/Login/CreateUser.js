import React, { useState } from 'react'
import '../../css/Login/LoginPage.css'
import { Box, Button, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import { SHA256 } from 'crypto-js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateUser() {
    const [email, setEmail] = useState('');
    const [DNI, setDNI] = useState(0);
    const [nombreApellido, setNombreApellido] = useState('');
    const [contrasenha, setContrasenha] = useState('');
    const [confirmarContrasenha, setConfirmarContrasenha] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleDNIChange = (e) => {
      let inputValue = e.target.value;
  
      if (inputValue.length <= 8) {
        setDNI(inputValue);
      }
    };

    const handleCreateUser = async () => {
        try {
          const hashedPassword = SHA256(contrasenha).toString();
          const hashedPassword2 = SHA256(confirmarContrasenha).toString();

          if(hashedPassword === hashedPassword2){

            const response = await fetch(`https://localhost:7240/CreateUsuario?DNI=${DNI}&nombreApellido=${nombreApellido}&correo=${email}&contrasenha=${hashedPassword}&contrasenhaVariado=${contrasenha}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
              const idUsuario = await response.json();
              window.location.href = `/Rol/${idUsuario}`;
            } else {
                throw new Error('Error al enviar el correo electrónico');
            }
          }else{
            toast.error('Las contraseñas no coinciden, intente nuevamente.');
          }
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
            toast.error('Las contraseñas no coinciden, intente nuevamente.');
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

        <TextField id="outlined-basic" label="DNI" variant="outlined" sx={{marginBottom:"19px"}}
          onChange={handleDNIChange} inputProps={{ maxLength: 8 }}
        />

        <TextField id="outlined-basic" label="Nombre y Apellido" variant="outlined" sx={{marginBottom:"19px"}}
          onChange={(e) => setNombreApellido(e.target.value)}
        />

        <TextField id="outlined-basic" label="Correo electrónico" variant="outlined" sx={{marginBottom:"19px"}} value={email}
          onChange={handleEmailChange}
        />

        <TextField id="outlined-basic" label="Contraseña" variant="outlined" sx={{marginBottom:"19px"}}  type='password'
          onChange={(e) => setContrasenha(e.target.value)}
        />

        <TextField id="outlined-basic" label="Confirmar contraseña" variant="outlined" sx={{marginBottom:"19px"}}  type='password'
          onChange={(e) => setConfirmarContrasenha(e.target.value)}
        />

        <Button variant="contained" sx={{backgroundColor:"#1C2536",'&:hover': {backgroundColor:"#1C2536"}}}
        onClick={handleCreateUser}
        >
            Crear usuario
        </Button>
      </Box>
    </div>
  )
}
