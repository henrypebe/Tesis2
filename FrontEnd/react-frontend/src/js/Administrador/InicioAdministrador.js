import { Box, Button, Typography } from '@mui/material'
import React from 'react'

export default function InicioAdministrador({setMostrarInicio, setMostrarEstadistica, setMostrarGestionAprobacion}) {

    const handleChangeEstadistica = () =>{
        setMostrarInicio(false);
        setMostrarEstadistica(true);
        setMostrarGestionAprobacion(false);
    }

    const handleChangeAprobacion = () =>{
        setMostrarInicio(false);
        setMostrarEstadistica(false);
        setMostrarGestionAprobacion(true);
    }
    
  return (
    <Box sx={{padding:"20px", width:"80.37%", marginTop:"-1.9px", height:"88vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px"}}>Información</Typography>
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />
        <Box sx={{height:"80%", display:"flex", alignItems:"center", flexDirection:"column", justifyContent:"space-between"}}>
            <Button sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", border:"2px solid black",
            borderRadius:"6px", backgroundColor:"#D9D5D5", width:"80%", color:"black", height:"50%", marginBottom:"20px",
            '&:hover':{backgroundColor:"#D9D5D5"}}}
            onClick={handleChangeEstadistica}
            >
                <img src='https://cdn-icons-png.flaticon.com/512/2278/2278925.png' alt='' style={{height:"120px"}}/>
                <Typography sx={{fontWeight:"bold", fontSize:"30px", marginLeft:"50px", width:"40%"}}>
                    Estadistica
                </Typography>
            </Button>

            <Button sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", border:"2px solid black",
            borderRadius:"6px", backgroundColor:"#D9D5D5", width:"80%", color:"black", height:"50%",
            '&:hover':{backgroundColor:"#D9D5D5"}}}
            onClick={handleChangeAprobacion}
            >
                <img src='https://cdn-icons-png.flaticon.com/512/8622/8622256.png' alt='' style={{height:"120px"}}/>
                <Typography sx={{fontWeight:"bold", fontSize:"30px", marginLeft:"50px", width:"40%"}}>
                    Gestión de aprobaciones
                </Typography>
            </Button>
        </Box>
    </Box>
  )
}
