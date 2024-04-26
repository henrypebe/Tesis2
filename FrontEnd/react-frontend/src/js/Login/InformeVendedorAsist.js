import { Box, Button, Typography } from '@mui/material'
import React from 'react'

export default function InformeVendedorAsist() {
    const handleCreateUser = async () => {
        window.location.href = `/Login`;
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
                width: "600px"
            }}
        >
            <Box sx={{display:"flex", flexDirection:"row"}}>
                <Typography sx={{ fontSize:"28px", fontFamily:"sans-serif", fontWeight:"600", width:"100%", textAlign:"center", marginBottom:"35px"}}>
                    Se realizó la solicitud de ingreso como asistente correctamente
                </Typography>
            </Box>
            <Box sx={{display:"flex", flexDirection:"row"}}>
                <Typography sx={{ fontSize:"20px", fontFamily:"sans-serif", fontWeight:"400", width:"100%", textAlign:"justify", marginBottom:"35px"}}>
                    Se enviará un correo electrónico con el aviso de la aprobación o rechazo de la solicitud.
                </Typography>
            </Box>
            <Button variant="contained" sx={{backgroundColor:"#286C23",'&:hover': {backgroundColor:"#286C23"}}}
                onClick={handleCreateUser}
            >
                Volver al login
            </Button>
      </Box>
    </div>
  )
}
