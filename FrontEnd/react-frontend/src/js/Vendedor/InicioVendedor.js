import { Box, Button, Divider, Typography } from '@mui/material'
import React from 'react';
import HandshakeIcon from '@mui/icons-material/Handshake';

export default function InicioVendedor({setMostrarInicio, setMostrarEstadisticaVendedor, setMostrarVentas, setMostrarMisProductos,
  setMostrarSeguimientoVendedor, setMostrarBilletera, setMostrarReclamo}) {
  
  const handleClickEstadistica = () =>{
    setMostrarInicio(false);
    setMostrarEstadisticaVendedor(true);
  }

  const handleClickPedido = () =>{
    setMostrarInicio(false);
    setMostrarVentas(true);
  }

  const handleClickProducto = () =>{
    setMostrarInicio(false);
    setMostrarMisProductos(true);
  }

  const handleClickSeguimiento = () =>{
    setMostrarInicio(false);
    setMostrarSeguimientoVendedor(true);
  }

  const handleClickBilletera = () =>{
    setMostrarInicio(false);
    setMostrarBilletera(true);
  }

  const handleClickReclamo = () =>{
    setMostrarInicio(false);
    setMostrarReclamo(true);
  }

  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", height:"88vh"}}>
      <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px"}}>Información</Typography>
      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px", marginTop:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"930px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickEstadistica}
        >
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%", marginRight:"0px"}}>
            <img src='https://cdn-icons-png.freepik.com/512/950/950984.png' alt=''
              style={{marginRight:"10px", color:"black", height:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Ingresos:</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px"}}>20</Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />

          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <img src='https://cdn-icons-png.flaticon.com/256/1026/1026157.png' alt=''
              style={{marginRight:"10px", color:"black", height:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Ingresos pendientes:</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", marginRight:"20px", fontSize:"25px"}}>20</Typography>
          </Box>

        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px", marginTop:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"930px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickPedido}
        >
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%", marginRight:"0px"}}>
            <HandshakeIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Ventas completadas del día:</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px"}}>20</Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />

          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <img src='https://cdn-icons-png.flaticon.com/512/1701/1701869.png' alt=''
              style={{marginRight:"10px", color:"black", height:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Ventas pendientes del día:</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", marginRight:"20px", fontSize:"25px"}}>20</Typography>
          </Box>

        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px", marginTop:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"930px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickProducto}
        >
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%", marginRight:"0px"}}>
            <img src='https://cdn-icons-png.flaticon.com/512/7589/7589522.png' alt=''
              style={{marginRight:"10px", color:"black", height:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Productos en despacho:</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px"}}>20</Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />

          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <img src='https://cdn-icons-png.flaticon.com/512/4205/4205597.png' alt=''
              style={{marginRight:"10px", color:"black", height:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Producto en demanda</Typography>
            <Typography sx={{color:"black", width:"30%", textAlign:"right", marginRight:"20px", fontSize:"20px"}}>Alfajor</Typography>
          </Box>

        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px", marginTop:"20px"}}>
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"930px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickSeguimiento}
        >
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%", marginRight:"0px"}}>
            <img src='https://cdn-icons-png.flaticon.com/512/702/702821.png' alt=''
              style={{marginRight:"10px", color:"black", height:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Chats pendientes:</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px"}}>10</Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />

          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
            <img src='https://cdn-icons-png.freepik.com/512/4983/4983477.png' alt=''
              style={{marginRight:"10px", color:"black", height:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Porcentaje de satisfacción:</Typography>
            <Typography sx={{color:"black", width:"30%", textAlign:"right", marginRight:"20px", fontSize:"20px"}}>90%</Typography>
          </Box>

        </Button>
      </Box>

      <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px"}}>
        
        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"455px", marginRight:"20px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickBilletera}
        >
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"100%"}}>
            <img src='https://cdn-icons-png.flaticon.com/512/118/118111.png' alt=''
              style={{marginRight:"10px", color:"black", height:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"248px"}}>¿Billetera incorporada?</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px"}}>Si</Typography>
          </Box>
        </Button>

        <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"455px",
        '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}
        onClick={handleClickReclamo}
        >
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"100%"}}>
            <img src='https://cdn-icons-png.flaticon.com/512/1997/1997401.png' alt=''
              style={{marginRight:"10px", color:"black", height:"50px"}}/>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"250px"}}>Cantidad de reclamos</Typography>
            <Typography sx={{color:"black", width:"60px", textAlign:"right", fontSize:"25px", marginRight:"0px"}}>10</Typography>
          </Box>
        </Button>
      </Box>
    </Box>
  )
}
