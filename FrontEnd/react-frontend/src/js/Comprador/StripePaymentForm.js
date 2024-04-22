import React, { useEffect, useState } from 'react';
import { CardNumberElement, CardExpiryElement, useStripe, useElements, CardCvcElement } from '@stripe/react-stripe-js';
import './StripePaymentForm.css';
import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from 'web3';
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EcommerceContract from '../../Blockchain/build/contracts/Ecommerce.json';
const { add  } = require('date-fns');

const StripePaymentForm = ({productos, conteoCarritoCompra, idUsuario, setProductos, setConteoCarritoCompra, setMostrarMetodoPago,
    setMostrarProductos, opcion, handleChangeAgregar}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [InformacionUsuario, setInformacionUsuario] = useState();

  const [openModal, setOpenModal] = React.useState(false);
  const [TokenVerificar, setTokenVerificar] = useState('');
  const [PedidoSeleccionado, setPedidoSeleccionado] = useState();
  const [FechaSeleccionado, setFechaSeleccionado] = useState();
  const [TotalSeleccionado, setTotalSeleccionado] = useState();
  const [TotalDescuentoSeleccionado, setTotalDescuentoSeleccionado] = useState();
  const [TokenSeleccionado, setTokenSeleccionado] = useState();
  const [CostoEnvioSeleccionado, setCostoEnvioSeleccionado] = useState();

  const [openModalSegundo, setOpenModalSegundo] = React.useState(false);
  
  const handleOpen = (idPedido, fechaResultado, totalAmount, totalDescuento, token, costoEnvio) => {
    setOpenModal(true); 
    setPedidoSeleccionado(idPedido);
    setFechaSeleccionado(fechaResultado);
    setTotalSeleccionado(totalAmount);
    setTotalDescuentoSeleccionado(totalDescuento);
    setTokenSeleccionado(token);
    setCostoEnvioSeleccionado(costoEnvio);
  };
  const handleClose = () => {setOpenModal(false);};
  const handleBack = () =>{setOpenModal(true); setOpenModalSegundo(false);};
  const handleOpenSegundo = () => {setOpenModalSegundo(true); handleClose();};
  const handleCloseSegundo = () => {setOpenModalSegundo(false); setMostrarMetodoPago(false); setMostrarProductos(true); setConteoCarritoCompra(0);
    setProductos([])};
  
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    padding: "20px",
    borderRadius: "8px",
    height: "35%",
  };
  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    padding: "20px",
    borderRadius: "8px",
    height: "25%",
  };

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
    if((InformacionUsuario.direccion !== null || InformacionUsuario.direccion !== "") && 
    (InformacionUsuario.correoAleatorio !== null || InformacionUsuario.correoAleatorio !== "")){
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
      formData.append('Estado', 3);
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

        handleProcesoPago(event, idPedido, fechaResultado);
          
      } else if (response.status === 404) {
          throw new Error("Pedido no encontrado");
      } else {
          throw new Error("Error al crear el pedido");
      }
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

  const AlgoritmoObtener = async(fechaResultado, totalAmount, token, tipoProducto) =>{
    const _fechaResultado = new Date(fechaResultado);
    const año = _fechaResultado.getFullYear();
    const mes = ('0' + (_fechaResultado.getMonth() + 1)).slice(-2); // Agregar 1 porque los meses van de 0 a 11
    const dia = ('0' + _fechaResultado.getDate()).slice(-2);
    const hora = ('0' + _fechaResultado.getHours()).slice(-2);
    const minutos = ('0' + _fechaResultado.getMinutes()).slice(-2);
    const segundos = ('0' + _fechaResultado.getSeconds()).slice(-2);
    const fechaFormateada = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;

    const datosDirectosString = `ID: ${idUsuario}\n` +
    `Nombre y Apellido del Comprador: ${InformacionUsuario.nombre + " " + InformacionUsuario.apellido}\n` +
    `Fecha de Creación del Pedido: ${fechaFormateada}\n` +
    `Lugar de Entrega: ${InformacionUsuario.direccion}\n` +
    `Cantidad de cambios de lugar de entrega durante el ultimo mes: ${InformacionUsuario.cantCambiosDireccion}\n` +
    `Costo total del Pedido: ${totalAmount}\n` +
    `Método de Pago (Número de Cuenta Encriptado): ${token}\n` +
    `Numeros de cambios del método de pago: ${InformacionUsuario.cantMetodoPago}\n` +
    `Cantidad de Productos en el Pedido: ${conteoCarritoCompra}\n` +
    // `Cantidad de Productos en el Pedido: 100000\n` +
    `Tipo de Producto (con mayor valor): ${tipoProducto}`;

    try {
        const response = await fetch('http://localhost:5000/predecir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                datos_directos: datosDirectosString
            })
        });

        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
  }

  const handleProcesoPago = async(event, idPedido, fechaResultado) =>{
    if((InformacionUsuario.direccion !== null || InformacionUsuario.direccion !== "") && 
      (InformacionUsuario.correoAleatorio !== null || InformacionUsuario.correoAleatorio !== "")){
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
      
      let mayorValor = -Infinity;
      let productoConMayorValor = null;

      productos.forEach(producto => {
        const valor = producto.precio * producto.cantidad - (producto.precio * producto.cantidad * producto.cantidadOferta / 100);
        if (valor > mayorValor) {
        mayorValor = valor;
        productoConMayorValor = producto;
        }
      });

      //Algoritmo de detección de fraude
      const esFraude = await AlgoritmoObtener(fechaResultado, totalAmount, paymentMethod.id, productoConMayorValor.tipoProducto);

      if(esFraude !== "" && esFraude === "No Fraude"){
        await fetch(
          `https://localhost:7240/ActualizarEstadoPedido?idPedido=${idPedido}&valor=${1}`,
          {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
              },
          }
        );
        const promises = productos.map(producto => crearPedidoXProducto(producto, idPedido));
        await Promise.all(promises);
        //Almacenamiento en BLOCKCHAIN
        createAndVerifyTransaction(fechaResultado, totalAmount, totalDescuento, paymentMethod.id, costoEnvio);
        //Procesamiento de datos
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
        await fetch(
          `https://localhost:7240/EnviarCorreo?idUsuario=${idUsuario}`,
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
          }
        );
        handleOpen(idPedido, fechaResultado, totalAmount, totalDescuento, paymentMethod.id, costoEnvio);
        toast.error("Se detectó un movimiento fraudulento");
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

  const obtenerTokenPorIdUsuario = async (idUsuario) => {
    try {
        const response = await fetch(`https://localhost:7240/TokenIdUsuario?id=${idUsuario}`);

        if (response.ok) {
            const token = await response.text();
            return token;
        } else if (response.status === 404) {
            throw new Error('Usuario no encontrado');
        } else {
            throw new Error('Error al obtener el token');
        }
    } catch (error) {
        console.error('Error al obtener el token:', error);
        throw new Error('Error al obtener el token');
    }
  };
  const handleConfirmarToken = async() => {

    obtenerTokenPorIdUsuario(idUsuario).then(async token => {
        if(token === TokenVerificar){
            await fetch(
                `https://localhost:7240/ActualizarEstadoPedido?idPedido=${PedidoSeleccionado}&valor=${1}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                }
            );
            const promises = productos.map(producto => crearPedidoXProducto(producto, PedidoSeleccionado));
            await Promise.all(promises);
            createAndVerifyTransaction(FechaSeleccionado, TotalSeleccionado, TotalDescuentoSeleccionado, TokenSeleccionado, CostoEnvioSeleccionado);
            const formData = new FormData();
            formData.append('token', TokenSeleccionado);
            formData.append('Monto', TotalSeleccionado);
            formData.append('NombreApellido', InformacionUsuario.nombre + " " + InformacionUsuario.apellido);
            formData.append('correo', InformacionUsuario.correo);
            formData.append('Opcion', 1);
            try {
                const response = await fetch(
                    `https://localhost:7240/ProcesarPago`,
                    {
                    method: "POST",
                    body: formData
                    }
                );
            
                if (response.ok) {
                    toast.success('El pedido fue creado correctamente', { autoClose: 2000 });
                    setProductos([]);
                    setConteoCarritoCompra(0);
                    setMostrarMetodoPago(false);
                    setMostrarProductos(true);
                }
            } catch (error) {
                console.error("Error al obtener la lista de Métodos de pago", error);
                throw new Error("Error al obtener la lista de Métodos de pago");
            }
        }else{
            toast.error('No es el token correcto.');
        }
    })
    .catch(error => {
        console.error('Error al obtener el token:', error.message);
    });
  }

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
        </div>
      </div>
      <Button variant="contained" sx={{width:"96.4%", marginTop:"0px", backgroundColor:"#286C23", '&:hover':{backgroundColor:"#286C23"}}} disabled={!stripe}
      onClick={handleSubmit}
      >
        {opcion===1?"Realizar pago":"Agregar Método de Pago"}
      </Button>

      <Modal
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style }}>
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
                    fontSize: "30px",
                    width: "100%",
                    }}
                >
                    Asegurar el pedido sospechoso
                </Typography>

                <IconButton
                    sx={{
                    backgroundColor: "white",
                    color: "black",
                    width: "80px",
                    fontSize: "17px",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "white" },
                    }}
                    onClick={handleOpenSegundo}
                >
                    <CancelIcon sx={{ fontSize: "50px" }} />
                </IconButton>  
            </Box>
            <hr
                style={{
                    margin: "10px 0",
                    border: "0",
                    borderTop: "2px solid #ccc",
                    marginTop: "10px",
                    marginBottom: "15px",
                }}
            />
            <Box sx={{marginBottom:"10px"}}>
                <Typography
                    sx={{
                        color: "black",
                        fontSize: "25px",
                        width: "100%",
                        textAlign:"center"
                    }}
                >
                    Se envió un token a su correo electrónico alternativo, ingrese el token para asegurar la transacción
                </Typography>
            </Box>
            <Box sx={{width:"100%", marginBottom:"10px"}}>
                <TextField
                    sx={{
                        height: 60, width:"100%",
                        fontSize: "25px",
                        "& .MuiInputBase-root": {
                        height: "100%",
                        fontSize: "25px",
                        },
                    }}
                    label="Token"
                    defaultValue={TokenVerificar}
                    onChange={(e) => setTokenVerificar(e.target.value)}
                />
            </Box>
            <Button variant="contained" sx={{backgroundColor:"#1C2536", width:"100%",'&:hover': {backgroundColor:"#1C2536"}}}
                onClick={handleConfirmarToken}
            >
                Continuar
            </Button>
        </Box>
      </Modal>

      <Modal
        open={openModalSegundo}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style2 }}>
            <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
            >
                <IconButton
                    sx={{
                    backgroundColor: "white",
                    color: "black",
                    width: "80px",
                    fontSize: "17px",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "white" },
                    }}
                    onClick={handleBack}
                >
                    <ArrowBackIcon sx={{ fontSize: "50px" }} />
                </IconButton>
              <Typography
                    sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "30px",
                    width: "100%",
                    }}
                >
                    Confirmación de cancelar compra
                </Typography>
            </Box>
            <hr
                style={{
                    margin: "10px 0",
                    border: "0",
                    borderTop: "2px solid #ccc",
                    marginTop: "10px",
                    marginBottom: "15px",
                }}
            />
            <Box sx={{marginBottom:"40px"}}>
                <Typography
                    sx={{
                        color: "black",
                        fontSize: "30px",
                        width: "100%",
                        textAlign:"center"
                    }}
                >
                    ¿Desea cancelar la compra? No se podrá recuperar después.
                </Typography>
            </Box>
            <Button variant="contained" sx={{backgroundColor:"#1C2536", width:"100%",'&:hover': {backgroundColor:"#1C2536"}}}
                onClick={handleCloseSegundo}
            >
                Continuar
            </Button>
        </Box>
      </Modal>
    </form>
  );
};

export default StripePaymentForm;