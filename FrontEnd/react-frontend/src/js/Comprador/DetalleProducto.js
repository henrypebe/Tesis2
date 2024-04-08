import { Box, Button, Divider, Typography } from '@mui/material'
import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DetalleProducto({setMostrarDetalleProducto, setMostrarProductos, setMostrarMetodoPago,
    setMostrarOpcionCarrito, setMostrarCarrito, ProductoSeleccionado, conteoCarritoCompra, setConteoCarritoCompra, setProductos,
    productos}) {
    
        // console.log(ProductoSeleccionado);

    const handleChange = () =>{
        setMostrarDetalleProducto(false);
        setMostrarProductos(true);
    }

    const handleChangeMétodoPago = () =>{
        const nuevoProducto = {
            idProducto: ProductoSeleccionado.idProducto,
            nombreProducto: ProductoSeleccionado.nombre,
            tipoProducto: ProductoSeleccionado.tipoProducto,
            precio: ProductoSeleccionado.precio,
            cantidad: 1,
            imagen: ProductoSeleccionado.imagen,
            stockMaximo: ProductoSeleccionado.stock,
            idTienda: ProductoSeleccionado.idTienda,
            fechaEnvio: ProductoSeleccionado.fechaEnvio
        };

        setProductos([...productos, nuevoProducto]);
        setMostrarDetalleProducto(false);
        setMostrarProductos(false);
        setMostrarMetodoPago(true);
        setConteoCarritoCompra(conteoCarritoCompra+1);
    }

    const handleChangeCarrito = () =>{
        setMostrarDetalleProducto(false);
        setMostrarProductos(false);
        setMostrarOpcionCarrito(2);
        setMostrarCarrito(true);
    }

    const handleAgregarCarritoCompra = () =>{
        const idProducto = ProductoSeleccionado.idProducto;
        const stockDisponible = ProductoSeleccionado.stock;

        if (productos.find(producto => producto.idProducto === idProducto)?.cantidad >= stockDisponible) {
            toast.error("¡Ya no hay stock disponible para este producto!");
            return;
        }

        const productoExistente = productos.find(producto => producto.idProducto === idProducto);

        if (productoExistente) {
            const productosActualizados = productos.map(producto => {
                if (producto.idProducto === idProducto) {
                    return { ...producto, cantidad: producto.cantidad + 1 };
                }
                return producto;
            });

            setProductos(productosActualizados);
        } else {
            const nuevoProducto = {
                idProducto: ProductoSeleccionado.idProducto,
                nombreProducto: ProductoSeleccionado.nombre,
                tipoProducto: ProductoSeleccionado.tipoProducto,
                precio: ProductoSeleccionado.precio,
                cantidad: 1,
                imagen: ProductoSeleccionado.imagen,
                stockMaximo: ProductoSeleccionado.stock,
                idTienda: ProductoSeleccionado.idTienda,
                fechaEnvio: ProductoSeleccionado.fechaEnvio
            };

            setProductos([...productos, nuevoProducto]);
        }

        setConteoCarritoCompra(conteoCarritoCompra+1);
    }
  
    return (
    <Box sx={{padding:"20px", width:"85.3%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
        <Box sx={{display:"flex", flexDirection:"row"}}>
            
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"30px", width:"90%"}}>Detalle de producto</Typography>
            
            <Button variant="contained" sx={{backgroundColor:"white", color: "black", border:"2px solid black", borderRadius:"5px", padding:"8px",
                width:"9%", height:"50px", marginRight:"10px",
                '&:hover': {backgroundColor:"white"}}}
                onClick={handleChangeCarrito}
                >
                <ShoppingCartIcon sx={{fontSize:"34px", marginRight:"12px"}}/>
                <Typography sx={{fontWeight:"bold", fontSize:"30px"}}>{conteoCarritoCompra}</Typography>
            </Button>

            <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
                fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleChange}>
                Atrás
            </Button>

        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{display:"flex", flexDirection:"row", border:"2px solid black", borderRadius:"10px", padding:"5px", alignItems:"center"}}>
            {ProductoSeleccionado.tiendaFoto?
            (
                <img src={ProductoSeleccionado.tiendaFoto} alt="Descripción de la imagen tienda"
                style={{height:"70px", borderRadius:"12px", marginLeft:"20px", width:"10%"}}
                />
            ):
            (
                <Box sx={{width:"10%"}}></Box>
            )}
            <Typography sx={{fontWeight:"bold", fontSize:"35px", width:"80%", marginLeft:"10px", textAlign:"center"}}>
                {ProductoSeleccionado.tiendaNombre}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", padding:"5px", justifyContent:"center", height:"220px", marginTop:"10px"}}>
            <Box sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <img src={ProductoSeleccionado.imagen} alt="Descripción de la imagen" 
                style={{height:"200px"}}
                />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", height: "auto", marginRight:"20px", marginLeft:"20px", border:"2px solid black"}} />
            <Box sx={{marginLeft:"40px", border:"2px solid #D1D0D0", width:"40%", padding:"5px", borderRadius:"12px", backgroundColor:"#D1D0D0"}}>
                <Typography sx={{fontWeight:"bold", fontSize:"33px", width:"100%", marginLeft:"10px", textAlign:"center", marginTop:"0px"}}>
                    {ProductoSeleccionado.nombre}
                </Typography>
                {ProductoSeleccionado.cantidadOferta > 0 ?
                (
                    <Box sx={{display:"flex", flexDirection:"row", justifyContent:"center", height:"40px", alignItems:"center"}}>
                        <Typography sx={{fontWeight:"bold", fontSize:"28px", width:"30%", marginLeft:"10px", textAlign:"center", marginTop:"0px",
                            textDecoration: "line-through"}}>
                            S/.{ProductoSeleccionado.precio.toFixed(2)}
                        </Typography>
                        <Typography sx={{borderRadius:"5px", padding:"5px", border:"2px solid red", color:"red", fontSize:"14px", fontWeight:"bold"}}>
                            {ProductoSeleccionado.cantidadOferta}% OFF
                        </Typography>
                    </Box>
                ):""}
                
                <Typography sx={{fontWeight:"bold", fontSize:"28px", width:"100%", marginLeft:"10px", justifyContent:"center", marginTop:"5px",
                    height:ProductoSeleccionado.cantidadOferta>0?"20%":"30%", display:"flex", alignItems:"center"}}>
                    S/.{ProductoSeleccionado.cantidadOferta > 0? 
                    ProductoSeleccionado.precio - (ProductoSeleccionado.precio * ProductoSeleccionado.cantidadOferta/100).toFixed(2):
                    ProductoSeleccionado.precio.toFixed(2)}
                </Typography>
                <Typography sx={{fontWeight:"bold", fontSize:"20px", width:"100%", marginLeft:"10px", textAlign:"center", marginTop:"5px", color:"#026700"}}>
                    <b>Costo de envío: S/.{ProductoSeleccionado.costoEnvio.toFixed(2)} - Tiempo de envío: {ProductoSeleccionado.fechaEnvio}</b>
                </Typography>
                <Typography sx={{fontWeight:"bold", fontSize:"20px", width:"100%", marginLeft:"10px", textAlign:"center", marginTop:"2px", color:"#026700"}}>
                    <b>Tiempo de garantía: {ProductoSeleccionado.cantidadGarantia}</b>
                </Typography>
            </Box>
        </Box>

        <Box sx={{marginBottom:"10px", height:"40%"}}>
            <Typography sx={{fontWeight:"bold", fontSize:"24px", width:"30%", marginTop:"0px"}}>
                Descripción
            </Typography>
            <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />
            <Typography variant="h6" sx={{ fontSize: "20px", width: "98%", marginTop: "0px", paddingLeft: "20px", height:"82%" }}>
                {/* &bull; Marca: Lux Waller */}
                {ProductoSeleccionado.descripcion? ProductoSeleccionado.descripcion:"No tiene descripción"}
            </Typography>
        </Box>

        <Box sx={{display:"flex", flexDirection:"row", width:"100%", justifyContent:"space-between", marginTop:"20px"}}>
            <Button variant="contained" sx={{backgroundColor:"#1C2536", width:"50%", marginRight:"20px",'&:hover': {backgroundColor:"#1C2536"}}}
            onClick={handleAgregarCarritoCompra}
            >
                Agregar al carrito de compra
            </Button>

            <Button variant="contained" color="success" sx={{width:"50%"}} onClick={handleChangeMétodoPago}>
                Pagar ahora
            </Button>
        </Box>
    </Box>
  )
}
