import { Box, Button, Typography } from '@mui/material'
import React from 'react'

export default function InicioAdministrador({setMostrarInicio, setMostrarEstadistica, setMostrarGestionAprobacion, setMostrarGestionAprobacionTienda}) {

    const handleChangeEstadistica = () =>{
        setMostrarInicio(false);
        setMostrarEstadistica(true);
        setMostrarGestionAprobacion(false);
        setMostrarGestionAprobacionTienda(false);
    }

    const handleChangeAprobacion = () =>{
        setMostrarInicio(false);
        setMostrarEstadistica(false);
        setMostrarGestionAprobacion(true);
        setMostrarGestionAprobacionTienda(false);
    }
    const handleChangeAprobacionTienda = () =>{
        setMostrarInicio(false);
        setMostrarEstadistica(false);
        setMostrarGestionAprobacion(false);
        setMostrarGestionAprobacionTienda(true);
    }
    
  return (
    <Box sx={{padding:"20px", width:"80.37%", marginTop:"-1.9px", height:"88vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px"}}>Información</Typography>
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />
        <Box sx={{height:"80%", display:"flex", alignItems:"center", flexDirection:"column", justifyContent:"space-between"}}>
            <Button sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", border:"2px solid black",
            borderRadius:"6px", backgroundColor:"#50BAFF", width:"80%", color:"black", height:"50%", marginBottom:"20px",
            '&:hover':{backgroundColor:"#50BAFF"}}}
            onClick={handleChangeEstadistica}
            >
                <img src='https://cdn-icons-png.flaticon.com/512/2278/2278925.png' alt='' style={{height:"120px"}}/>
                <Typography sx={{fontWeight:"bold", fontSize:"30px", marginLeft:"50px", width:"40%"}}>
                    Estadistica
                </Typography>
            </Button>

            <Button sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", border:"2px solid black",
            borderRadius:"6px", backgroundColor:"#50E7FF", width:"80%", color:"black", height:"50%", marginBottom:"20px",
            '&:hover':{backgroundColor:"#50E7FF"}}}
            onClick={handleChangeAprobacion}
            >
                <img src='https://cdn-icons-png.flaticon.com/512/8622/8622256.png' alt='' style={{height:"120px"}}/>
                <Typography sx={{fontWeight:"bold", fontSize:"30px", marginLeft:"50px", width:"40%"}}>
                    Gestión de aprobaciones de productos
                </Typography>
            </Button>

            <Button sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", border:"2px solid black",
            borderRadius:"6px", backgroundColor:"#50BAFF", width:"80%", color:"black", height:"50%",
            '&:hover':{backgroundColor:"#50BAFF"}}}
            onClick={handleChangeAprobacionTienda}
            >
                <img src='https://cdn-icons-png.flaticon.com/512/746/746900.png' alt='' style={{height:"120px"}}/>
                <Typography sx={{fontWeight:"bold", fontSize:"30px", marginLeft:"50px", width:"40%"}}>
                    Gestión de aprobaciones de tienda
                </Typography>
            </Button>
        </Box>
    </Box>
  )
}
