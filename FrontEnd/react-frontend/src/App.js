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

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Pantallas de Login */}
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/CreateUser" element={<CreateUser />} />
        <Route path="/TokenPantalla" element={<TokenPantalla />} />
        <Route path="/Rol" element={<RolDeterminar />} />
        <Route path="/TiendaInformacion" element={<TiendaInformacion />} />
        <Route path="/RecuperarContrasenhaPrimer" element={<RecuperarContrasenha />} />
        <Route path="/RecuperarContrasenhaSegundo" element={<EstablecerContrasenha />} />
        {/* Pantallas de Comprador */}
        <Route path="/MenuComprador" element={<MenuComprador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
