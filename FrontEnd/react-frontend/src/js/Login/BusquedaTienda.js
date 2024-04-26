import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react'
import { Link, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BusquedaTienda() {
  const { idUsuario } = useParams();
  const [IdTienda, setIdTienda] = React.useState("");
  
  const handleBack = async () => {
    try {
        window.location.href = `/RolVendedor/${idUsuario}`;
    } catch (error) {
        console.error('Error al volver a la pantalla Rol', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await 
      fetch(`https://localhost:7240/AsignarTiendaVendedorAsistente?idUsuario=${idUsuario}&idTienda=${IdTienda}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          }
      });
      if (response.ok) {
        window.location.href = `/InformePublicacion`;
      } else {
        if (response.status === 400) {
          const errorMessage = await response.text();
          toast.error(errorMessage);
        } else {
          toast.error('Error al ingresar los datos, verifique nuevamente.');
        }
      }
  } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
  }
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
          height:"20%",
        }}
      >
        <Box sx={{display:"flex", flexDirection:"row"}}>
            <Link to={`/RolVendedor/${idUsuario}`} style={{ textDecoration: 'none' }}>
                <Button sx={{ maxWidth: "30px", minWidth: "30px", color: "black", background: "transparent" }}
                onClick={handleBack}
                >
                    <ArrowBackIcon />
                </Button>
            </Link>
            <Typography sx={{ fontSize:"24px", fontFamily:"sans-serif", fontWeight:"600", width:"100%", textAlign:"center", marginBottom:"24px"}}>
              Ingrese el ID de la tienda
            </Typography>
        </Box>
        <TextField id="outlined-basic" label="ID de la tienda (*)" variant="outlined" sx={{marginBottom:"19px"}}
          onChange={(e) => setIdTienda(e.target.value)}
        />
        <Button variant="contained" sx={{backgroundColor:"#286C23",'&:hover': {backgroundColor:"#286C23"}}}
          onClick={handleCreateUser}
        >
          Volver al login
        </Button>
      </Box>
    </div>
  )
}
