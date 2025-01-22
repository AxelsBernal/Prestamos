import Footer from './components/footer/Footer';
import Sidebar from './components/sidebar/SideBar';
import Inicio from './pages/Inicio';
import Clientes from './pages/Clientes';
import Prestamos from './pages/prestamos';
import Pagos from './pages/pagos';
import Login from './pages/Login';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('Inicio');
  const switchView = (view) => setActiveView(view);

  return (
    <Router>
      <Routes>
        {/* Ruta pública para login */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

        {/* Rutas privadas */}
        {user ? (
          <Route path="/" element={
            <div id="app-container">
              <Sidebar onSwitchView={switchView} />
              <div id="content">
                <div id="main-content">
                  <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/prestamos" element={<Prestamos />} />
                    <Route path="/pagos" element={<Pagos />} />
                  </Routes>
                </div>
              </div>
              <Footer />
              <ToastContainer />
            </div>
          } />
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}
