import { Box, Button, Divider, Typography } from '@mui/material'
import React from 'react';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import StarsIcon from '@mui/icons-material/Stars';

export default function InicioComprador() {
  return (
    <Box sx={{padding:"20px", width:"86.6%", marginTop:"-1.9px"}}>
      <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px"}}>Información</Typography>
      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}>
          <HandshakeIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px"}}>Pedidos recibidos:</Typography>
          <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px"}}>20</Typography>
          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", border:"2px solid black", marginRight:"20px", marginLeft:"20px"}} />
          <ReportProblemIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px"}}>Pedidos pendientes:</Typography>
          <Typography sx={{color:"black", width:"60px", textAlign:"right", marginRight:"20px", fontSize:"25px"}}>20</Typography>
        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}>
          <AssignmentTurnedInIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px"}}>Productos disponibles:</Typography>
          <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px"}}>20</Typography>
          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", border:"2px solid black", marginRight:"20px", marginLeft:"20px"}} />
          <StarsIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px"}}>Producto sensación:</Typography>
          <Typography sx={{color:"black", width:"140px", textAlign:"right", marginRight:"20px", fontSize:"25px"}}>Alfajor</Typography>
        </Button>
      </Box>
    </Box>
  )
}

