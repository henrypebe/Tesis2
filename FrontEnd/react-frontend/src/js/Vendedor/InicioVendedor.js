import { Box, Button, Divider, Typography } from '@mui/material'
import React, { useEffect } from 'react';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { BASE_URL } from "../../config";

export default function InicioVendedor({setMostrarInicio, setMostrarEstadisticaVendedor, setMostrarVentas, setMostrarMisProductos,
  setMostrarSeguimientoVendedor, setMostrarBilletera, setMostrarReclamo, informacionTienda, setMostrarGestionVendedor, esVendedorAdministrador,
  estadoVendedor}) {
  
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

  // const handleClickBilletera = () =>{
  //   setMostrarInicio(false);
  //   setMostrarBilletera(true);
  // }

  const handleClickGestionVendedor = () =>{
    setMostrarInicio(false);
    setMostrarGestionVendedor(true);
  }

  const handleClickReclamo = () =>{
    setMostrarInicio(false);
    setMostrarReclamo(true);
  }

  const [Estadistica, setEstadistica] = React.useState();
  useEffect(() => {
    const handleInformacionInicioVendedor = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/InicioVendedor?idTienda=${informacionTienda?informacionTienda.idTienda:0}`,
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
          throw new Error("Lista de estadistica inicial no encontrado");
        } else {
          throw new Error("Error al obtener la lista de estadistica inicial");
        }
      } catch (error) {
        console.error("Error al obtener la lista de estadistica inicial", error);
        throw new Error("Error al obtener la lista de estadistica inicial");
      }
    };
    handleInformacionInicioVendedor();
  }, [informacionTienda]);

  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", height:"88vh"}}>
      {estadoVendedor === 1?
      (
        <>
          <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px"}}>Información</Typography>
      
          <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

          <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px", marginTop:"20px"}}>
            <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#50E7FF", border:"1px solid #7B7B7B", width:"1450px",
            '&:hover': {backgroundColor:"#50E7FF", border:"1px solid #7B7B7B"}}}
            onClick={handleClickEstadistica}
            >
              <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%", marginRight:"0px"}}>
                <img src='https://cdn-icons-png.freepik.com/512/950/950984.png' alt=''
                  style={{marginRight:"10px", color:"black", height:"50px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Ingresos:</Typography>
                <Typography sx={{color:"black", width:"30%", textAlign:"right", fontSize:"25px"}}>
                  S/. {Estadistica?Estadistica.ingresos.toFixed(2).padStart(2, '0'):0}
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px"}} />

              <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
                <img src='https://cdn-icons-png.flaticon.com/256/1026/1026157.png' alt=''
                  style={{marginRight:"10px", color:"black", height:"50px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"50%"}}>Ingresos pendientes:</Typography>
                <Typography sx={{color:"black", width:"30%", textAlign:"right", marginRight:"20px", fontSize:"25px"}}>
                  S/. {Estadistica?Estadistica.ingresosPendientes.toFixed(2).padStart(2, '0'):0}
                </Typography>
              </Box>

            </Button>
          </Box>

          <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px", marginTop:"20px"}}>
            <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"1450px",
            '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}
            onClick={handleClickPedido}
            >
              <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%", marginRight:"0px"}}>
                <HandshakeIcon sx={{marginRight:"10px", color:"black", fontSize:"50px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Ventas completadas:</Typography>
                <Typography sx={{color:"black", width:"30%", textAlign:"right", fontSize:"25px"}}>
                  {Estadistica?Estadistica.ventasCompletadas.toFixed(0).padStart(2, '0'):0}
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px"}} />

              <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
                <img src='https://cdn-icons-png.flaticon.com/512/1701/1701869.png' alt=''
                  style={{marginRight:"10px", color:"black", height:"50px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"50%"}}>Ventas pendientes:</Typography>
                <Typography sx={{color:"black", width:"30%", textAlign:"right", marginRight:"20px", fontSize:"25px"}}>
                  {Estadistica?Estadistica.ventasPendientes.toFixed(0).padStart(2, '0'):0}
                </Typography>
              </Box>

            </Button>
          </Box>

          <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px", marginTop:"20px"}}>
            <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#50E7FF", border:"1px solid #7B7B7B", width:"1450px",
            '&:hover': {backgroundColor:"#50E7FF", border:"1px solid #7B7B7B"}}}
            onClick={handleClickProducto}
            >
              <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%", marginRight:"0px"}}>
                <img src='https://cdn-icons-png.flaticon.com/512/7589/7589522.png' alt=''
                  style={{marginRight:"10px", color:"black", height:"50px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Productos en despacho:</Typography>
                <Typography sx={{color:"black", width:"30%", textAlign:"right", fontSize:"25px"}}>
                  {Estadistica?Estadistica.productosPublicados.toFixed(0).padStart(2, '0'):0}
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />

              <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
                <img src='https://cdn-icons-png.flaticon.com/512/4205/4205597.png' alt=''
                  style={{marginRight:"10px", color:"black", height:"50px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"50%"}}>Producto en demanda</Typography>
                <Typography sx={{color:"black", width:"30%", textAlign:"right", marginRight:"20px", fontSize:"20px"}}>
                  {Estadistica?Estadistica.productoMasVendido:0}
                </Typography>
              </Box>

            </Button>
          </Box>

          <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px", marginTop:"20px"}}>
            <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#FFFF", border:"1px solid #7B7B7B", width:"1450px",
            '&:hover': {backgroundColor:"#FFFF", border:"1px solid #7B7B7B"}}}
            onClick={handleClickSeguimiento}
            >
              <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%", marginRight:"0px"}}>
                <img src='https://cdn-icons-png.flaticon.com/512/702/702821.png' alt=''
                  style={{marginRight:"10px", color:"black", height:"50px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"60%"}}>Chats pendientes:</Typography>
                <Typography sx={{color:"black", width:"30%", textAlign:"right", fontSize:"25px"}}>
                  {Estadistica?Estadistica.cantidadChatsPendientes.toFixed(0).padStart(2, '0'):0}
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />

              <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"50%"}}>
                <img src='https://cdn-icons-png.freepik.com/512/4983/4983477.png' alt=''
                  style={{marginRight:"10px", color:"black", height:"50px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"50%"}}>Porcentaje de satisfacción:</Typography>
                <Typography sx={{color:"black", width:"30%", textAlign:"right", marginRight:"20px", fontSize:"20px"}}>
                  {Estadistica?(Estadistica.porcentajeSatisfaccion*100).toFixed(2).padStart(2, '0'):0}%
                </Typography>
              </Box>

            </Button>
          </Box>

          <Box sx={{ width:"100%", display:"flex", justifyContent:"center", height:"100px", marginBottom:"20px"}}>
            
            {esVendedorAdministrador && (
              <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#50BAFF", border:"1px solid #7B7B7B", width:"715px", marginRight:"20px",
              '&:hover': {backgroundColor:"#50BAFF", border:"1px solid #7B7B7B"}}}
              onClick={handleClickGestionVendedor}
              >
                <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"100%"}}>
                  <img src='https://cdn-icons-png.freepik.com/512/327/327628.png' alt=''
                    style={{marginRight:"10px", color:"black", height:"50px"}}/>
                  <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"80%"}}>Vendedores esperando aprobación:</Typography>
                  <Typography sx={{color:"black", width:"30%", textAlign:"right", fontSize:"25px"}}>
                    {Estadistica && Estadistica.cantidadMetodoPago>0? "Si":"No"}
                  </Typography>
                </Box>
              </Button>
            )}

            <Button variant="contained" sx={{display:"flex", flexDirection:"row", background:"#50BAFF", border:"1px solid #7B7B7B", width:"715px",
            '&:hover': {backgroundColor:"#50BAFF", border:"1px solid #7B7B7B"}}}
            onClick={handleClickReclamo}
            >
              <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", width:"100%"}}>
                <img src='https://cdn-icons-png.flaticon.com/512/1997/1997401.png' alt=''
                  style={{marginRight:"10px", color:"black", height:"50px"}}/>
                <Typography sx={{color:"black", fontWeight:"bold", fontSize:"20px", width:"50%"}}>Cantidad de reclamos</Typography>
                <Typography sx={{color:"black", width:"30%", textAlign:"right", fontSize:"25px", marginRight:"0px"}}>
                  {Estadistica?(Estadistica.cantidadReclamo).toFixed(0).padStart(2, '0'):0}
                </Typography>
              </Box>
            </Button>
          </Box>
        </>
      ):
      (
      <>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px"}}>
          Aún no tiene autorización del Administrador de la tienda
        </Typography>
      </>
    )}
    </Box>
  )
}
