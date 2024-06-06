import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import CardEstadisticaCompra from './CardEstadisticaCompra';
import { BASE_URL } from "../../config";

export default function EstadisticaComprador({idUsuario}) {
    const [Estadistica, setEstadistica] = React.useState();

    useEffect(() => {
        const obtenerListaSeguimiento = async () => {
            try {
              const response = await fetch(
                `${BASE_URL}/EstadisticaComprador?idUsuario=${idUsuario}`,
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
                throw new Error("Error al obtener la lista de estadistica");
              }
            } catch (error) {
              console.error("Error al obtener la lista de estadistica", error);
              throw new Error("Error al obtener la lista de estadistica");
            }
          };
          obtenerListaSeguimiento();
    }, [idUsuario]);

    return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"88vh", maxHeight:"88vh"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Resumen</Typography>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%"}}>
                <Box sx={{backgroundColor:"#528CFC", padding:"8px", marginRight:"10px"}}>
                    <img src='https://cdn-icons-png.flaticon.com/512/6632/6632848.png' alt='' style={{color:"white", height:"80px"}}/>
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Total de pedidos realizados:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>
                        {Estadistica? Estadistica.cantidadPedidos.toFixed(0).padStart(2, '0'):"00"}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%"}}>
                <Box sx={{backgroundColor:"#F8C646", padding:"8px", marginRight:"10px"}}>
                    <img src='https://cdn-icons-png.flaticon.com/256/5219/5219592.png' alt='' style={{color:"white", height:"80px"}}/>
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Total de pedidos completados:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>
                        {Estadistica? Estadistica.cantidadPedidosEstadoCompletado.toFixed(0).padStart(2, '0'):"00"}
                    </Typography>
                </Box>
            </Box>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginTop:"20px"}}>
            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%"}}>
                <Box sx={{backgroundColor:"#D9CD65", padding:"8px", marginRight:"10px"}}>
                    <img src='https://cdn-icons-png.flaticon.com/512/2728/2728447.png' alt='' style={{color:"white", height:"80px"}}/>
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Total de pedidos pendientes:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>
                        {Estadistica?Estadistica.cantidadPedidosEstadoPendiente.toFixed(0).padStart(2, '0'):"00"}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%"}}>
                <Box sx={{backgroundColor:"#76D4C9", padding:"8px", marginRight:"10px"}}>
                    <MarkChatReadIcon sx={{color:"white", fontSize:"80px"}}/>
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Pedidos con seguimiento completados:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>
                        {Estadistica?Estadistica.cantidadChatsFinalizados.toFixed(0).padStart(2, '0'):"00"}
                    </Typography>
                </Box>
            </Box>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginTop:"20px"}}>
            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%"}}>
                <Box sx={{backgroundColor:"#7FE25B", padding:"8px", marginRight:"10px"}}>
                    <MarkUnreadChatAltIcon sx={{color:"white", fontSize:"80px"}}/>
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Pedidos con seguimiento pendientes:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>
                        {Estadistica? Estadistica.cantidadChatsPendientes.toFixed(0).padStart(2, '0'):"00"}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%"}}>
                <Box sx={{backgroundColor:"#D48FB9", padding:"8px", marginRight:"10px"}}>
                    <img src='https://cdn-icons-png.flaticon.com/512/3176/3176255.png' alt='' style={{height:"80px"}} />
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Pedidos reclamados:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>
                        {Estadistica?Estadistica.cantidadPedidosConReclamo.toFixed(0).padStart(2, '0'):"00"}
                    </Typography>
                </Box>
            </Box>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"center", marginTop:"20px"}}>
            <Box sx={{display:"flex", flexDirection:"column", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%",
                borderRadius:"6px"}}>
                <Box sx={{display:"flex", flexDirection:"row", backgroundColor:"#84D8F3", width:"98.65%", padding:"5px",
                borderRadius:"6px 6px 0px 0px", borderBottom:"2px solid black"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"70%"}}>
                        Cantidad de ahorros totales:
                    </Typography>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"38.5%",
                    display:"flex", alignItems:"center", justifyContent:"center"}}>
                        - S/. {Estadistica? Estadistica.totalDescuento.toFixed(2):"00"}
                    </Typography>
                </Box>

                <CardEstadisticaCompra opcion={1} Estadistica={Estadistica} opcionComprador={1}/>
                <CardEstadisticaCompra opcion={2} Estadistica={Estadistica} opcionComprador={1}/>
                <CardEstadisticaCompra opcion={3} Estadistica={Estadistica} opcionComprador={1}/>
            </Box>
        </Box>

        
    </Box>
  )
}
