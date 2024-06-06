import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BASE_URL } from "../../config";

export default function TiendaInformacion({onLoginVendedor}) {
    const [NombreTienda, setNombreTienda] = useState("");
    const [Descripcion, setDescripcion] = useState("");
    const [Direccion, setDireccion] = useState("");
    const [Provincia, setProvincia] = useState("");
    const [Pais, setPais] = useState("");

    const { idUsuario } = useParams();
    const handleCreateUser = async () => {
        try {
            const response = await 
            fetch(`${BASE_URL}/CreateTienda?idUsuario=${idUsuario}&nombre=${NombreTienda}&descripcion=${Descripcion}&direccion=${Direccion}&Provincia=${Provincia}&pais=${Pais}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                // const { idTienda } = await response.json();
                // console.log(idTienda);
                onLoginVendedor(idUsuario);
            } else {
                throw new Error("Error al ingresar");
            }
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

        <TextField id="outlined-basic" label="Nombre de la tienda (*)" variant="outlined" sx={{marginBottom:"19px"}}
            onChange={(e) => setNombreTienda(e.target.value)}
        />

        <TextField id="outlined-basic" label="Descripción de la tienda (*)" variant="outlined" sx={{marginBottom:"19px"}}
            onChange={(e) => setDescripcion(e.target.value)}
        />

        <TextField id="outlined-basic" label="Dirección (*)" variant="outlined" sx={{marginBottom:"19px"}}
            onChange={(e) => setDireccion(e.target.value)}
        />

        <Box sx={{display:"flex", flexDirection:"row", justifyContent: "space-between"}}>
            <TextField id="outlined-basic" label="Provincia (*)" variant="outlined" sx={{width:"50%", marginRight:"10px"}}
                onChange={(e) => setProvincia(e.target.value)}
            />
            <TextField id="outlined-basic" label="País (*)" variant="outlined" sx={{width:"50%"}}
                onChange={(e) => setPais(e.target.value)}
            />
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
