import React, { useState } from "react";
import "../../css/Login/LoginPage.css";
import { Box, Button, Link, TextField, Typography, CircularProgress } from "@mui/material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SHA256 } from 'crypto-js';
import { BASE_URL } from "../../config";

export default function LoginPage() {
  const [emailType, setEmailType] = useState("");
  const [contrasenha, setContrasenha] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga

  const handleLoginSistema = async () => {
    if (loading) return; // Evita múltiples clics
    setLoading(true); // Inicia la carga
    try {
      if(emailType !== '' || contrasenha !== ''){
        const hashedPassword = SHA256(contrasenha).toString();
        const response = await fetch(`${BASE_URL}/login?_correo=${emailType}&_contrasenha=${hashedPassword}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const idUsuario = parseInt(await response.text());
          if(idUsuario !== -1) {
            window.location.href = `/TokenPantalla/${idUsuario}`;
          } else {
            toast.error('Error al ingresar los datos, verifique nuevamente.');
          }
        } else {
          if (response.status === 400) {
            const errorMessage = await response.text();
            toast.error(errorMessage);
          } else {
            toast.error('Error al ingresar los datos, verifique nuevamente.');
          }
        }
      } else {
        toast.error('Debe ingresar todos los datos solicitados.');
      }
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      toast.error('Ocurrió un error al intentar iniciar sesión.');
    } finally {
      setLoading(false); // Finaliza la carga
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
          disabled={loading} // Deshabilita el botón durante la carga
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Iniciar Sesión"}
        </Button>
      </Box>
    </div>
  );
}