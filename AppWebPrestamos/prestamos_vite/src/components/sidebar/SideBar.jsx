import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { MdPeopleAlt, MdOutlineRequestQuote, MdAccountCircle } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import axios from "axios";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(() => {
    const storedState = localStorage.getItem("sidebarVisible");
    return storedState === "true";
  });

  const [userName, setUserName] = useState(""); // Estado para almacenar el nombre del usuario
  const [showModal, setShowModal] = useState(false); // Estado para el modal de confirmación

  const toggleSidebar = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    localStorage.setItem("sidebarVisible", newState);
    document.getElementById("content").className = isVisible
      ? "no-sidebar"
      : "with-sidebar";
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_REST_API_AUTH}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserName(response.data.nombre || "Usuario"); // Ajusta según el campo que devuelve la API
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    const content = document.getElementById("content");
    if (content) {
      content.className = isVisible ? "with-sidebar" : "no-sidebar";
    }
  }, [isVisible]);

  const handleLogout = () => {
    setShowModal(true); // Muestra el modal de confirmación
  };

  const confirmLogout = () => {
    localStorage.removeItem("token"); // Elimina el token del almacenamiento local
    window.location.href = "/login"; // Redirige al login con recarga de página
  };

  const cancelLogout = () => {
    setShowModal(false); // Oculta el modal de confirmación
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <>
      <Tooltip title="Ocultar/Mostrar" placement="right">
        <button className="toggle-button" onClick={toggleSidebar}>
          <FaHome />
        </button>
      </Tooltip>
      <div className={`sidebar ${isVisible ? "visible" : "hidden"}`}>
        <div className="profile-container">
          <h2 className="welcome-text">Bienvenido, {userName}</h2>
        </div>
        <ul>
          <Tooltip title="Inicio" placement="right">
            <li>
              <a onClick={() => navigateTo("/")}>
                Inicio
                <span style={{ marginLeft: "120px", color: "#4CAF50" }}>
                  <FaHome />
                </span>
              </a>
            </li>
          </Tooltip>
          <Tooltip title="Clientes" placement="right">
            <li>
              <a onClick={() => navigateTo("/clientes")}>
                Clientes
                <span style={{ marginLeft: "105px", color: "#2196F3" }}>
                  <MdPeopleAlt />
                </span>
              </a>
            </li>
          </Tooltip>
          <Tooltip title="Préstamos" placement="right">
            <li>
              <a onClick={() => navigateTo("/prestamos")}>
                Préstamos
                <span style={{ marginLeft: "90px", color: "#FFC107" }}>
                  <MdOutlineRequestQuote />
                </span>
              </a>
            </li>
          </Tooltip>
          <Tooltip title="Pagos" placement="right">
            <li>
              <a onClick={() => navigateTo("/pagos")}>
                Pagos
                <span style={{ marginLeft: "120px", color: "#FF5722" }}>
                  <RiBillLine />
                </span>
              </a>
            </li>
          </Tooltip>
          <Tooltip title="Cuenta" placement="right">
            <li>
              <a onClick={() => navigateTo("/cuenta")}>
                Cuenta
                <span style={{ marginLeft: "110px", color: "#3F51B5" }}>
                  <MdAccountCircle />
                </span>
              </a>
            </li>
          </Tooltip>
          <Tooltip title="Salir" placement="right">
            <li>
              <a onClick={handleLogout}>
                Salir
                <span style={{ marginLeft: "130px", color: "#F44336" }}>
                  <FaSignOutAlt />
                </span>
              </a>
            </li>
          </Tooltip>
        </ul>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar Cierre de Sesión</h3>
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={confirmLogout}>
                Sí, cerrar sesión
              </button>
              <button className="cancel-button" onClick={cancelLogout}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
