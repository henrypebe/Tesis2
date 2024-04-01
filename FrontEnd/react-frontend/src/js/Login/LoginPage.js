import React, { useState } from "react";
import "../../css/Login/LoginPage.css";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SHA256 } from 'crypto-js';

export default function LoginPage() {
  const [emailType, setEmailType] = useState("");
  const [contrasenha, setContrasenha] = useState("");
  const [token, setToken] = useState("");

  const handleCreateUser = async () => {
    try {
      if(emailType !== '' || contrasenha !== '' || token !== ''){
        const hashedPassword = SHA256(contrasenha).toString();
        const response = await fetch(`https://localhost:7240/login?_correo=${emailType}&_contrasenha=${hashedPassword}&_token=${token}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const { idUsuario, opcionPantalla } = await response.json();

          if (opcionPantalla === 1) {
            window.location.href = `/MenuAdministrador/${idUsuario}`;
          } else if (opcionPantalla === 2) {
            window.location.href = `/MenuComprador/${idUsuario}`;
          } else if (opcionPantalla === 3) {
            window.location.href = `/MenuVendedor/${idUsuario}`;
          } else {
            console.error("Tipo de correo electrónico no válido");
          }
        } else {
          throw new Error("Error al ingresar");
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
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "24px",
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
          sx={{ marginBottom: "19px" }}
          onChange={(e) => setEmailType(e.target.value)}
        />

        <TextField
          id="outlined-basic"
          label="Contraseña"
          variant="outlined"
          type="password"
          sx={{ marginBottom: "19px" }}
          onChange={(e) => setContrasenha(e.target.value)}
        />

        <TextField
          id="outlined-basic"
          label="Token"
          variant="outlined"
          sx={{ marginBottom: "19px" }}
          onChange={(e) => setToken(e.target.value)}
        />

        <Box
          sx={{
            marginBottom: "19px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Link href="/CreateUser">¿Es usuario nuevo?</Link>
          <Link href="/RecuperarContrasenhaPrimer">
            ¿Se olvidó la contraseña?
          </Link>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1C2536",
            width: "100%",
            "&:hover": { backgroundColor: "#1C2536" },
          }}
          onClick={handleCreateUser}
        >
          Iniciar Sesión
        </Button>
      </Box>
    </div>
  );
}
