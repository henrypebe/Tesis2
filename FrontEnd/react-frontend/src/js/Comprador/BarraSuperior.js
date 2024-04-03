import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SHA256 } from 'crypto-js';
import { decryptValue, getSecretKey } from "../Server/Encriptacion";

export default function BarraSuperior({ opcionAdministrador, idUsuario }) {
  const [rol, setRol] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [openModalSecundario, setOpenModalSecundario] = React.useState(false);
  const [openModalTercero, setOpenModaTercero] = React.useState(false);
  const [informacionUsuario, setInformacionUsuario] = useState();
  const [loading, setLoading] = React.useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenModalSecundario = () => {setOpenModalSecundario(true); setOpen(false);};
  const handleCloseModalSecundario = () => {setOpenModalSecundario(false); setOpen(true); setVerificarContrasenha("");};
  const handleOpenModalTercero = () => {setOpenModaTercero(true); setOpen(false);};
  const handleCloseModalTercero = () => {setOpenModaTercero(false); setOpen(true); setVerificarContrasenha("");};

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
        setInformacionUsuario(usuario);
        
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else {
        throw new Error("Error al obtener el token");
      }
    } catch (error) {
      console.error("Error al obtener el token:", error);
      throw new Error("Error al obtener el token");
    }
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        const usuario = obtenerRolesIdUsuario(idUsuario);
        setInformacionUsuario(usuario);
        console.log(usuario);
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
      setTelefonoCambiado(informacionUsuario.telefono ?? "");
      setDireccionCambiado(informacionUsuario.direccion ?? "");
    }
  }, [informacionUsuario]);

  const [nombreCambiado, setNombreCambiado] = useState("");
  const [apellidoCambiado, setApellidoCambiado] = useState("");
  const [correoCambiado, setCorreoCambiado] = useState("");
  const [TelefonoCambiado, setTelefonoCambiado] = useState("");
  const [DireccionCambiado, setDireccionCambiado] = useState("");

  const [verificarContrasenha, setVerificarContrasenha] = useState("");
  const [verificarToken, setVerificarToken] = useState("");
  const [token, setToken] = useState("");
  const [contrasenha, setContrasenha] = useState("");

  const handleChange = (event) => {
    setRol(event.target.value);
  };

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
    height: "85%",
  };
  const styleSecundario = {
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
    height: "27%",
  };
  const styleTercero = {
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
    height: "27%",
  };

  const handleChangeCerrarSesion = () => {
    window.location.href = "/Login";
  };

  const handleCambioDatos = async () => {
    try {
      const response = await fetch(`https://localhost:7240/EditarUsuario?idUsuario=${idUsuario}&nombre=${nombreCambiado}&apellido=${apellidoCambiado}&correo=${correoCambiado}&numero=${TelefonoCambiado}&direccion=${DireccionCambiado}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

      if (response.ok) {
        toast.success("Información modificada con éxito", { autoClose: 2000 });
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else {
        throw new Error("Error al obtener el token");
      }
    } catch (error) {
      console.error("Error al obtener el token:", error);
      throw new Error("Error al obtener el token");
    }
  };

  const handleVerificarContrasenha = async () =>{
    try {
      const hashedPassword = SHA256(verificarContrasenha).toString();
      const response = await fetch(`https://localhost:7240/VerificarContrasenha?idUsuario=${idUsuario}&contrasenha=${hashedPassword}`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const _token = await response.text();
        toast.success("Se puede visualizar el token", { autoClose: 2000 });
        setToken(_token);
        handleCloseModalSecundario();
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else {
        throw new Error("Error al obtener el token");
      }
    } catch (error) {
      console.error("Error al obtener el token:", error);
      throw new Error("Error al obtener el token");
    }
  }

  const handleVerificarToken = async () =>{
    try {
      const response = await fetch(`https://localhost:7240/VerificarToken?idUsuario=${idUsuario}&token=${verificarToken}`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const _contrasenha = await response.text();
        toast.success("Se puede visualizar la contraseña", { autoClose: 2000 });
        setContrasenha(_contrasenha);
        handleCloseModalTercero();
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else {
        throw new Error("Error al obtener la contrasenha");
      }
    } catch (error) {
      console.error("Error al ingresar a la api", error);
      throw new Error("Error al ingresar a la api");
    }
  }

  const copyToClipboard = () => {
      navigator.clipboard.writeText(token).then(() => {
          toast.success('Token copiado al portapapeles', { autoClose: 2000 });
      }).catch((error) => {
        console.error('Error al copiar el token:', error);
        toast.error('Error al copiar el token. Por favor, inténtalo de nuevo');
      });
  };

  return loading ? (
    <></>
  ) : (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#1C1B1B",
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
        <MenuBookIcon sx={{ color: "white", marginRight: "20px" }} />
        <Typography sx={{ color: "white", width: "200%" }}>
          Tesis 2 - ¡Bienvenido{" "}
          {informacionUsuario && informacionUsuario.nombre ? informacionUsuario.nombre : ""}{" "}
          {informacionUsuario && informacionUsuario.apellido ? informacionUsuario.apellido : ""}!
        </Typography>
        {opcionAdministrador ? (
          <Box
            sx={{
              width: "40%",
              height: "80%",
              border: "2px solid #D9D9D9",
              marginTop: "8px",
              borderRadius: "6px",
              backgroundColor: "#D9D9D9",
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
              border: "2px solid #D9D9D9",
              marginTop: "0px",
              borderRadius: "6px",
              backgroundColor: "#D9D9D9",
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
          <FormControl
            fullWidth
            sx={{
              width: "40%",
              height: "150%",
              marginTop: "35px",
              "& .MuiOutlinedInput-root": {
                border: "1px solid white",
                height: "60%",
              },
            }}
          >
            <InputLabel
              id="demo-simple-select-label"
              sx={{ color: "white", marginTop: "-10px" }}
            >
              Rol
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={rol}
              label="Rol"
              onChange={handleChange}
              IconComponent={ArrowDropDown}
              sx={{
                color: "white",
                "& .MuiSelect-icon": { color: "white" },
              }}
            >
              <MenuItem value={10}>Comprador</MenuItem>
              <MenuItem value={20}>Vendedor</MenuItem>
            </Select>
          </FormControl>
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
            fontSize:"20px",
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

            <Box sx={{ display: "flex", flexDirection: "row", height: "42%" }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "30%" }}
              >
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
                    height: "65%",
                    backgroundColor: "#D9D9D9",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                ></Box>
                <Box
                  sx={{
                    width: "98%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      width: "80%",
                      backgroundColor: "#1C2536",
                      "&:hover": { backgroundColor: "#1C2536" },
                    }}
                  >
                    Subir foto
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "30px",
                  width: "65%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: "20px",
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
                      width: "100%",
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
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: "25px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontSize: "24px",
                      width: "50%",
                    }}
                  >
                    Número de teléfono:
                  </Typography>
                  <TextField
                    sx={{
                      height: 40,
                      width: "50%",
                      fontSize: "25px",
                      "& .MuiInputBase-root": {
                        height: "100%",
                        fontSize: "25px",
                      },
                    }}
                    defaultValue={TelefonoCambiado}
                    onChange={(e) => setTelefonoCambiado(e.target.value)}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: "25px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontSize: "24px",
                      width: "50%",
                    }}
                  >
                    Dirección de entrega:
                  </Typography>
                  <TextField
                    sx={{
                      height: 40,
                      width: "50%",
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
                  Token de Acceso:
                </Typography>
                <TextField
                  sx={{
                    height: 40,
                    width: "60%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                  }}
                  disabled={true}
                  defaultValue={token}
                />

                <IconButton sx={{ marginLeft: "10px", marginRight: "10px" }}
                  onClick={handleOpenModalSecundario}
                >
                  <VisibilityIcon sx={{ color: "black", fontSize: "35px" }} />
                </IconButton>

                <IconButton onClick={copyToClipboard}>
                  <ContentCopyIcon sx={{ color: "black", fontSize: "35px" }} />
                </IconButton>
              </Box>

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
                  disabled={true}
                  sx={{
                    height: 40,
                    width: "60%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                  }}
                />

                <IconButton sx={{ marginLeft: "10px", marginRight: "10px" }}
                  onClick={handleOpenModalTercero}
                >
                  <VisibilityIcon sx={{ color: "black", fontSize: "35px" }} />
                </IconButton>

                <Link href="#" sx={{ fontSize: "18px" }}>
                  Modificar
                </Link>
              </Box>

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
              >
                Eliminar cuenta
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={openModalSecundario}
          onClose={handleCloseModalSecundario}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...styleSecundario}}>
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
                Ingrese su contraseña
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
                onClick={handleCloseModalSecundario}
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
                  fontSize: '27px',
                  marginTop:"-5px"
                }
              }}
              onChange={(e) => setVerificarContrasenha(e.target.value)}
              sx={{
                height: 60,
                width:"100%",
                fontSize: "30px",
                display:"flex",
                justifyContent:"center",
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
                marginTop:"25px",
                fontSize:"25px",
                height:"20%",
                width: "100%",
                "&:hover": { backgroundColor: "#1C2536" },
              }}
              onClick={handleVerificarContrasenha}
            >
              Confirmar
            </Button>
          </Box>
        </Modal>

        <Modal
          open={openModalTercero}
          onClose={handleCloseModalTercero}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...styleTercero}}>
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
                Ingrese su token
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
                onClick={handleCloseModalTercero}
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
              label="Token"
              variant="outlined"
              InputLabelProps={{
                style: {
                  fontSize: '27px',
                  marginTop:"-5px"
                }
              }}
              onChange={(e) => setVerificarToken(e.target.value)}
              sx={{
                height: 60,
                width:"100%",
                fontSize: "30px",
                display:"flex",
                justifyContent:"center",
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
                marginTop:"25px",
                fontSize:"25px",
                height:"20%",
                width: "100%",
                "&:hover": { backgroundColor: "#1C2536" },
              }}
              onClick={handleVerificarToken}
            >
              Confirmar
            </Button>
          </Box>
        </Modal>
      </Box>
    </>
  );
}
