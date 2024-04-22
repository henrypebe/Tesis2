import { Box, Button, Checkbox, Pagination, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from './StripePaymentForm';
import CardMetodoPagoComprador from './CardMetodoPagoComprador';
import { toast } from "react-toastify";
import Web3 from 'web3';
import EcommerceContract from '../../Blockchain/build/contracts/Ecommerce.json';
import "react-toastify/dist/ReactToastify.css";
const { add  } = require('date-fns');

export default function MetodoPago({setMostrarMetodoPago, setMostrarProductos, productos, conteoCarritoCompra,
    setProductos, setConteoCarritoCompra, idUsuario}) {
    // console.log(productos);
    const [ListaMetodoPago, setListaMetodoPago] = useState([]);
    const [llavePublica, setLlavePublica] = useState();
    const [InformacionUsuario, setInformacionUsuario] = useState();
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
                console.error("Error al obtener la lista de productos", error);
              throw new Error("Error al obtener la lista de productos");
            }
        };
        const ListarMétodosPago = async () => {
            try {
                const response = await fetch(
                    `https://localhost:7240/ListarBilleteraVendedor?idUsuario=${idUsuario}`,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                );
            
                if (response.ok) {
                    const valor = await response.json();
                    setListaMetodoPago(valor);
                    // console.log(valor);

                }
            } catch (error) {
                console.error("Error al obtener la lista de Métodos de pago", error);
              throw new Error("Error al obtener la lista de Métodos de pago");
            }
        };
        const InformacionUsuario = async () => {
            try {
                const response = await fetch(
                    `https://localhost:7240/InformacionIdUsuario?idUsuario=${idUsuario}`,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                );
            
                if (response.ok) {
                    const valor = await response.json();
                    setInformacionUsuario(valor);
                    // console.log(valor);

                }
            } catch (error) {
                console.error("Error al obtener la lista de Métodos de pago", error);
              throw new Error("Error al obtener la lista de Métodos de pago");
            }
        };
        ListarMétodosPago();
        obtenerllave();
        InformacionUsuario();
    }, [idUsuario]);

    const handleBackPedido = () =>{
        setMostrarMetodoPago(false);
        setMostrarProductos(true);
    }    
    const stripePromise = loadStripe(llavePublica);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedMethodId, setSelectedMethodId] = useState(1);
    const rowsPerPage = selectedMethodId === null? 1: 3;
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage - 1);
    };
    const handleCheckboxChange = (id) => {
        setSelectedMethodId(id);
    };

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

    const HandleProcesoPago = async(metodo, fechaResultado, total, totalDescuento, costoEnvio) =>{
        if((InformacionUsuario.direccion !== null || InformacionUsuario.direccion !== "") && 
            (InformacionUsuario.correoAleatorio !== null || InformacionUsuario.correoAleatorio !== "")){
            let totalAmount = productos.reduce((total, producto) => {
                const precio = parseFloat(producto.precio - (producto.precio*producto.cantidadOferta/100));
                return total + (precio);
            }, 0);

            let mayorValor = -Infinity;
            let productoConMayorValor = null;

            productos.forEach(producto => {
                const valor = producto.precio * producto.cantidad - (producto.precio * producto.cantidad * producto.cantidadOferta / 100);
                if (valor > mayorValor) {
                mayorValor = valor;
                productoConMayorValor = producto;
                }
            });

            const costoEnvio = parseFloat(productos[0].costoEnvio);
            totalAmount = totalAmount + costoEnvio;
            
            createAndVerifyTransaction(fechaResultado, totalAmount, totalDescuento, metodo.token, costoEnvio);

            const esFraude = await AlgoritmoObtener(fechaResultado, totalAmount, metodo.token, productoConMayorValor.tipoProducto);

            if(esFraude !== "" && esFraude === "No Fraude"){
                const formData = new FormData();
                formData.append('token', metodo.token);
                formData.append('Monto', totalAmount);
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
                toast.error("Se detectó un movimiento fraudulento");
            }
        }else{
            toast.error('Debe de tener una dirección de entrega y un correo aleatorio para crear un pedido.');
        }
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

    async function createAndVerifyTransaction(fechaResultado, total, totalDescuento, token, costoEnvio) {
        try {
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
    const handleProducto = async(metodo) =>{
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
        formData.append('MetodoPago', metodo.token);
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
            const total = productos.reduce((total, producto) => total + ((producto.precio * producto.cantidad) - (producto.precio * producto.cantidad * producto.cantidadOferta / 100)), 0).toFixed(3);
            const totalDescuento = productos.reduce((total, producto) => total + ((producto.precio * producto.cantidad * producto.cantidadOferta / 100)), 0).toFixed(3);
            const costoEnvio = productos[0].costoEnvio/1;
            
            const idPedido = await response.json();
            const promises = productos.map(producto => crearPedidoXProducto(producto, idPedido));
            await Promise.all(promises);

            HandleProcesoPago(metodo, fechaResultado, total, totalDescuento, costoEnvio);
        } else if (response.status === 404) {
            throw new Error("Pedido no encontrado");
        } else {
            throw new Error("Error al crear el pedido");
        }
    }
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
        
        <Box sx={{ maxHeight:selectedMethodId === null?"20%":"75%",minHeight:selectedMethodId === null?"20%":"75%", marginBottom:"0px"}}>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"90%"}}>Tus métodos de pago:</Typography>
            <Box sx={{ height: selectedMethodId === null ? "68px" : "494px", marginTop: "10px", marginBottom: "6px" }}>
                {ListaMetodoPago && (
                    ListaMetodoPago.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map(metodo => (
                        <CardMetodoPagoComprador
                            key={metodo.id}
                            metodo={metodo}
                            handleCheckboxChange={handleCheckboxChange}
                            selectedMethodId={selectedMethodId}
                            handleProducto={handleProducto}
                        />
                    ))
                )}
            </Box>
            <Box sx={{ display:"flex", justifyContent:"center"}}>
                <Pagination count={Math.ceil(ListaMetodoPago ? ListaMetodoPago.length / rowsPerPage : 0)} page={currentPage + 1} onChange={handleChangePage}/>
            </Box>
        </Box>

        <Box>
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"90%"}}>Otros métodos de pago:</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", border: "2px solid black", padding: "10px",
                borderRadius: "6px", marginBottom: "10px"}}>
                <Box sx={{display: "flex", flexDirection: "row", width:"100%", alignItems:"center"}}>
                    <Checkbox
                        checked={selectedMethodId === null}
                        onChange={() => setSelectedMethodId(null)}
                    />
                    <Typography sx={{ fontSize: "24px", fontWeight: "bold"}}>
                        Pagar con otro método de pago
                    </Typography>
                </Box>
                {selectedMethodId === null && (
                    <>
                        <Box sx={{display:"flex", flexDirection:"row"}}>
                            <img src='https://static.vecteezy.com/system/resources/previews/020/975/567/non_2x/visa-logo-visa-icon-transparent-free-png.png'
                            alt='' style={{height:"70px", marginRight:"100px"}}/>
                            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png'
                            alt='' style={{height:"70px", marginRight:"100px"}}/>
                            <img src='https://1000logos.net/wp-content/uploads/2021/05/Discover-logo.png'
                            alt='' style={{height:"70px", marginRight:"100px"}}/>
                            <img src='https://1000logos.net/wp-content/uploads/2016/10/American-Express-logo.png'
                            alt='' style={{height:"70px", marginRight:"100px"}}/>
                        </Box>
                        <Box sx={{height:"60%", width:"100%"}}>
                            <Elements stripe={stripePromise}>
                            <Box>
                                <StripePaymentForm productos={productos} conteoCarritoCompra={conteoCarritoCompra} idUsuario={idUsuario} setProductos={setProductos}
                                setConteoCarritoCompra={setConteoCarritoCompra} setMostrarMetodoPago={setMostrarMetodoPago} setMostrarProductos={setMostrarProductos}
                                opcion={1} />
                            </Box>
                            </Elements>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    </Box>
  )
}
