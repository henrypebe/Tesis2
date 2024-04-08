import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from "./js/Login/LoginPage";
import CreateUser from "./js/Login/CreateUser";
import TokenPantalla from "./js/Login/TokenPantalla";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RolDeterminar from "./js/Login/RolDeterminar";
import TiendaInformacion from "./js/Login/TiendaInformacion";
import MenuComprador from "./js/Comprador/MenuComprador";
import RecuperarContrasenha from "./js/Login/RecuperarContrasenha";
import EstablecerContrasenha from "./js/Login/EstablecerContrasenha";
import MenuVendedor from "./js/Vendedor/MenuVendedor";
import MenuAdministrador from "./js/Administrador/MenuAdministrador";
import { useState } from "react";
import RolVendedorDeter from "./js/Login/RolVendedorDeter";

function App() {
  const [isLoggedInAdministrador] = useState(() => {
    const storedCompradorStatus = localStorage.getItem("isLoggedInAdministrador");
    return storedCompradorStatus ? JSON.parse(storedCompradorStatus) : false;
  });
  const [isLoggedInComprador] = useState(() => {
    const storedCompradorStatus = localStorage.getItem("isLoggedInComprador");
    return storedCompradorStatus ? JSON.parse(storedCompradorStatus) : false;
  });
  const [isLoggedInVendedor] = useState(() => {
    const storedCompradorStatus = localStorage.getItem("isLoggedInVendedor");
    return storedCompradorStatus ? JSON.parse(storedCompradorStatus) : false;
  });

  const handleLoginAdministrador = (idUsuario) => {
    localStorage.setItem("isLoggedInAdministrador", true);
    window.location.href = `/MenuAdministrador/${idUsuario}`;
  };
  const handleLoginComprador = (idUsuario) => {
    localStorage.setItem("isLoggedInComprador", true);
    window.location.href = `/MenuComprador/${idUsuario}`;
  };
  const handleLoginVendedor = (idUsuario) => {
    localStorage.setItem("isLoggedInVendedor", true);
    window.location.href = `/MenuVendedor/${idUsuario}`;
  };
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Pantallas de Login */}
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/CreateUser" element={<CreateUser />} />
        <Route path="/TokenPantalla/:idUsuario" element={<TokenPantalla onLoginAdministrador={handleLoginAdministrador} onLoginComprador={handleLoginComprador}
          onLoginVendedor={handleLoginVendedor}/>} />
        <Route path="/Rol/:idUsuario" element={<RolDeterminar onLoginComprador={handleLoginComprador}/>} />
        <Route path="/RolVendedor/:idUsuario" element={<RolVendedorDeter onLoginVendedor={handleLoginVendedor}/>} />
        <Route path="/TiendaInformacion/:idUsuario" element={<TiendaInformacion onLoginVendedor={handleLoginVendedor}/>} />
        <Route path="/RecuperarContrasenhaPrimer" element={<RecuperarContrasenha />} />
        <Route path="/RecuperarContrasenhaSegundo" element={<EstablecerContrasenha />} />
        {/* Pantallas de Comprador */}
        {/* <Route path="/MenuComprador/:idUsuario" element={<MenuComprador />} /> */}
        <Route path="/MenuComprador/:idUsuario" element={isLoggedInComprador ? <MenuComprador /> : <Navigate to="/Login" />} />
        {/* Pantallas de Vendedor */}
        {/* <Route path="/MenuVendedor/:idUsuario" element={<MenuVendedor />} /> */}
        <Route path="/MenuVendedor/:idUsuario" element={isLoggedInVendedor ? <MenuVendedor /> : <Navigate to="/Login" />} />
        {/* Pantallas de Administrador */}
        <Route path="/MenuAdministrador/:idUsuario" element={isLoggedInAdministrador ? <MenuAdministrador /> : <Navigate to="/Login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
