import { Box, Button, Divider, Typography } from '@mui/material'
import React from 'react';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import StarsIcon from '@mui/icons-material/Stars';
import ChatIcon from '@mui/icons-material/Chat';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import SavingsIcon from '@mui/icons-material/Savings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function InicioComprador() {
  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px"}}>
      
      <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px"}}>Información</Typography>
      
      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px", marginTop:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"930px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}>
          
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%", marginRight:"0px"}}>
            <HandshakeIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Pedidos recibidos:</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px"}}>20</Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
          
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <ReportProblemIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Pedidos pendientes:</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", marginRight:"20px", fontSize:"25px"}}>20</Typography>
          </Box>
        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"930px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}>
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <AssignmentTurnedInIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Productos disponibles:</Typography>
            <Typography sx={{color:"black", textAlign:"right", width:"60px", fontSize:"25px", marginRight:"0px"}}>20</Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", border:"2px solid black", marginRight:"20px", marginLeft:"20px"}} />
          
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <StarsIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Producto sensación:</Typography>
            <Typography sx={{color:"black", textAlign:"right", fontSize:"25px", marginRight:"0px"}}>Alfajor</Typography>
          </Box>
        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"930px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}>
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <ChatIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Chats creados:</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px", marginRight:"0px"}}>20</Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", border:"2px solid black", marginRight:"20px", marginLeft:"20px"}} />
          
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <MarkChatReadIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Chats cerrados</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px", marginRight:"0px"}}>20</Typography>
          </Box>
        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px"}}>
        
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"455px", marginRight:"20px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}>
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"100%"}}>
            <ReceiptLongIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"248px"}}>Gastos totales:</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px"}}>S/.20</Typography>
          </Box>
        </Button>

        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"455px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}>
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"100%"}}>
            <SavingsIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>¿Método de pago incorporado?</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px", marginRight:"0px"}}>Si</Typography>
          </Box>
        </Button>
      </Box>

    </Box>
  )
}

