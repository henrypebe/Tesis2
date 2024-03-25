import "./App.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from "./js/Login/LoginPage";
import CreateUser from "./js/Login/CreateUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/CreateUser" element={<CreateUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
