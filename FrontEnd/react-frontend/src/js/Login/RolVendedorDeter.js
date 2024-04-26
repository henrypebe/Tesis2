import React from 'react';
import { Box, Typography, Checkbox, Button } from '@mui/material'
import { useParams } from 'react-router-dom';

export default function RolVendedorDeter({onLoginVendedor}) {
  const { idUsuario } = useParams();
  const [esVendedorAsistente, setEsVendedorAsistente] = React.useState(false);
  
  const handleCheckboxChange = (newValue) => {
    setEsVendedorAsistente(newValue);
  };

  const handleCreateUser = async () => {
    try {
        const response = await fetch(`https://localhost:7240/EditarRolVendedorUsuario?idUsuario=${idUsuario}&esAsistenteVendedor=${esVendedorAsistente}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            if(!esVendedorAsistente){
                window.location.href = `/TiendaInformacion/${idUsuario}`;
            }else{
                // onLoginVendedor(idUsuario);
                window.location.href = `/BusquedaTienda/${idUsuario}`;
            }
        } else {
            throw new Error('Error al crear el usuario');
        }
    } catch (error) {
        console.error('Error al crear el usuario:', error);
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
        width: "600px"
      }}
      >
        <Box sx={{display:"flex", flexDirection:"row"}}>
            <Typography sx={{ fontSize:"24px", fontFamily:"sans-serif", fontWeight:"600", width:"100%", textAlign:"center", marginBottom:"35px"}}>
                ¿Es asistente de una tienda?
            </Typography>
        </Box>
        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"35px"}}>
          <Box sx={{border:"1px solid #C2C2C2", borderRadius:"6px", display:"flex", flexDirection:"row", width:"50%", marginRight:"10px"}}>
                <Checkbox checked={esVendedorAsistente === true}
                  onChange={() => handleCheckboxChange(true)}
                />
                <Box sx={{display:"flex", justifyContent:"center", flexDirection:"column", padding:"5px"}}>
                    <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                        <Typography sx={{marginRight:"10px", fontSize:"22px"}}><b>Asistente</b></Typography>
                        <img src='https://cdn-icons-png.flaticon.com/512/80/80645.png' alt='' style={{height:"30px"}}/>
                    </Box>
                    <Typography sx={{fontSize:"17px"}}>Soy asistente de una tienda existente dentro del sistema.</Typography>
                </Box>
          </Box>

          <Box sx={{border:"1px solid #C2C2C2", borderRadius:"6px", display:"flex", flexDirection:"row", width:"50%", marginRight:"10px"}}>
                <Checkbox checked={esVendedorAsistente === false}
                  onChange={() => handleCheckboxChange(false)}
                />
                <Box sx={{display:"flex", justifyContent:"center", flexDirection:"column", padding:"5px"}}>
                    <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                        <Typography sx={{marginRight:"10px", fontSize:"22px"}}><b>Administrador</b></Typography>
                        <img src='https://cdn-icons-png.flaticon.com/512/2825/2825764.png' alt='' style={{height:"30px"}}/>
                    </Box>
                    <Typography sx={{fontSize:"17px"}}>Quiero crear mi propia tienda dentro del sistema.</Typography>
                </Box>
          </Box>
        </Box>
        <Button variant="contained" sx={{backgroundColor:"#286C23",'&:hover': {backgroundColor:"#286C23"}}}
        onClick={handleCreateUser}
        >
            Continuar
        </Button>
      </Box>
    </div>
  )
}
