import React, { useEffect, useState } from 'react';
import { CardNumberElement, CardExpiryElement, useStripe, useElements, CardCvcElement } from '@stripe/react-stripe-js';
import './StripePaymentForm.css';
import { Box, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from 'web3';
import EcommerceContract from '../../Blockchain/build/contracts/Ecommerce.json';
const { add  } = require('date-fns');

const StripePaymentForm = ({productos, conteoCarritoCompra, idUsuario, setProductos, setConteoCarritoCompra, setMostrarMetodoPago,
    setMostrarProductos, opcion, handleChangeAgregar}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [InformacionUsuario, setInformacionUsuario] = useState();

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
        // return 'Pedido creado correctamente';
    } else if (response.status === 404) {
        throw new Error("Pedido no encontrado");
    } else {
        throw new Error("Error al crear el pedido");
    }
    };  
  
  const handleProducto = async(event) =>{
        
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
        formData.append('MetodoPago', "00");
        formData.append('UsuarioID', idUsuario);
        formData.append('CostoEnvio', productos[0].costoEnvio/1);
        formData.append('DireccionEntrega', InformacionUsuario.direccion);

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

          handleProcesoPago(event, idPedido, fechaResultado);
            
        } else if (response.status === 404) {
            throw new Error("Pedido no encontrado");
        } else {
            throw new Error("Error al crear el pedido");
        }
  }

  async function createAndVerifyTransaction(fechaResultado, total, totalDescuento, token, costoEnvio) {
    try {
      console.log(fechaResultado);
        // Conexión a Ganache
        const web3 = new Web3('http://localhost:7545');
    
        // Obtener la instancia del contrato
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = EcommerceContract.networks[networkId];
        const contractInstance = new web3.eth.Contract(
            EcommerceContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        const totalEntero = parseInt(Math.round(total * 100));
        const totalDescuentoEntero = parseInt(Math.round(totalDescuento * 100));
        const costoEnvioEntero = Math.round(costoEnvio * 100);

        // Crear la transacción en el contrato
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const txReceipt = await contractInstance.methods
            .createTransaction(
            InformacionUsuario.nombre + " " + InformacionUsuario.apellido,
            Math.floor(fechaResultado),
            Math.floor(Date.now()),
            totalEntero,
            totalDescuentoEntero,
            false,
            conteoCarritoCompra,
            token,
            costoEnvioEntero,
            InformacionUsuario.direccion
            )
            .send({ from: account, gas: 5000000 });
        const transactionId = txReceipt.transactionHash.toString();
        await fetch(
            `https://localhost:7240/IngresarHashBlockchain?hash=${transactionId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
      console.error('Error al crear la transacción:', error);
    }
  }

  const handleProcesoPago = async(event, idPedido, fechaResultado) =>{

    if(InformacionUsuario.direccion !== null || InformacionUsuario.direccion !== ""){
      event.preventDefault();
      if (!stripe || !elements) {
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardNumberElement),
      });

      if (error) {
        toast.error('Se produjo un error, verifique los datos.');
        return;
      }

      let totalAmount = productos.reduce((total, producto) => {
        const precio = parseFloat(producto.precio - (producto.precio*producto.cantidadOferta/100));
        return total + (precio);
      }, 0);
      const costoEnvio = parseFloat(productos[0].costoEnvio);
      totalAmount = totalAmount + costoEnvio;
      const totalDescuento = productos.reduce((total, producto) => total + ((producto.precio * producto.cantidad * producto.cantidadOferta / 100)), 0).toFixed(3);

      createAndVerifyTransaction(fechaResultado, totalAmount, totalDescuento, paymentMethod.id, costoEnvio);

      //ALGORITMO

      const formData = new FormData();
      formData.append('token', paymentMethod.id);
      formData.append('Monto', totalAmount);
      formData.append('NombreApellido', "a");
      formData.append('correo', "a");
      formData.append('Opcion', 0);
      formData.append('IdUsuario', InformacionUsuario.idUsuario);

      const response = await fetch(
        'https://localhost:7240/ProcesarPago',
        {
          method: 'POST',
          body: formData
        }
      );

      if (response.ok) {
        const response = await fetch(
          `https://localhost:7240/EditarMetodoPago?idPedido=${idPedido}&token=${paymentMethod.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        if(response.ok){
          toast.success('El pedido fue creado correctamente', { autoClose: 2000 });
          setProductos([]);
          setConteoCarritoCompra(0);
          setMostrarMetodoPago(false);
          setMostrarProductos(true);
        }else{
          toast.error('Se produjo un error al editar el metodo de pago.');
        }
      } else {
        toast.error('Se produjo un error al procesar el pago.');
      }
    }else{
      toast.error('Debe ingresar una dirección de entrega para crear un pedido.');
    }
  }
  
  const handleSubmit = async (event) => {
    if(opcion === 1){
      // console.log("Logro");
      handleProducto(event);
    }else{
      const response2 = await fetch(
        `https://localhost:7240/InformacionIdUsuario?idUsuario=${idUsuario}`,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response2.ok) {
        const informacion = await response2.json();
        setInformacionUsuario(informacion);
        // console.log(informacion);
      }

      event.preventDefault();
      if (!stripe || !elements) {
        return;
      }
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardNumberElement),
      });

      // const { token, error } = await stripe.createToken(elements.getElement(CardNumberElement));

      if (error) {
          toast.error('Se produjo un error, verifique los datos.');
          return;
      }
      
      const { last4, exp_month, exp_year } = paymentMethod.card;
      const expirationDate = `${exp_month}/${exp_year}`;
      // const cvc = elements.getElement(CardCvcElement).value;

      const formData = new FormData();
      formData.append('Last4', last4);
      formData.append('FechaExpiracion', expirationDate);
      formData.append('Token', paymentMethod.id);
      formData.append('idUsuario', idUsuario);
      formData.append('NombreApellido',InformacionUsuario.nombre + " " + InformacionUsuario.apellido);
      formData.append('Correo',InformacionUsuario.correo);

      const response = await fetch(
          `https://localhost:7240/GuardarMetodoPago`,
          {
              method: "POST",
              body: formData
          }
      );

      if (response.ok) {
          toast.success("Metodo de pago incorporado", { autoClose: 2000 });
          handleChangeAgregar();
      } else if (response.status === 404) {
          throw new Error("Metodo de pago no encontrado");
      } else {
          throw new Error("Error al guardar el Metodo de pago");
      }
    }
  };


  useEffect(() => {
    const handle = async() =>{
      const response2 = await fetch(
        `https://localhost:7240/InformacionIdUsuario?idUsuario=${idUsuario}`,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const informacion = await response2.json();
      setInformacionUsuario(informacion);
      // console.log(informacion);
    }
    handle();
  }, [idUsuario]);

  return (
    <form className="payment-form" >
      <div className="form-row" style={{width:"95%", marginBottom:"20px"}}>
        <div>
          <Box sx={{marginBottom:"10px", display:"flex", flexDirection:"row", alignItems:"center"}}>
            <img src='https://cdn-icons-png.flaticon.com/512/423/423519.png' alt='' style={{height:"28px"}}/>
            <Typography sx={{fontSize:"20px", marginLeft:"10px"}}>
                Número de Tarjeta
            </Typography>
          </Box>
          <CardNumberElement className="card-input-element" />
        </div>
      </div>
      <div className="form-row" style={{width:"95%", marginBottom:"10px"}}>
        <div style={{marginBottom:"10px"}}>
            <Box sx={{marginBottom:"10px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <img src='https://i.pinimg.com/originals/0a/01/d4/0a01d47ef231cdbc18c04192f2c839ee.png' alt='' style={{height:"28px"}}/>
                <Typography sx={{fontSize:"20px", marginLeft:"10px"}}>Fecha de Expiración</Typography>
            </Box>
            <CardExpiryElement className="card-input-element" />
        </div>
        <div style={{marginBottom:"10px"}}>
            <Box sx={{marginBottom:"10px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                <img src='https://cdn-icons-png.flaticon.com/512/747/747305.png' alt='' style={{height:"28px"}}/>
                <Typography sx={{fontSize:"20px", marginLeft:"10px"}}>CVC</Typography>
            </Box>
            <CardCvcElement className="card-input-element" />
            {/* <TextField
                variant="outlined"
                sx={{ 
                    height: 34, 
                    width: "101.5%", 
                    '& .MuiInputBase-root': { 
                        height: '100%', 
                        fontSize: '14px'
                    },
                    '& .MuiInputLabel-root': {
                        display: cvc ? 'none' : 'block',
                        marginTop:"-10px"
                    }
                }} 
                value={cvc}
                onChange={handleInputChange}
                label="CVC"
                InputLabelProps={{ shrink: false }}
                inputProps={{ maxLength: 3 }}
            /> */}
            {/* <input
                type="text"
                value={cvc}
                onChange={(e) => setCVC(e.target.value)}
                maxLength="3"
            /> */}
        </div>
      </div>
      <Button variant="contained" sx={{width:"96.4%", marginTop:"0px", backgroundColor:"#286C23", '&:hover':{backgroundColor:"#286C23"}}} disabled={!stripe}
      onClick={handleSubmit}
      >
        {opcion===1?"Realizar pago":"Agregar Método de Pago"}
      </Button>
    </form>
  );
};

export default StripePaymentForm;