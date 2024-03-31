import React, { useState } from 'react'
import '../../css/Login/LoginPage.css'
import { Box, Button, Link, TextField, Typography } from "@mui/material";

export default function LoginPage() {
  const [emailType, setEmailType] = useState('');

  const handleCreateUser = async () => {
    try {
      if (emailType === '1') {
        window.location.href = "/MenuComprador";
      } else if (emailType === '2') {
        window.location.href = "/MenuVendedor";
      } else {
        console.error('Tipo de correo electrónico no válido');
      }
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
        <Typography sx={{textAlign:"center", fontSize:"24px", fontFamily:"sans-serif", marginBottom:"19px", fontWeight:"600"}}>
          ¡Bienvenido!
        </Typography>

        <TextField id="outlined-basic" label="Correo electrónico" variant="outlined" sx={{marginBottom:"19px"}}
        onChange={(e) => setEmailType(e.target.value)}/>

        <TextField id="outlined-basic" label="Contraseña" variant="outlined" sx={{marginBottom:"19px"}}/>
        
        <TextField id="outlined-basic" label="Token" variant="outlined" sx={{marginBottom:"19px"}}/>

        <Box sx={{marginBottom:"19px", display: "flex", justifyContent: "space-between"}}>
          <Link href="/CreateUser">¿Es usuario nuevo?</Link>
          <Link href="/RecuperarContrasenhaPrimer">¿Se olvidó la contraseña?</Link>
        </Box>

        <Button variant="contained" sx={{backgroundColor:"#1C2536", width:"100%",'&:hover': {backgroundColor:"#1C2536"}}}
        onClick={handleCreateUser}
        >Iniciar Sesión</Button>

      </Box>
    </div>
  )
}
