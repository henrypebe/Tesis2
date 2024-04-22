import { Box, Button, Divider, Typography } from '@mui/material'
import React, { useEffect } from 'react';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import StarsIcon from '@mui/icons-material/Stars';
import ChatIcon from '@mui/icons-material/Chat';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import SavingsIcon from '@mui/icons-material/Savings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

export default function InicioComprador({onMostrarInicioChange, onMostrarPedidosChange, setMostrarProductos,
  setMostrarSeguimiento, setMostrarEstadistica, setMostrarMetodoPago, setMostrarReclamo, idUsuario}) {
  const handleClickPedido = () => {
    onMostrarInicioChange(false);
    onMostrarPedidosChange(true);
  };

  const handleClickProducto = () => {
    onMostrarInicioChange(false);
    setMostrarProductos(true);
  };

  const handleClickChat = () => {
    onMostrarInicioChange(false);
    setMostrarSeguimiento(true);
  };

  const handleClickEstadistica = () => {
    onMostrarInicioChange(false);
    setMostrarEstadistica(true);
  };

  const handleClickMetodoPago = () => {
    onMostrarInicioChange(false);
    setMostrarMetodoPago(true);
  };

  const handleClickReclamo = () => {
    onMostrarInicioChange(false);
    setMostrarReclamo(true);
  };

  const [Estadistica, setEstadistica] = React.useState();
  useEffect(() => {
    const handleInformacionInicioComprador = async () => {
      try {
        const response = await fetch(
          `https://localhost:7240/InicioComprador?idUsuario=${idUsuario}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.ok) {
          const Estadisticas = await response.json();
          setEstadistica(Estadisticas);
          // console.log(Estadisticas);
        } else if (response.status === 404) {
          throw new Error("Seguimiento no encontrado");
        } else {
          throw new Error("Error al obtener la lista de estadistica inicial");
        }
      } catch (error) {
        console.error("Error al obtener la lista de estadistica inicial", error);
        throw new Error("Error al obtener la lista de estadistica inicial");
      }
    };
      handleInformacionInicioComprador();
  }, [idUsuario]);
  
  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", height:"88vh"}}>
      
      <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px"}}>Información</Typography>
      
      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px", marginTop:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#50E7FF", border:"1px solid #7B7B7B", width:"1450px",
        '&:hover': {backgroundColor:"#50E7FF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickPedido}
        >
          
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%", marginRight:"0px"}}>
            <HandshakeIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Pedidos realizados:</Typography>
            <Typography sx={{color:"black", width:"20%", textAlign:"right", fontSize:"25px"}}>
              {Estadistica?Estadistica.totalPedidosUsuario.toFixed(0).padStart(2, '0'):0}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
          
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <ReportProblemIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Pedidos pendientes:</Typography>
            <Typography sx={{color:"black", width:"20%", textAlign:"right", marginRight:"20px", fontSize:"25px"}}>
              {Estadistica?Estadistica.totalPedidosUsuarioPendiente.toFixed(0).padStart(2, '0'):0}
            </Typography>
          </Box>
        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"1450px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickProducto}
        >
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <AssignmentTurnedInIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Productos disponibles:</Typography>
            <Typography sx={{color:"black", textAlign:"right", width:"20%", fontSize:"25px", marginRight:"0px"}}>
              {Estadistica?Estadistica.totalProductosPublicados.toFixed(0).padStart(2, '0'):0}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", border:"2px solid black", marginRight:"20px", marginLeft:"20px"}} />
          
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <StarsIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Producto sensación:</Typography>
            <Typography sx={{color:"black", textAlign:"right", fontSize:"25px", marginRight:"0px", width:"20%"}}>
              {Estadistica?Estadistica.productoMasVendido:"Sin productos"}
            </Typography>
          </Box>
        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#50E7FF", border:"1px solid #7B7B7B", width:"1450px",
        '&:hover': {backgroundColor:"#50E7FF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickChat}
        >
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <ChatIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Chats creados:</Typography>
            <Typography sx={{color:"black", width:"20%", textAlign:"right", fontSize:"25px", marginRight:"0px"}}>
              {Estadistica?Estadistica.totalChats.toFixed(0).padStart(2, '0'):0}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", border:"2px solid black", marginRight:"20px", marginLeft:"20px"}} />
          
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <MarkChatReadIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Chats cerrados</Typography>
            <Typography sx={{color:"black", width:"20%", textAlign:"right", fontSize:"25px", marginRight:"0px"}}>
              {Estadistica?Estadistica.totalChatsFinalizadosCliente.toFixed(0).padStart(2, '0'):0}
            </Typography>
          </Box>
        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"1450px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickReclamo}
        >
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <RemoveShoppingCartIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Pedidos Reclamados:</Typography>
            <Typography sx={{color:"black", width:"20%", textAlign:"right", fontSize:"25px", marginRight:"0px"}}>
              {Estadistica?Estadistica.totalPedidosConReclamo.toFixed(0).padStart(2, '0'):0}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", border:"2px solid black", marginRight:"20px", marginLeft:"20px"}} />
          
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <MoneyOffIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Productos Reclamados:</Typography>
            <Typography sx={{color:"black", width:"20%", textAlign:"right", fontSize:"25px", marginRight:"0px"}}>
              {Estadistica?Estadistica.totalProductosConReclamo.toFixed(0).padStart(2, '0'):0}
            </Typography>
          </Box>
        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px"}}>
        
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#50BAFF", border:"1px solid #7B7B7B", width:"715px", marginRight:"20px",
        '&:hover': {backgroundColor:"#50BAFF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickEstadistica}
        >
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"100%"}}>
            <ReceiptLongIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Ahorros totales:</Typography>
            <Typography sx={{color:"black", width:"28%", textAlign:"right", fontSize:"25px"}}>
              - S/.{Estadistica?Estadistica.totalDescuentoPedidosUsuario.toFixed(2):(0).toFixed(2)}
            </Typography>
          </Box>
        </Button>

        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#50BAFF", border:"1px solid #7B7B7B", width:"715px",
        '&:hover': {backgroundColor:"#50BAFF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickMetodoPago}
        >
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"100%"}}>
            <SavingsIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>¿Método de pago incorporado?</Typography>
            <Typography sx={{color:"black", width:"20%", textAlign:"right", fontSize:"25px", marginRight:"0px"}}>
              Si
            </Typography>
          </Box>
        </Button>
      </Box>

    </Box>
  )
}

