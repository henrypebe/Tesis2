import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {
  Button,
  IconButton,
  Link,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SHA256 } from "crypto-js";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

export default function BarraSuperior({ opcionAdministrador, idUsuario, esVendedorAdministrador }) {
  const [open, setOpen] = React.useState(false);
  const [openModalCuarto, setOpenModaCuarto] = React.useState(false);
  const [openModalQuinto, setOpenModaQuinto] = React.useState(false);

  const [informacionUsuario, setInformacionUsuario] = useState();
  const [informacionTienda, setInformacionTienda] = useState();
  const [loading, setLoading] = React.useState(true);

  const handleOpen = () => {setOpen(true); obtenerRolesIdUsuario(idUsuario);};
  const handleClose = () => {setOpen(false);};

  // const handleOpenModalCuarto = () => {
  //   setOpenModaCuarto(true);
  //   setOpen(false);
  // };
  const handleCloseModalCuarto = () => {
    setOpenModaCuarto(false);
    setOpen(true);
  };

  const handleOpenModalQuinto = () => {
    obtenerInformacionTienda();
  };
  const handleCloseModalQuinto = () => {
    setOpenModaQuinto(false);
    setOpen(true);
    handleCancelTienda();
  };

  const obtenerRolesIdUsuario = async (idUsuario) => {
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
        const usuario = await response.json();
        console.log(usuario);
        setInformacionUsuario(usuario);
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else {
        throw new Error("Error al obtener la informacion del usuario");
      }
    } catch (error) {
      console.error("Error al obtener la informacion del usuario:", error);
      throw new Error("Error al obtener la informacion del usuario");
    }
  };

  const obtenerInformacionTienda = async () => {
    try {
      const response = await fetch(
        `https://localhost:7240/InformacionTienda?idUsuario=${idUsuario}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const tienda = await response.json();
        // console.log(tienda);
        setInformacionTienda(tienda);
        setTimeout(() => {
          setOpenModaQuinto(true);
          setOpen(false);
        }, 100);
      } else if (response.status === 404) {
        throw new Error("Tienda no encontrado");
      } else {
        throw new Error("Error al obtener informacion de la tienda");
      }
    } catch (error) {
      console.error("Error al obtener informacion de la tienda", error);
      throw new Error("Error al obtener informacion de la tienda");
    }
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        const usuario = obtenerRolesIdUsuario(idUsuario);
        setInformacionUsuario(usuario);
        // console.log(usuario);
      } catch (error) {
        console.error("Error al obtener el usuario:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idUsuario]);

  useEffect(() => {
    if (informacionUsuario) {
      setNombreCambiado(informacionUsuario.nombre ?? "");
      setApellidoCambiado(informacionUsuario.apellido ?? "");
      setCorreoCambiado(informacionUsuario.correo ?? "");
      setCorreoAlternativoCambiado(informacionUsuario.correoAlternativo ?? "");
      setTelefonoCambiado(informacionUsuario.telefono ?? "");
      setDireccionCambiado(informacionUsuario.direccion ?? "");
    }
    if (informacionTienda) {
      setNombreTiendaCambiado(informacionTienda.nombre ?? "");
      setDescripcionTiendaCambiado(informacionTienda.descripcion ?? "");
      setDireccionTiendaCambiado(informacionTienda.direccion ?? "");
      setProvinciaTiendaCambiado(informacionTienda.provincia ?? "");
      setPaisTiendaCambiado(informacionTienda.pais ?? "");
      setPreviewImageTienda(informacionTienda.foto ?? "");
      setIsImageUploadedTienda(informacionTienda.foto);
    }
  }, [informacionUsuario, informacionTienda]);

  const [nombreCambiado, setNombreCambiado] = useState("");
  const [apellidoCambiado, setApellidoCambiado] = useState("");
  const [correoCambiado, setCorreoCambiado] = useState("");
  const [correoAlternativoCambiado, setCorreoAlternativoCambiado] = useState("");
  const [TelefonoCambiado, setTelefonoCambiado] = useState("");
  const [DireccionCambiado, setDireccionCambiado] = useState("");

  const [nombretTiendaCambiado, setNombreTiendaCambiado] = useState("");
  const [DescripcionTiendaCambiado, setDescripcionTiendaCambiado] = useState("");
  const [DireccionTiendaCambiado, setDireccionTiendaCambiado] = useState("");
  const [ProvinciaTiendaCambiado, setProvinciaTiendaCambiado] = useState("");
  const [PaisTiendaCambiado, setPaisTiendaCambiado] = useState("");
  
  const [ValorBloqueoContrasenha, setValorBloqueoContrasenha] = useState(true);

  // const [verificarContrasenha, setVerificarContrasenha] = useState("");
  // const [verificarToken, setVerificarToken] = useState("");

  const [imageTienda, setImageTienda] = React.useState(null);
  const [isImageUploadedTienda, setIsImageUploadedTienda] = React.useState("");
  const [previewImageTienda, setPreviewImageTienda] = React.useState("");
  
  const handleImageUploadTienda = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            setPreviewImageTienda(e.target.result);
        };
        reader.readAsDataURL(file);
        setIsImageUploadedTienda(true);
        setImageTienda(file);
    } else {
        toast.error('Por favor, seleccione un archivo de imagen válido (png, jpg).');
    }
  };
  const handleCancelTienda = () => {
      if(informacionTienda.foto !== "")setPreviewImageTienda(null);
      setImageTienda(null);
      if(informacionTienda.foto !== "")setIsImageUploadedTienda(false);
  };

  // const [token, setToken] = useState("");

  const [contrasenha, setContrasenha] = useState("");

  const [verificarTokenEliminar, setVerificarTokenEliminar] = useState("");
  const [verificarContrasenhaEliminar, setVerificarContrasenhaEliminar] =
    useState("");

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
    height: informacionUsuario && informacionUsuario.esVendedor ? "85%" : "79%",
  };
  const styleCuarto = {
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
    height: "43%",
  };
  const styleQuinto = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    padding: "10px",
    borderRadius: "8px",
    height: "79%",
  };

  const handleChangeCerrarSesion = () => {
    localStorage.removeItem("isLoggedInComprador");
    localStorage.removeItem("isLoggedInAdministrador");
    localStorage.removeItem("isLoggedInVendedor");
    window.location.href = "/Login";
  };

  const handleChangeEliminarUsuario = async() =>{
    
    if(informacionUsuario.esVendedor){
      const response = await fetch(
        `https://localhost:7240/EliminarCuentaVendedor?idUsuario=${informacionUsuario.idUsuario}&esAdministrador=${informacionUsuario.esVendedorAdministrador}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.ok) {
        toast.success("Usuario eliminado con éxito", { autoClose: 2000 });
        localStorage.removeItem("isLoggedInComprador");
        localStorage.removeItem("isLoggedInAdministrador");
        localStorage.removeItem("isLoggedInVendedor");
        window.location.href = "/Login";
      }
    }else{
      const response = await fetch(
        `https://localhost:7240/EliminarCuentaComprador?idUsuario=${informacionUsuario.idUsuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.ok) {
        toast.success("Usuario eliminado con éxito", { autoClose: 2000 });
        localStorage.removeItem("isLoggedInComprador");
        localStorage.removeItem("isLoggedInAdministrador");
        localStorage.removeItem("isLoggedInVendedor");
        window.location.href = "/Login";
      }
    }
  }

  const handleCambioContrasenha = () => {
    if (contrasenha !== "") {
      setValorBloqueoContrasenha(!ValorBloqueoContrasenha);
    } else {
      toast.error("Debe poder visualizar primero la contraseña.");
    }
  };

  const handleChangeContrasenha = async () => {
    try {
      const hashedPassword = SHA256(contrasenha).toString();
      const response = await fetch(
        `https://localhost:7240/EditarContrasenha?idUsuario=${idUsuario}&contrasenha=${hashedPassword}&ContrasenhaVariado=${contrasenha}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Contrasenha modificada con éxito", { autoClose: 2000 });
        setValorBloqueoContrasenha(!ValorBloqueoContrasenha);
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else {
        throw new Error("Error al cambiar la contrasenha");
      }
    } catch (error) {
      console.error("Error al cambiar la contrasenha", error);
      throw new Error("Error al cambiar la contrasenha");
    }
  };

  const handleCambioDatos = async () => {
    try {
      const formData = new FormData();
      formData.append('IdUsuario', idUsuario);
      formData.append('nombre', nombreCambiado);
      formData.append('apellido', apellidoCambiado);
      formData.append('correo', correoCambiado);
      formData.append('numero', TelefonoCambiado);
      formData.append('direccion', DireccionCambiado);
      formData.append('correoAlternativo', correoAlternativoCambiado===""? "a": correoAlternativoCambiado);

      const response = await fetch(
        `https://localhost:7240/EditarUsuario`,
        {
          method: "PUT",
          body: formData
        }
      );

      if (response.ok) {
        toast.success("Información modificada con éxito", { autoClose: 2000 });
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else {
        throw new Error("Error al editar los datos de usuarios");
      }
    } catch (error) {
      console.error("Error al editar los datos de usuarios", error);
      throw new Error("Error al editar los datos de usuarios");
    }
  };

  const handleChangeEliminarCuenta = async () => {
    try {
      const response = await fetch(
        `https://localhost:7240/CambiarEstadoUsuario?idUsuario=${idUsuario}&contrasenha=${verificarContrasenhaEliminar}&token=${verificarTokenEliminar}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        toast.success("Cuenta Eliminada", { autoClose: 2000 });
        localStorage.removeItem("isLoggedInComprador");
        localStorage.removeItem("isLoggedInAdministrador");
        localStorage.removeItem("isLoggedInVendedor");
        window.location.href = "/Login";
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else {
        throw new Error("Error al eliminar cuenta");
      }
    } catch (error) {
      console.error("Error al eliminar cuenta", error);
      throw new Error("Error al eliminar cuenta");
    }
  };

  const handleVerificarToken = async () => {
    try {
      const response = await fetch(
        `https://localhost:7240/VerificarToken?idUsuario=${idUsuario}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const _contrasenha = await response.text();
        toast.success("Se puede visualizar la contraseña", { autoClose: 2000 });
        setContrasenha(_contrasenha);
        handleClose();
        setTimeout(() => {
          handleOpen();
        }, 10);
        setTimeout(() => {
          setContrasenha("");
          handleClose();
          setTimeout(() => {
            handleOpen();
          }, 10);
        }, 15000);
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else {
        throw new Error("Error al obtener la contrasenha");
      }
    } catch (error) {
      console.error("Error al ingresar a la api", error);
      throw new Error("Error al ingresar a la api");
    }
  };

  const handleEditarTienda = async () =>{
    try {
      const descripcionSinEspacios = DescripcionTiendaCambiado.replace(/ /g, '_');
      const direccionParam = DireccionTiendaCambiado.replace(/ /g, '_');
      const ProvinciaParam = ProvinciaTiendaCambiado.replace(/ /g, '_');

      const formData = new FormData();
      formData.append('idTienda', informacionTienda.idTienda);
      formData.append('nombre', nombretTiendaCambiado);
      if(imageTienda){
        formData.append('image', imageTienda);
      }else{
          const blob = await fetch(informacionTienda.foto).then(response => response.blob());
          const file = new File([blob], 'product_image.jpg', { type: 'image/jpeg' });
          formData.append('image', file);
      }
      formData.append('descripcion', descripcionSinEspacios);
      formData.append('direccion', direccionParam);
      formData.append('Provincia', ProvinciaParam);
      formData.append('pais', PaisTiendaCambiado);

      const response = await fetch(
        `https://localhost:7240/EditarTienda`,
        {
          method: "PUT",
          body: formData
        }
      );

      if (response.ok) {
        toast.success("Se editó correctamente la información de la tienda", { autoClose: 2000 });
        handleCloseModalQuinto();
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else {
        throw new Error("Error al editar tienda");
      }
    } catch (error) {
      console.error("Error al editar tienda", error);
      throw new Error("Error al editar tienda");
    }
  }

  return loading ? (
    <></>
  ) : (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#CC984B",
          height: "43px",
          alignItems: "center",
          padding: "10px",
          border: "2px solid white",
          alignContent: "center",
          marginLeft: "-1.9px",
          marginRight: "-1.9px",
          width: "98.8%",
        }}
      >
        <MenuBookIcon sx={{ color: "black", marginRight: "20px", fontSize:"30px" }} />
        <Typography sx={{ color: "black", width: "200%", fontWeight:"bold", fontSize:"25px"}}>
          Tesis 2 - ¡Bienvenido{" "}
          {informacionUsuario && informacionUsuario.nombre
            ? informacionUsuario.nombre
            : ""}{" "}
          {informacionUsuario && informacionUsuario.apellido
            ? informacionUsuario.apellido
            : ""}
          !
        </Typography>
        {opcionAdministrador ? (
          <Box
            sx={{
              width: "40%",
              height: "95%",
              border: "2px solid #FFFFFF",
              marginTop: "0px",
              borderRadius: "6px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "black",
                width: "200%",
                fontSize: "25px",
                fontWeight: "bold",
              }}
            >
              Administrador
            </Typography>
          </Box>
        ) : informacionUsuario && informacionUsuario.esComprador ? (
          <Box
            sx={{
              width: "40%",
              height: "80%",
              border: "2px solid #FFFFFF",
              marginTop: "0px",
              borderRadius: "6px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "black",
                width: "200%",
                fontSize: "25px",
                fontWeight: "bold",
              }}
            >
              Comprador
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              width: esVendedorAdministrador? "60%" : "45%",
              height: "80%",
              border: "2px solid #FFFFFF",
              marginTop: "0px",
              borderRadius: "6px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "black",
                width: "200%",
                fontSize: "25px",
                fontWeight: "bold",
              }}
            >
              {esVendedorAdministrador? "Vend. Administrador" : "Vend. Asistente"}
            </Typography>
          </Box>
        )}
        <Button
          variant="contained"
          sx={{
            width: "30%",
            marginLeft: "20px",
            backgroundColor: "white",
            color: "black",
            fontWeight: "bold",
            marginTop: "0px",
            fontSize: "20px",
            "&:hover": {
              backgroundColor: "white",
              color: "black",
              fontWeight: "bold",
            },
          }}
          onClick={handleOpen}
        >
          Perfil
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
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
                General
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
                onClick={handleClose}
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

            <Box sx={{ display: "flex", flexDirection: "column", height: informacionUsuario.esVendedor? "42%" : "45%"
            , marginBottom:"10px"}}>
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "24px",
                  width: "100%",
                  marginBottom: "10px",
                }}
              >
                Detalles
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    width:"100%"
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                      marginRight: "10px",
                    }}
                  >
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
                        fontSize: "25px",
                        "& .MuiInputBase-root": {
                          height: "100%",
                          fontSize: "25px",
                        },
                      }}
                      defaultValue={nombreCambiado}
                      onChange={(e) => setNombreCambiado(e.target.value)}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: "24px",
                        width: "90%",
                      }}
                    >
                      Apellido:
                    </Typography>
                    <TextField
                      sx={{
                        height: 40,
                        fontSize: "25px",
                        "& .MuiInputBase-root": {
                          height: "100%",
                          fontSize: "25px",
                        },
                      }}
                      defaultValue={apellidoCambiado}
                      onChange={(e) => setApellidoCambiado(e.target.value)}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                      marginRight:"10px"
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: "24px",
                        width: "90%",
                      }}
                    >
                      Correo electrónico:
                    </Typography>
                    <TextField
                      sx={{
                        height: 40,
                        fontSize: "25px",
                        "& .MuiInputBase-root": {
                          height: "100%",
                          fontSize: "25px",
                        },
                      }}
                      defaultValue={correoCambiado}
                      onChange={(e) => setCorreoCambiado(e.target.value)}
                      disabled={true}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: "24px",
                        width: "90%",
                      }}
                    >
                      Correo electrónico alternativo:
                    </Typography>
                    <TextField
                      sx={{
                        height: 40,
                        fontSize: "25px",
                        "& .MuiInputBase-root": {
                          height: "100%",
                          fontSize: "25px",
                        },
                      }}
                      defaultValue={correoAlternativoCambiado}
                      onChange={(e) => setCorreoAlternativoCambiado(e.target.value)}
                      disabled={informacionUsuario.correoAlternativo && informacionUsuario.correoAlternativo !== ""}
                    />
                    {!(informacionUsuario.correoAlternativo) && 
                    (
                      <Typography
                        sx={{
                          color: "#A4A4A4",
                          fontSize: "14px",
                          width: "100%",
                        }}
                      >
                        (*) No se podrá cambiar posteriormente el correo electrónico alternativo
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop:!(informacionUsuario.correoAlternativo)? "0px": "20px",
                    width:"100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                      marginRight: "10px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: "24px",
                        width: "90%",
                      }}
                    >
                      Número de teléfono:
                    </Typography>
                    <TextField
                      sx={{
                        height: 40,
                        fontSize: "25px",
                        "& .MuiInputBase-root": {
                          height: "100%",
                          fontSize: "25px",
                        },
                      }}
                      inputProps={{ maxLength: 9 }}
                      defaultValue={TelefonoCambiado}
                      onChange={(e) => setTelefonoCambiado(e.target.value)}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: "24px",
                        width: "90%",
                      }}
                    >
                      Dirección:
                    </Typography>
                    <TextField
                      sx={{
                        height: 40,
                        fontSize: "25px",
                        "& .MuiInputBase-root": {
                          height: "100%",
                          fontSize: "25px",
                        },
                      }}
                      defaultValue={DireccionCambiado}
                      onChange={(e) => setDireccionCambiado(e.target.value)}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box>
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  backgroundColor: "#1C2536",
                  fontSize: "20px",
                  "&:hover": { backgroundColor: "#1C2536" },
                }}
                onClick={handleCambioDatos}
              >
                Guardar cambios
              </Button>
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

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "24px",
                  width: "100%",
                }}
              >
                Seguridad
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "8px",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    fontSize: "24px",
                    width: "25%",
                  }}
                >
                  Contraseña:
                </Typography>
                <TextField
                  defaultValue={contrasenha}
                  disabled={ValorBloqueoContrasenha}
                  onChange={(e) => setContrasenha(e.target.value)}
                  sx={{
                    height: 40,
                    width: "60%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                  }}
                />

                {ValorBloqueoContrasenha ? (
                  <IconButton
                    sx={{ marginLeft: "10px", marginRight: "10px" }}
                    onClick={contrasenha === "" ? handleVerificarToken : null}
                    disabled={contrasenha !== ""}
                  >
                    <VisibilityIcon
                      sx={{
                        color: contrasenha !== "" ? "#C6C6C6" : "black",
                        fontSize: "35px",
                      }}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    sx={{ marginLeft: "10px", marginRight: "10px" }}
                    onClick={handleChangeContrasenha}
                  >
                    <SaveAltIcon sx={{ color: "black", fontSize: "35px" }} />
                  </IconButton>
                )}

                <Link
                  sx={{
                    fontSize: "18px",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  onClick={handleCambioContrasenha}
                >
                  {ValorBloqueoContrasenha ? "Modificar" : "Cancelar"}
                </Link>
              </Box>

              {informacionUsuario && informacionUsuario.esVendedor ? (
                <Button
                  variant="contained"
                  sx={{
                    width: "100%",
                    backgroundColor: "#1C2536",
                    marginTop: "10px",
                    fontSize: "20px",
                    "&:hover": { backgroundColor: "#1C2536" },
                  }}
                  onClick={handleOpenModalQuinto}
                  disabled={!informacionUsuario.esVendedorAdministrador}
                >
                  Editar Tienda
                </Button>
              ) : (
                <></>
              )}

              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  backgroundColor: "#C84C31",
                  marginTop: "10px",
                  fontSize: "20px",
                  "&:hover": { backgroundColor: "#C84C31" },
                }}
                onClick={handleChangeCerrarSesion}
              >
                Cerrar Sesión
              </Button>

              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  backgroundColor: "#FF7E62",
                  marginTop: "10px",
                  fontSize: "20px",
                  "&:hover": { backgroundColor: "#FF7E62" },
                }}
                onClick={handleChangeEliminarUsuario}
              >
                Eliminar cuenta
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={openModalCuarto}
          onClose={handleCloseModalCuarto}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...styleCuarto }}>
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
                Eliminar usuario
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
                onClick={handleCloseModalCuarto}
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
                marginBottom: "30px",
              }}
            />
            <TextField
              id="outlined-basic"
              label="Contraseña"
              variant="outlined"
              type="password"
              InputLabelProps={{
                style: {
                  fontSize: "27px",
                  marginTop: "3px",
                },
              }}
              onChange={(e) => setVerificarContrasenhaEliminar(e.target.value)}
              sx={{
                height: 80,
                width: "100%",
                fontSize: "30px",
                display: "flex",
                marginBottom: "20px",
                justifyContent: "center",
                "& .MuiInputBase-root": {
                  height: "100%",
                  fontSize: "30px",
                },
              }}
            />
            <TextField
              id="outlined-basic"
              label="Token"
              variant="outlined"
              InputLabelProps={{
                style: {
                  fontSize: "27px",
                  marginTop: "3px",
                },
              }}
              onChange={(e) => setVerificarTokenEliminar(e.target.value)}
              sx={{
                height: 80,
                width: "100%",
                fontSize: "30px",
                display: "flex",
                justifyContent: "center",
                "& .MuiInputBase-root": {
                  height: "100%",
                  fontSize: "30px",
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1C2536",
                marginTop: "25px",
                fontSize: "25px",
                height: "20%",
                width: "100%",
                "&:hover": { backgroundColor: "#1C2536" },
              }}
              onClick={handleChangeEliminarCuenta}
            >
              Confirmar
            </Button>
          </Box>
        </Modal>

        <Modal
          open={openModalQuinto}
          onClose={handleCloseModalQuinto}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...styleQuinto }}>
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
                Editar tienda
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
                onClick={handleCloseModalQuinto}
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                height: "39%",
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "30%" }}
              >
                <Box
                  sx={{
                    height: "78%",
                    backgroundColor: "#D9D9D9",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                >
                  {previewImageTienda && <img src={previewImageTienda} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </Box>
                <Box
                  sx={{
                    width: "98%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isImageUploadedTienda ? (
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
                        onClick={handleCancelTienda}
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
                        onChange={handleImageUploadTienda}
                      />
                    </>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "63%",
                  marginLeft: "15px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    marginRight: "10px",
                  }}
                >
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
                      fontSize: "25px",
                      "& .MuiInputBase-root": {
                        height: "100%",
                        fontSize: "25px",
                      },
                    }}
                    defaultValue={nombretTiendaCambiado}
                    onChange={(e) => setNombreTiendaCambiado(e.target.value)}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    marginRight: "10px",
                    marginTop: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontSize: "24px",
                      width: "90%",
                    }}
                  >
                    Dirección:
                  </Typography>
                  <TextField
                    sx={{
                      height: 40,
                      fontSize: "25px",
                      "& .MuiInputBase-root": {
                        height: "100%",
                        fontSize: "25px",
                      },
                    }}
                    defaultValue={DireccionTiendaCambiado}
                    onChange={(e) => setDireccionTiendaCambiado(e.target.value)}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                      marginRight: "10px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: "24px",
                        width: "90%",
                      }}
                    >
                      Provincia:
                    </Typography>
                    <TextField
                      sx={{
                        height: 40,
                        fontSize: "25px",
                        "& .MuiInputBase-root": {
                          height: "100%",
                          fontSize: "25px",
                        },
                      }}
                      defaultValue={ProvinciaTiendaCambiado}
                      onChange={(e) => setProvinciaTiendaCambiado(e.target.value)}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: "24px",
                        width: "90%",
                      }}
                    >
                      País:
                    </Typography>
                    <TextField
                      sx={{
                        height: 40,
                        fontSize: "25px",
                        "& .MuiInputBase-root": {
                          height: "100%",
                          fontSize: "25px",
                        },
                      }}
                      defaultValue={PaisTiendaCambiado}
                      onChange={(e) => setPaisTiendaCambiado(e.target.value)}
                    />
                  </Box>
                </Box>
              </Box>
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

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "35%",
                marginTop: "15px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "24px",
                    width: "90%",
                  }}
                >
                  Descripción de la tienda:
                </Typography>
              </Box>
              <TextField
                multiline
                rows={7}
                sx={{
                  width: "100%"
                }}
                inputProps={{ style: { fontSize: "20px" } }}
                defaultValue={DescripcionTiendaCambiado}
                onChange={(e) => setDescripcionTiendaCambiado(e.target.value)}
              />
            </Box>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1C2536",
                marginTop: "8px",
                fontSize: "25px",
                height: "7%",
                width: "100%",
                "&:hover": { backgroundColor: "#1C2536" },
              }}
              onClick={handleEditarTienda}
            >
              Guardar cambios
            </Button>
          </Box>
        </Modal>
      </Box>
    </>
  );
}
