import Footer from './components/footer/Footer';
import Sidebar from './components/sidebar/SideBar';
import Inicio from './pages/Inicio';
import Clientes from "./pages/Clientes";
import { useState } from 'react';

export default function App() {
  // Estado para gestionar la vista activa
  const [activeView, setActiveView] = useState('Inicio');
  const switchView = (view) => setActiveView(view);

  return (
    <div id="app-container">
      <Sidebar onSwitchView={switchView} />
      <div id="content">
        <div id="main-content">
          {activeView === 'Inicio' && <Inicio />}
          {activeView === "Clientes" && <Clientes />}
        </div>
      </div>
      <Footer />
    </div>
  );
}
