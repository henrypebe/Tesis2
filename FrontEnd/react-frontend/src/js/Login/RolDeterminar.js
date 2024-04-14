import { Box, Button, Checkbox, Typography } from '@mui/material'
import React, { useState } from 'react'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useParams } from 'react-router-dom';

export default function RolDeterminar({onLoginComprador}) {
    const { idUsuario, Existente } = useParams();
    const [esVendedor, setEsVendedor] = useState(false);

    const handleCheckboxChange = (newValue) => {
        setEsVendedor(newValue);
    };

    const handleCreateUser = async () => {
        try {
            const response = await fetch(`https://localhost:7240/editarRolUsuario?idUsuario=${idUsuario}&esComprador=${!esVendedor}&esVendedor=${esVendedor}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                if(esVendedor){
                    if(Existente) window.location.href = `/SeleccionTienda/${idUsuario}`;
                    else window.location.href = `/RolVendedor/${idUsuario}`;
                }else{
                    // window.location.href = `/MenuVendedor/${idUsuario}`;
                    onLoginComprador(idUsuario);
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
                ¿Cuál es su finalidad?
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", marginBottom:"35px"}}>
            <Box sx={{border:"1px solid #C2C2C2", borderRadius:"6px", display:"flex", flexDirection:"row", width:"50%", marginRight:"10px"}}>
                <Checkbox checked={esVendedor === true}
                  onChange={() => handleCheckboxChange(true)}
                />
                <Box sx={{display:"flex", justifyContent:"center", flexDirection:"column", padding:"5px"}}>
                    <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                        <Typography sx={{marginRight:"10px", fontSize:"22px"}}>Vendedor</Typography>
                        <MonetizationOnIcon />
                    </Box>
                    <Typography sx={{fontSize:"17px"}}>Busco vender mis productos de manera online.</Typography>
                </Box>
            </Box>

            <Box sx={{border:"1px solid #C2C2C2", borderRadius:"6px", display:"flex", flexDirection:"row", width:"50%", marginRight:"10px"}}>
                <Checkbox checked={esVendedor === false}
                  onChange={() => handleCheckboxChange(false)}
                />
                <Box sx={{display:"flex", justifyContent:"center", flexDirection:"column", padding:"5px"}}>
                    <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                        <Typography sx={{marginRight:"10px", fontSize:"22px"}}>Comprador</Typography>
                        <ShoppingBagIcon />
                    </Box>
                    <Typography sx={{fontSize:"17px"}}>Busco comprar algunos productos de manera online.</Typography>
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
