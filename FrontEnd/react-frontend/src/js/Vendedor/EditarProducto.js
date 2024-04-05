import { Box, Button, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditarProducto({setMostrarMisProductos, setMostrarEditarProducto, opcionEditarProducto, informacionTienda, productoInformacion}) {
    const [NombreProducto, setNombreProducto] = React.useState(opcionEditarProducto === 0?productoInformacion.nombre:'');
    const [TipoProducto, setTipoProducto] = React.useState(opcionEditarProducto === 0?productoInformacion.tipoProducto:'');
    const [PrecioProducto, setPrecioProducto] = React.useState(opcionEditarProducto === 0?productoInformacion.precio:'');
    const [CantidadProducto, setCantidadProducto] = React.useState(opcionEditarProducto === 0?productoInformacion.stock:'');
    const componentes = productoInformacion.cantidadGarantia.split("_");
    const [TiempoGarantiaNum, setTiempoGarantiaNum] = React.useState(opcionEditarProducto === 0?parseInt(componentes[0]):'');
    const [TiempoGarantia, setTiempoGarantia] = React.useState(opcionEditarProducto === 0?componentes[1]:'');
    const [Oferta, setOferta] = React.useState(opcionEditarProducto === 0?productoInformacion.cantidadOferta:'');
    const [Descripcion, setDescripcion] = React.useState(opcionEditarProducto === 0?productoInformacion.descripcion:'');
    
    const [image, setImage] = React.useState(null);
    const [isImageUploaded, setIsImageUploaded] = React.useState(productoInformacion.imagen !== "");
    const [previewImage, setPreviewImage] = React.useState(opcionEditarProducto === 0?productoInformacion.imagen:'');

    const handleChange = () =>{
        setMostrarMisProductos(true);
        setMostrarEditarProducto(false);
    }
    const handleChangeTipo = (event) => {
        setTipoProducto(event.target.value);
    };
    const handleChangeTiempo = (event) => {
        setTiempoGarantia(event.target.value);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
            setIsImageUploaded(true);
            setImage(file);
        } else {
            toast.error('Por favor, seleccione un archivo de imagen válido (png, jpg).');
        }
    };  

    const handleCancel = () => {
        setPreviewImage(null);
        setImage(null);
        setIsImageUploaded(false);
    };

    const handleSubirProducto = async () =>{
        const cantidadGarantiaTotal = TiempoGarantiaNum.toString() + "_" + TiempoGarantia.toString();
        const nombreParam = NombreProducto.replace(/ /g, '_');
        const descripcionParam = Descripcion.replace(/ /g, '_');
        if(opcionEditarProducto !== 1){
            try {
                const formData = new FormData();
                formData.append('idProducto', productoInformacion.idProducto);
                formData.append('nombre', nombreParam);
                formData.append('precio', PrecioProducto);
                formData.append('cantidad', CantidadProducto);
                if(image){
                    formData.append('image', image);
                }else{
                    const blob = await fetch(productoInformacion.imagen).then(response => response.blob());
                    const file = new File([blob], 'product_image.jpg', { type: 'image/jpeg' });
                    formData.append('image', file);
                }
                formData.append('descripcion', descripcionParam);
                formData.append('cantidadOferta', Oferta);
                formData.append('cantidadGarantia', cantidadGarantiaTotal);
                formData.append('tipoProducto', TipoProducto);

                const response = await fetch(
                  `https://localhost:7240/EditarProducto`,
                  {
                    method: "PUT",
                    body: formData
                  }
                );
          
                if (response.ok) {
                    toast.success('Producto editado correctamente', { autoClose: 2000 });
                    handleChange();
                } else if (response.status === 404) {
                  throw new Error("Producto no encontrado");
                } else {
                  throw new Error("Error al Editar el producto");
                }
              } catch (error) {
                console.error("Error al Editar el producto", error);
                throw new Error("Error al Editar el producto");
              }
        }else{
            try{
                const formData = new FormData();
                formData.append('nombre', nombreParam);
                formData.append('precio', PrecioProducto);
                formData.append('cantidad', CantidadProducto);
                formData.append('image', image);
                formData.append('descripcion', descripcionParam);
                formData.append('cantidadOferta', Oferta);
                formData.append('cantidadGarantia', cantidadGarantiaTotal);
                formData.append('tipoProducto', TipoProducto);
                formData.append('idTienda', informacionTienda.idTienda);
                
                const response = await fetch(
                    `https://localhost:7240/CreateProducto`,
                    {
                        method: "POST",
                        body: formData
                    }
                );
        
                if (response.ok) {
                    toast.success('Producto editado correctamente', { autoClose: 2000 });
                    handleChange();
                } else if (response.status === 404) {
                    throw new Error("Producto no encontrado");
                } else {
                    throw new Error("Error al Agregar el producto");
                }
                // console.log(formData);
            } catch (error) {
              console.error("Error al Agregar el producto", error);
              throw new Error("Error al Agregar el producto");
            }
            // console.log(image);
        }
    }

    return (
    <Box sx={{padding:"20px", width:"85.1%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
            
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"26px", marginRight:"200px"}}>
                {opcionEditarProducto!==1?"Editar Producto":"Nuevo Producto"}
            </Typography>

            <Box sx={{display:"flex", flexDirection:"row"}}>
                <Button variant="contained" sx={{backgroundColor:"#1C2536", color:"white", border:"2px solid black", width:"250px", fontSize:"17px",
                    fontWeight:"bold", marginRight:"10px", '&:hover':{backgroundColor:"#1C2536"}}} onClick={handleSubirProducto}>
                    Solicitar publicación
                </Button>
                <Button variant="contained" sx={{backgroundColor:"white", color:"black", border:"2px solid black", width:"150px", fontSize:"17px",
                    fontWeight:"bold", '&:hover':{backgroundColor:"white"}}} onClick={handleChange}>
                    Atrás
                </Button>
            </Box>

        </Box>

        <hr style={{margin: "10px 0", border: "0", borderTop: "2px solid #ccc", marginTop:"10px", marginBottom:"15px"}} />

        <Box sx={{border:"2px solid black", borderRadius:"6px", display:"flex", flexDirection:"column", padding:"10px", height:"40%"}}>
            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", marginBottom:"10px"}}>
                <Typography
                    sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "24px",
                    width: "90%",
                    }}
                >
                    Detalles generales del producto:
                </Typography>
            </Box>

            <Box sx={{display:"flex", flexDirection:"row", height:"100%"}}>
                <Box sx={{display:"flex", flexDirection:"column", marginRight:"20px"}}>
                    <Box sx={{height:"70%", border:"2px solid black", width:"200px"}}>
                        {previewImage && <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </Box>
                    <Box sx={{ width: '200px', display: 'flex', justifyContent: 'center', marginTop: '5px'}}>
                        {isImageUploaded ? (
                            <Button
                                variant="contained"
                                sx={{
                                backgroundColor: '#FF0000',
                                color: 'white',
                                width: '60%',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#FF0000' }
                                }}
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Button>
                            ) : (
                            <>
                                <label htmlFor="upload-button">
                                <Button
                                    variant="contained"
                                    component="span"
                                    sx={{
                                    backgroundColor: '#1C2536',
                                    color: 'white',
                                    width: '100%',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    marginRight: '10px',
                                    '&:hover': { backgroundColor: '#1C2536' }
                                    }}
                                >
                                    Subir foto
                                </Button>
                                </label>
                                <input
                                type="file"
                                id="upload-button"
                                accept="image/png, image/jpeg"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                                />
                            </>
                        )}
                    </Box>
                </Box>
                <Box sx={{display:"flex", flexDirection:"column", width:"50%"}}>
                    <Box sx={{display:"flex", flexDirection:"row", width:"100%", justifyContent:"space-between"}}>
                        <Box sx={{display:"flex", flexDirection:"column", marginRight:"20px", width:"50%"}}>
                            <Typography
                                sx={{
                                color: "black",
                                fontSize: "24px",
                                width: "90%",
                                }}
                            >
                                Nombre:
                            </Typography>
                            <TextField
                                sx={{
                                    height: 40,
                                    '& .MuiInputBase-root': {
                                    height: '100%',
                                    },
                                }}
                                defaultValue={NombreProducto}
                                onChange={(e) => setNombreProducto(e.target.value)}
                            />
                        </Box>

                        <Box sx={{display:"flex", flexDirection:"column", width:"50%"}}>
                            <Typography
                                sx={{
                                color: "black",
                                fontSize: "24px",
                                width: "100%",
                                }}
                            >
                                Tipo de producto:
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={TipoProducto}
                                    label=""
                                    onChange={handleChangeTipo}
                                    sx={{height:"40px"}}
                                >
                                    <MenuItem value={"Electrodomesticos"}>Electrodomesticos</MenuItem>
                                    <MenuItem value={"Vestimenta"}>Vestimenta</MenuItem>
                                    <MenuItem value={"Muebles"}>Muebles</MenuItem>
                                    <MenuItem value={"Limpieza"}>Limpieza</MenuItem>
                                    <MenuItem value={"Tecnologia"}>Tecnologia</MenuItem>
                                    <MenuItem value={"Libros/Articulos"}>Libros/Articulos</MenuItem>
                                    <MenuItem value={"Herramientas"}>Herramientas</MenuItem>
                                    <MenuItem value={"Belleza/Salud"}>Belleza/Salud</MenuItem>
                                    <MenuItem value={"Joyeria/Accesorios"}>Joyeria/Accesorios</MenuItem>
                                    <MenuItem value={"Decoracion"}>Decoracion</MenuItem>
                                    <MenuItem value={"Juguetes"}>Juguetes</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", width:"100%", justifyContent:"space-between", marginBottom:"10px"}}>
                        <Box sx={{display:"flex", flexDirection:"column", marginRight:"20px", width:"50%"}}>
                            <Typography
                                sx={{
                                color: "black",
                                fontSize: "24px",
                                width: "90%",
                                }}
                            >
                                Precio:
                            </Typography>
                            <TextField
                                sx={{
                                    height: 40,
                                    '& .MuiInputBase-root': {
                                    height: '100%',
                                    },
                                }}
                                defaultValue={`S/. ${PrecioProducto}`}
                                onChange={(e) => setPrecioProducto(e.target.value.replace('S/. ', ''))}
                            />
                        </Box>

                        <Box sx={{display:"flex", flexDirection:"column", width:"50%"}}>
                            <Typography
                                sx={{
                                color: "black",
                                fontSize: "24px",
                                width: "100%",
                                }}
                            >
                                Cantidad:
                            </Typography>
                            <TextField
                                sx={{
                                    height: 40,
                                    '& .MuiInputBase-root': {
                                    height: '100%',
                                    },
                                }}
                                defaultValue={CantidadProducto}
                                onChange={(e) => setCantidadProducto(e.target.value)}
                            />
                        </Box>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", width:"100%", justifyContent:"space-between"}}>
                        <Box sx={{display:"flex", flexDirection:"column", marginRight:"20px", width:"50%"}}>
                            <Typography
                                sx={{
                                color: "black",
                                fontSize: "24px",
                                width: "90%",
                                }}
                            >
                                Tiempo de Garantía:
                            </Typography>
                            <Box sx={{display:"flex", flexDirection:"row"}}>
                                <TextField
                                    sx={{
                                        height: 40, marginRight:"10px",
                                        '& .MuiInputBase-root': {
                                        height: '100%',
                                        },
                                    }}
                                    defaultValue={TiempoGarantiaNum}
                                    onChange={(e) => setTiempoGarantiaNum(e.target.value)}
                                />

                                <FormControl fullWidth>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={TiempoGarantia}
                                        label=""
                                        onChange={handleChangeTiempo}
                                        sx={{height:"40px"}}
                                    >
                                        <MenuItem value={"Días"}>Días</MenuItem>
                                        <MenuItem value={"Meses"}>Meses</MenuItem>
                                        <MenuItem value={"Años"}>Años</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        <Box sx={{display:"flex", flexDirection:"column", width:"50%"}}>
                            <Typography
                                sx={{
                                color: "black",
                                fontSize: "24px",
                                width: "100%",
                                }}
                            >
                                Oferta:
                            </Typography>
                            <Box sx={{display:"flex", flexDirection:"row"}}>
                                <TextField
                                    sx={{
                                        height: 40, width:"80%",
                                        '& .MuiInputBase-root': {
                                        height: '100%',
                                        },
                                    }}
                                    defaultValue={Oferta}
                                    onChange={(e) => setOferta(e.target.value)}
                                />
                                <TextField
                                    sx={{
                                        height: 40, width:"20%",
                                        '& .MuiInputBase-root': {
                                        height: '100%',
                                        },
                                    }}
                                    defaultValue={'%'}
                                    disabled={true}
                                />
                            </Box>
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Box>

        <Box sx={{border:"2px solid black", borderRadius:"6px", display:"flex", flexDirection:"column", padding:"10px", height:"40%", marginTop:"15px"}}>
            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", marginBottom:"10px"}}>
                <Typography
                    sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "24px",
                    width: "90%",
                    }}
                >
                    Descripción del producto:
                </Typography>
            </Box>
            <TextField
                multiline
                rows={8}
                sx={{
                    width: '100%'
                }}
                defaultValue={Descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />
        </Box>

    </Box>
  )
}
