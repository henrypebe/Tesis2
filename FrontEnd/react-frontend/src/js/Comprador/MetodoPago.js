import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { add  } = require('date-fns');

export default function MetodoPago({setMostrarMetodoPago, setMostrarProductos, productos, conteoCarritoCompra,
    setProductos, setConteoCarritoCompra, idUsuario}) {

    const handleBackPedido = () =>{
        setMostrarMetodoPago(false);
        setMostrarProductos(true);
    }

    const convertirTiempoANumeros = tiempo => {
        const partes = tiempo.split(' ');
        const cantidad = parseInt(partes[0]);
        switch (partes[1]) {
          case 'Días':
            return cantidad / 30;
          case 'Meses':
            return cantidad;
          case 'Años':
            return cantidad * 12;
          default:
            return 0;
        }
    };

    const agregarTiempo = (tiempo) => {
        const [cantidad, unidad] = tiempo.split(' ');
        let fechaResultado;
        const fechaActual = new Date();
    
        // Agregar la cantidad de tiempo correspondiente
        if (unidad.toLowerCase() === 'días' || unidad.toLowerCase() === 'día') {
            fechaResultado = add(fechaActual, { days: parseInt(cantidad) });
        } else if (unidad.toLowerCase() === 'meses' || unidad.toLowerCase() === 'mes') {
            fechaResultado = add(fechaActual, { months: parseInt(cantidad) });
        } else if (unidad.toLowerCase() === 'años' || unidad.toLowerCase() === 'año') {
            fechaResultado = add(fechaActual, { years: parseInt(cantidad) });
        }

        return fechaResultado;
    };

    const crearPedidoXProducto = async (producto, idPedido) => {
        const response = await fetch(
            `https://localhost:7240/CreatePedidoXProducto?productoId=${producto.idProducto}&pedidoId=${idPedido}&cantidad=${producto.cantidad}&stock=${producto.stockMaximo}`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (response.ok) {
            return 'Pedido creado correctamente';
        } else if (response.status === 404) {
            throw new Error("Pedido no encontrado");
        } else {
            throw new Error("Error al crear el pedido");
        }
    };

    const handleProducto = async() =>{
        
        let productoMasLargo = null;
        let mayorTiempo = 0;

        productos.forEach(producto => {
            const tiempo = convertirTiempoANumeros(producto.fechaEnvio);
            if (tiempo > mayorTiempo) {
              mayorTiempo = tiempo;
              productoMasLargo = producto;
            }
        });

        const fechaResultado = agregarTiempo(productoMasLargo.fechaEnvio);
        const fechaISO = fechaResultado.toISOString();
        const formData = new FormData();
        formData.append('FechaEntrega', fechaISO);
        formData.append('Total', productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0));
        formData.append('Estado', 1);
        formData.append('CantidadProductos', conteoCarritoCompra);
        formData.append('MetodoPago', "Nada");
        formData.append('UsuarioID', idUsuario);

        const response = await fetch(
            `https://localhost:7240/CreatePedido`,
            {
              method: "POST",
              body: formData
            }
        );
    
        if (response.ok) {
            const idPedido = await response.json();
            const promises = productos.map(producto => crearPedidoXProducto(producto, idPedido));
            await Promise.all(promises);
            toast.success('El pedido fue creado correctamente', { autoClose: 2000 });
            setProductos([]);
            setConteoCarritoCompra(0);
            setMostrarMetodoPago(false);
            setMostrarProductos(true);
        } else if (response.status === 404) {
            throw new Error("Pedido no encontrado");
        } else {
            throw new Error("Error al crear el pedido");
        }

        setMostrarMetodoPago(false);
        setMostrarProductos(true);
    }
    
  return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
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

        <Button variant="contained" sx={{width:"95%", marginTop:"10px", backgroundColor:"#286C23", '&:hover':{backgroundColor:"#286C23"}}}
            onClick={handleProducto}
        >
            Agregar método de pago
        </Button>
    </Box>
  )
}
