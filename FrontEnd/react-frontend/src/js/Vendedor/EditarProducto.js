import { Box, Button, Checkbox, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

export default function EditarProducto({setMostrarMisProductos, setMostrarEditarProducto, opcionEditarProducto}) {
    const [tipoProducto, setTipoProducto] = React.useState('');
    const [isTextFieldEnabled, setIsTextFieldEnabled] = useState(false);
    const handleChange = () =>{
        setMostrarMisProductos(true);
        setMostrarEditarProducto(false);
    }
    const handleChangeTipo = (event) => {
        setTipoProducto(event.target.value);
    };
    const handleCheckboxChange = (event) => {
        setIsTextFieldEnabled(event.target.checked);
    };
    return (
    <Box sx={{padding:"20px", width:"85.1%", marginTop:"-1.9px", minHeight:"84vh", maxHeight:"auto"}}>
        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
            
            <Typography sx={{color:"black", fontWeight:"bold", fontSize:"26px", marginRight:"200px"}}>
                {opcionEditarProducto!==1?"Editar Producto":"Nuevo Producto"}
            </Typography>

            <Box sx={{display:"flex", flexDirection:"row"}}>
                <Button variant="contained" sx={{backgroundColor:"#1C2536", color:"white", border:"2px solid black", width:"250px", fontSize:"17px",
                    fontWeight:"bold", marginRight:"10px", '&:hover':{backgroundColor:"#1C2536"}}} onClick={handleChange}>
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
                        
                    </Box>
                    <Box sx={{width:"200px", display:"flex", justifyContent:"center", marginTop:"5px"}}>
                        <Button variant="contained" sx={{backgroundColor:"#1C2536", color:"white", width:"60%", fontSize:"14px",
                            fontWeight:"bold", marginRight:"10px", '&:hover':{backgroundColor:"#1C2536"}}}>
                            Subir foto
                        </Button>
                    </Box>
                </Box>
                <Box sx={{display:"flex", flexDirection:"column", width:"45%"}}>
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
                                    value={tipoProducto}
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
                            />
                        </Box>
                    </Box>

                    <Box sx={{display:"flex", flexDirection:"row", width:"100%", alignItems:"center"}}>
                        <Checkbox 
                            onChange={handleCheckboxChange}
                            checked={isTextFieldEnabled}
                        />

                        <Typography sx={{color:"black", fontSize:"20px", marginRight:"20px"}}>Oferta</Typography>

                        <TextField
                            disabled={!isTextFieldEnabled}
                            sx={{
                                height: 40,
                                '& .MuiInputBase-root': {
                                height: '100%',
                                },
                            }}
                        />
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
            />
        </Box>

    </Box>
  )
}
