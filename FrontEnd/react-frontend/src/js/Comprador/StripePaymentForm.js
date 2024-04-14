import React from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './StripePaymentForm.css';
import { Box, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { add  } = require('date-fns');

const StripePaymentForm = ({productos, conteoCarritoCompra, idUsuario, setProductos, setConteoCarritoCompra, setMostrarMetodoPago,
    setMostrarProductos}) => {
  const stripe = useStripe();
  const elements = useElements();

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
    const formData = new FormData();
    // const fechaISO = calcularFechaEnvio(producto.fechaEnvio);
    formData.append('productoId', producto.idProducto);
    formData.append('pedidoId', idPedido);
    formData.append('cantidad', producto.cantidad);
    formData.append('stock', producto.stockMaximo);
    // formData.append('FechaEnvio', fechaISO);
    const response = await fetch(
        `https://localhost:7240/CreatePedidoXProducto`,
        {
            method: "POST",
            body: formData
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
        formData.append('Total', productos.reduce((total, producto) => total + ((producto.precio * producto.cantidad) - (producto.precio * producto.cantidad * producto.cantidadOferta / 100)), 0).toFixed(3));
        formData.append('TotalDescuento', productos.reduce((total, producto) => total + ((producto.precio * producto.cantidad * producto.cantidadOferta / 100)), 0).toFixed(3));
        formData.append('Estado', 1);
        formData.append('CantidadProductos', conteoCarritoCompra);
        formData.append('MetodoPago', "Nada");
        formData.append('UsuarioID', idUsuario);
        // formData.append('OpcionSeparado', productos[0].opcionSeparado === 1? true: false);
        formData.append('CostoEnvio', productos[0].costoEnvio/1);

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
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
    });

    if (!error) {
        handleProducto();
    }else{
        toast.error('Se produjo un error, verifique los datos.');
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="form-row" style={{width:"95%", marginBottom:"20px"}}>
        <div>
          <Box sx={{marginBottom:"10px", display:"flex", flexDirection:"row", alignItems:"center"}}>
            <img src='https://cdn-icons-png.flaticon.com/512/423/423519.png' alt='' style={{height:"40px"}}/>
            <Typography sx={{fontSize:"20px", marginLeft:"10px"}}>
                Número de Tarjeta
            </Typography>
          </Box>
          <CardNumberElement className="card-input-element" />
        </div>
      </div>
      <div className="form-row" style={{width:"95%", marginBottom:"20px"}}>
        <div style={{marginBottom:"20px"}}>
            <Box sx={{marginBottom:"10px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <img src='https://i.pinimg.com/originals/0a/01/d4/0a01d47ef231cdbc18c04192f2c839ee.png' alt='' style={{height:"35px"}}/>
                <Typography sx={{fontSize:"20px", marginLeft:"10px"}}>Fecha de Expiración</Typography>
            </Box>
            <CardExpiryElement className="card-input-element" />
        </div>
        <div style={{marginBottom:"20px"}}>
            <Box sx={{marginBottom:"10px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <img src='https://cdn-icons-png.flaticon.com/512/747/747305.png' alt='' style={{height:"35px"}}/>
                <Typography sx={{fontSize:"20px", marginLeft:"10px"}}>CVC</Typography>
            </Box>
            <CardCvcElement className="card-input-element" />
        </div>
      </div>
      <Button variant="contained" sx={{width:"96.4%", marginTop:"10px", backgroundColor:"#286C23", '&:hover':{backgroundColor:"#286C23"}}} type="submit" disabled={!stripe}>
        Realizar pago
      </Button>
    </form>
  );
};

export default StripePaymentForm;