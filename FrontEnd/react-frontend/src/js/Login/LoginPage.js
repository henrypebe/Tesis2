import React, { useState } from "react";
import "../../css/Login/LoginPage.css";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SHA256 } from 'crypto-js';

export default function LoginPage() {
  const [emailType, setEmailType] = useState("");
  const [contrasenha, setContrasenha] = useState("");

  const datosDirectosString = `ID: 84276456158716628018388007973476589694297596544125460074642747809140486938024\n` +
    `Nombre y Apellido del Comprador: Rachel Stanley\n` +
    `Fecha de Creación del Pedido: 2024-04-01 03:14:00\n` +
    `Lugar de Entrega: 686 Emma Station Apt. 781, Port Christianfort, MT 06211\n` +
    `Cantidad de cambios de lugar de entrega durante el ultimo mes: 3\n` +
    `Costo total del Pedido: 10\n` +
    `Método de Pago (Número de Cuenta Encriptado): 6567978263124321176199124994021629054013394850766151770053130685444148306190\n` +
    `Numeros de cambios del método de pago: 2\n` +
    `Cantidad de Productos en el Pedido: 10\n` +
    `Tipo de Producto (con mayor valor): Tecnología`;

  fetch('http://localhost:5000/predecir', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      datos_directos: datosDirectosString
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error('Error:', error));  

  const handleLoginSistema = async () => {
    try {
      if(emailType !== '' || contrasenha !== ''){
        const hashedPassword = SHA256(contrasenha).toString();
        const response = await fetch(`https://localhost:7240/login?_correo=${emailType}&_contrasenha=${hashedPassword}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const idUsuario = parseInt(await response.text());
          if(idUsuario !== -1) window.location.href = `/TokenPantalla/${idUsuario}`;
          else toast.error('Error al ingresar los datos, verifique nuevamente.');
        } else {
          if (response.status === 400) {
            const errorMessage = await response.text();
            toast.error(errorMessage);
          } else {
              toast.error('Error al ingresar los datos, verifique nuevamente.');
          }
        }
      }else{
        toast.error('Debe ingresar todos los datos solicitados.');
      }
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
    }
  };

  return (
    <div className="loginTotal">
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "5px",
          padding: "20px 37px 20px 37px",
          display: "flex",
          flexDirection: "column",
          width: "400px",
          height:"40%"
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "32px",
            fontFamily: "sans-serif",
            marginBottom: "19px",
            fontWeight: "600",
          }}
        >
          ¡Bienvenido!
        </Typography>

        <TextField
          id="outlined-basic"
          label="Correo electrónico"
          variant="outlined"
          sx={{ marginBottom: "25px" }}
          inputProps={{ style: { fontSize: "22px" } }}
          InputLabelProps={{ style: { fontSize: "22px" } }}
          onChange={(e) => setEmailType(e.target.value)}
        />

        <TextField
          id="outlined-basic"
          label="Contraseña"
          variant="outlined"
          type="password"
          sx={{ marginBottom: "25px" }}
          inputProps={{ style: { fontSize: "22px" } }}
          InputLabelProps={{ style: { fontSize: "22px" } }}
          onChange={(e) => setContrasenha(e.target.value)}
        />

        <Box
          sx={{
            marginBottom: "25px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Link href="/CreateUser" sx={{fontSize:"19px"}}>¿Es usuario nuevo?</Link>
          <Link href="/RecuperarContrasenhaPrimer" sx={{fontSize:"19px"}}>
            ¿Se olvidó la contraseña?
          </Link>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1C2536",
            width: "100%",
            fontSize:"22px",
            marginTop:"12px",
            "&:hover": { backgroundColor: "#1C2536" },
          }}
          onClick={handleLoginSistema}
        >
          Iniciar Sesión
        </Button>
      </Box>
    </div>
  );
}
