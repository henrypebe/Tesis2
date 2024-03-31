import { Box, Typography } from '@mui/material'
import React from 'react'
import CardEstadisticaCompra from '../Comprador/CardEstadisticaCompra'

export default function EstadisticaVendedor() {
  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
        <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Estadisticas</Typography>
        
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginBottom:"20px"}}>
            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%",
                borderRadius:"6px"}}>
                <Box sx={{backgroundColor:"#3AC4E2", padding:"8px", marginRight:"10px"}}>
                    <img src='https://cdn-icons-png.flaticon.com/512/4814/4814852.png' alt='' style={{color:"white", height:"80px"}}/>
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Total de clientes:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>10</Typography>
                </Box>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%",
                borderRadius:"6px"}}>
                <Box sx={{backgroundColor:"#1FD367", padding:"8px", marginRight:"10px"}}>
                    <img src='https://cdn-icons-png.flaticon.com/256/309/309276.png' alt='' style={{color:"white", height:"80px"}}/>
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Seguimientos completados:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>25</Typography>
                </Box>
            </Box>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginBottom:"20px"}}>
            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%",
                borderRadius:"6px"}}>
                <Box sx={{backgroundColor:"#F8B44F", padding:"8px", marginRight:"10px"}}>
                    <img src='https://cdn-icons-png.flaticon.com/512/1312/1312307.png' alt='' style={{color:"white", height:"80px"}}/>
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Productos publicados:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>70</Typography>
                </Box>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%",
                borderRadius:"6px"}}>
                <Box sx={{backgroundColor:"#EF74BE", padding:"8px", marginRight:"10px"}}>
                    <img src='https://cdn-icons-png.flaticon.com/512/4829/4829845.png' alt='' style={{color:"white", height:"80px"}}/>
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Seguimientos pendientes:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>10</Typography>
                </Box>
            </Box>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginBottom:"20px"}}>
            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%",
                borderRadius:"6px"}}>
                <Box sx={{backgroundColor:"#C890E2", padding:"8px", marginRight:"10px"}}>
                    <img src='https://cdn-icons-png.flaticon.com/256/7875/7875900.png' alt='' style={{color:"white", height:"80px"}}/>
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Pedidos en proceso:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>10</Typography>
                </Box>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%",
                borderRadius:"6px"}}>
                <Box sx={{backgroundColor:"#CFC709", padding:"8px", marginRight:"10px"}}>
                    <img src='https://cdn-icons-png.flaticon.com/512/1439/1439004.png' alt='' style={{color:"white", height:"80px"}}/>
                </Box>

                <Box sx={{marginRight:"10px", width:"60%"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>Pedidos completados:</Typography>
                </Box>

                <Box sx={{ width:"14%", textAlign:"center"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"100%"}}>200</Typography>
                </Box>
            </Box>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"center", marginTop:"20px"}}>
            <Box sx={{display:"flex", flexDirection:"column", marginRight:"10px", border:"2px solid black", alignItems:"center", width:"50%",
                borderRadius:"6px"}}>
                <Box sx={{display:"flex", flexDirection:"row", backgroundColor:"#6284DD", width:"97.2%", padding:"10px",
                borderRadius:"6px 6px 0px 0px", borderBottom:"2px solid black"}}>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"70%", }}>
                        Cantidad de ventas totales:
                    </Typography>
                    <Typography sx={{color:"black", fontWeight:"bold", fontSize:"24px", width:"38.5%",
                    display:"flex", alignItems:"center", justifyContent:"center"}}>
                        S/.400.00
                    </Typography>
                </Box>

                <CardEstadisticaCompra />
                <CardEstadisticaCompra />
            </Box>
        </Box>
    </Box>
  )
}
