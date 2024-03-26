import { Box, Button, Divider, Typography } from '@mui/material'
import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function DetalleProducto({setMostrarDetalleProducto, setMostrarProductos, setMostrarCarrito}) {
    const handleChange = () =>{
        setMostrarDetalleProducto(false);
        setMostrarProductos(true);
    }

    const handleChangeCarrito = () =>{
        setMostrarDetalleProducto(false);
        setMostrarProductos(false);
        setMostrarCarrito(true);
    }
  
    return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
        <Box sx={{display:"flex", flexDirection:"row"}}>
            
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"90%"}}>Detalle de producto</Typography>
            
            <Button variant="contained" sx={{backgroundColor:"white", color: "black", border:"2px solid black", borderRadius:"5px", padding:"8px",
                width:"9%", height:"50px", marginRight:"10px",
                '&:hover': {backgroundColor:"white"}}}>
                <ShoppingCartIcon sx={{fontSize:"34px", marginRight:"12px"}}/>
                <Typography sx={{fontWeight:"bold", fontSize:"30px"}}>10</Typography>
            </Button>

            <Button variant="contained" sx={{backgroundColor:"#D9D9D9", color: "black", border:"2px solid black", borderRadius:"5px", padding:"8px",
                width:"9%", height:"50px", '&:hover': {backgroundColor:"#D9D9D9"}}} onClick={handleChange}>
                <Typography sx={{fontWeight:"bold", fontSize:"20px"}}>Atrás</Typography>
            </Button>

        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{display:"flex", flexDirection:"row", border:"2px solid black", borderRadius:"10px", padding:"5px", alignItems:"center"}}>
            <img src='https://holamayo.com/webmayo/wp-content/uploads/2020/09/Tambo.png' alt="Descripción de la imagen tienda"
            style={{height:"70px", borderRadius:"12px", marginLeft:"20px"}}
            />
            <Typography sx={{fontWeight:"bold", fontSize:"35px", width:"80%", marginLeft:"10px", textAlign:"center"}}>
                SAGA FALABELLA
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", padding:"5px", justifyContent:"center", height:"220px", marginTop:"10px"}}>
            <Box sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <img src="https://promart.vteximg.com.br/arquivos/ids/570404-1000-1000/22773.jpg?v=637401121588630000" alt="Descripción de la imagen" 
                style={{height:"200px"}}
                />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
            <Box sx={{marginLeft:"40px", border:"2px solid #D1D0D0", width:"40%", padding:"5px", borderRadius:"12px", backgroundColor:"#D1D0D0"}}>
                <Typography sx={{fontWeight:"bold", fontSize:"33px", width:"100%", marginLeft:"10px", textAlign:"center", marginTop:"0px"}}>
                    Caja mágica 3000
                </Typography>
                <Box sx={{display:"flex", flexDirection:"row", justifyContent:"center", height:"40px", alignItems:"center"}}>
                    <Typography sx={{fontWeight:"bold", fontSize:"28px", width:"30%", marginLeft:"10px", textAlign:"center", marginTop:"0px",
                        textDecoration: "line-through"}}>
                        S/.270.00
                    </Typography>
                    <Typography sx={{borderRadius:"5px", padding:"5px", border:"2px solid red", color:"red", fontSize:"14px", fontWeight:"bold"}}>
                        5% OFF
                    </Typography>
                </Box>
                <Typography sx={{fontWeight:"bold", fontSize:"28px", width:"100%", marginLeft:"10px", textAlign:"center", marginTop:"5px"}}>
                    S/.200.00
                </Typography>
                <Typography sx={{fontWeight:"bold", fontSize:"20px", width:"100%", marginLeft:"10px", textAlign:"center", marginTop:"5px", color:"#026700"}}>
                    <b>Costo de envío: S/.20.00</b>
                </Typography>
                <Typography sx={{fontWeight:"bold", fontSize:"20px", width:"100%", marginLeft:"10px", textAlign:"center", marginTop:"2px", color:"#026700"}}>
                    <b>Tiempo de garantía: 1 año</b>
                </Typography>
            </Box>
        </Box>

        <Box sx={{marginBottom:"10px"}}>
            <Typography sx={{fontWeight:"bold", fontSize:"24px", width:"30%", marginTop:"0px"}}>
                Descripción
            </Typography>
            <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />
            <Typography variant="h6" sx={{ fontSize: "20px", width: "30%", marginTop: "0px", paddingLeft: "20px" }}>
                &bull; Marca: Lux Waller
            </Typography>
            <Typography variant="h6" sx={{ fontSize: "20px", width: "30%", marginTop: "0px", paddingLeft: "20px" }}>
                &bull; Marca: Lux Waller
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", width:"100%", justifyContent:"space-between", marginTop:"20px"}}>
            <Button variant="contained" sx={{backgroundColor:"#1C2536", width:"50%", marginRight:"20px",'&:hover': {backgroundColor:"#1C2536"}}}
            onClick={handleChangeCarrito}
            >
                Agregar al carrito de compra
            </Button>

            <Button variant="contained" color="success" sx={{width:"50%"}}>
                Pagar ahora
            </Button>
        </Box>
    </Box>
  )
}
