import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from './StripePaymentForm';


export default function MetodoPago({setMostrarMetodoPago, setMostrarProductos, productos, conteoCarritoCompra,
    setProductos, setConteoCarritoCompra, idUsuario}) {

    // console.log(productos);

    const handleBackPedido = () =>{
        setMostrarMetodoPago(false);
        setMostrarProductos(true);
    }    

    // const calcularFechaEnvio = (tiempo) => {
    //     const partes = tiempo.split(' ');
    //     const cantidad = parseInt(partes[0]);
    //     const unidad = partes[1];
    
    //     const fecha = new Date();
        
    //     switch (unidad) {
    //         case 'Días':
    //             fecha.setDate(fecha.getDate() + cantidad - 1);
    //             break;
    //         case 'Meses':
    //             fecha.setMonth(fecha.getMonth() + cantidad - 1);
    //             break;
    //         case 'Años':
    //             fecha.setFullYear(fecha.getFullYear() + cantidad - 1);
    //             break;
    //         default:
    //             throw new Error('Unidad de tiempo no válida');
    //     }
    
    //     return fecha.toISOString();
    // };

    const stripePromise = loadStripe('pk_test_51Oie68G77lj0glGvTr2uYiqcG0rIUCcZXorf26c8hcV7aKptz02DfQHY49fcB69JKjgHirxew6HXxMHpOwgiTGzp00cosFcBDA');
    
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
                <StripePaymentForm productos={productos} conteoCarritoCompra={conteoCarritoCompra} idUsuario={idUsuario} setProductos={setProductos}
                setConteoCarritoCompra={setConteoCarritoCompra} setMostrarMetodoPago={setMostrarMetodoPago} setMostrarProductos={setMostrarProductos}/>
            </Box>
            </Elements>
        </Box>

        {/* <Button variant="contained" sx={{width:"95%", marginTop:"10px", backgroundColor:"#286C23", '&:hover':{backgroundColor:"#286C23"}}}
            onClick={handleProducto}
        >
            Agregar método de pago
        </Button> */}
    </Box>
  )
}
