import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm';

export default function MetodoPagoAumento({setMostrarMetodoPagoAdicionar, setMetodoPagoAumento, idUsuario}) {
    const handleBackPedido = () =>{
        setMostrarMetodoPagoAdicionar(true);
        setMetodoPagoAumento(false);
    }

    const handleChangeAgregar = () =>{
        setMostrarMetodoPagoAdicionar(true);
        setMetodoPagoAumento(false);
    }

    const [llavePublica, setLlavePublica] = useState();
    useEffect(() => {
        const obtenerllave = async () => {
            try {
                const response = await fetch(
                    `https://localhost:7240/ObtenerLlavePublicaStripe`,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                );
            
                if (response.ok) {
                    const _llavePublica = await response.text();
                    setLlavePublica(_llavePublica);
                }
            } catch (error) {
                console.error("Error al obtener la llave publica de stripe", error);
              throw new Error("Error al obtener la llave publica de stripe");
            }
        };
        obtenerllave();
    }, []);
    const stripePromise = loadStripe(llavePublica);
  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"88vh", maxHeight:"88vh"}}>
        <Box
            sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            }}
        >
            <Typography
            sx={{
                color: "black",
                fontWeight: "bold",
                fontSize: "24px",
                width: "100%",
            }}
            >
            METODOS DE PAGO
            </Typography>
            <Button
            variant="contained"
            sx={{
                backgroundColor: "white",
                color: "black",
                border: "2px solid black",
                width: "150px",
                fontSize: "17px",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "white" },
            }}
            onClick={handleBackPedido}
            >
            Atrás
            </Button>
        </Box>
        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />
        <Box>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"90%"}}>Nosotros aceptamos:</Typography>
            <Box sx={{display:"flex", flexDirection:"row"}}>
                <img src='https://static.vecteezy.com/system/resources/previews/020/975/567/non_2x/visa-logo-visa-icon-transparent-free-png.png'
                alt='' style={{height:"160px", marginRight:"100px"}}/>
                <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png'
                alt='' style={{height:"160px", marginRight:"100px"}}/>
                <img src='https://1000logos.net/wp-content/uploads/2021/05/Discover-logo.png'
                alt='' style={{height:"160px", marginRight:"100px"}}/>
                <img src='https://1000logos.net/wp-content/uploads/2016/10/American-Express-logo.png'
                alt='' style={{height:"160px", marginRight:"100px"}}/>
            </Box>
        </Box>

        <Box sx={{height:"60%"}}>
            <Elements stripe={stripePromise}>
            <Box>
                <StripePaymentForm opcion={2} handleChangeAgregar={handleChangeAgregar} idUsuario={idUsuario}/>
            </Box>
            </Elements>
        </Box>

        {/* <Button variant="contained" sx={{width:"95%", marginTop:"10px", backgroundColor:"#286C23", '&:hover':{backgroundColor:"#286C23"}}}
            onClick={handleChangeAgregar}
        >
            Agregar método de pago
        </Button> */}
    </Box>
  )
}
