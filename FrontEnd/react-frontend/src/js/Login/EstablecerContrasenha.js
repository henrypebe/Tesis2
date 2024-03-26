import { Box, Button, TextField, Typography } from '@mui/material'
import React from 'react'

export default function EstablecerContrasenha() {
    const handleCreateUser = async () => {
        try {
            window.location.href = "/MenuComprador";
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
        <Typography sx={{ fontSize:"24px", fontFamily:"sans-serif", fontWeight:"600", width:"100%", textAlign:"center", marginBottom:"30px"}}>
            Restablecer la contraseña
        </Typography>

        <TextField id="outlined-basic" label="Nueva Contraseña" variant="outlined" sx={{marginBottom:"30px"}}/>

        <TextField id="outlined-basic" label="Confirmar Contraseña" variant="outlined" sx={{marginBottom:"30px"}}/>
        
        <Button variant="contained" sx={{backgroundColor:"#286C23",'&:hover': {backgroundColor:"#286C23"}}}
        onClick={handleCreateUser}
        >
            Ingresar
        </Button>
      </Box>
    </div>
  )
}
