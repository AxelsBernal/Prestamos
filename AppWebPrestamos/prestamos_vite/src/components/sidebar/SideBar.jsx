import React, { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";

// Importar íconos de React Icons con colores personalizados
import { FaHome } from "react-icons/fa";
import { MdPeopleAlt, MdOutlineRequestQuote } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";

import "./Sidebar.css";

export default function Sidebar({ onSwitchView }) {
  const [isVisible, setIsVisible] = useState(() => {
    const storedState = localStorage.getItem("sidebarVisible");
    return storedState === "true";
  });

  const [profileImage, setProfileImage] = useState(
    "https://i.pinimg.com/736x/48/17/0f/48170f2365dda8b63acc5d5d36c7a9ff.jpg"
  );

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("profile-input").click();
  };

  const toggleSidebar = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    localStorage.setItem("sidebarVisible", newState);
    document.getElementById("content").className = isVisible
      ? "no-sidebar"
      : "with-sidebar";
  };

  useEffect(() => {
    const content = document.getElementById("content");
    if (content) {
      content.className = isVisible ? "with-sidebar" : "no-sidebar";
    }
  }, [isVisible]);

  return (
    <>
      <Tooltip title="Ocultar/Mostrar" placement="right">
        <button className="toggle-button" onClick={toggleSidebar}>
          <FaHome />
        </button>
      </Tooltip>
      <div className={`sidebar ${isVisible ? "visible" : "hidden"}`}>
        <div className="profile-container">
          <img
            src={profileImage}
            alt="Perfil"
            className="profile-icon"
            onClick={triggerFileInput}
          />
          <input
            id="profile-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
        <ul>
          <Tooltip title="Inicio" placement="right">
            <li>
              <a onClick={() => onSwitchView("Inicio")}>
                Inicio
                <span style={{ marginLeft: "120px", color: "#4CAF50" }}>
                  <FaHome />
                </span>
              </a>
            </li>
          </Tooltip>
          <Tooltip title="Clientes" placement="right">
            <li>
              <a onClick={() => onSwitchView("Clientes")}>
                Clientes
                <span style={{ marginLeft: "105px", color: "#2196F3" }}>
                  <MdPeopleAlt />
                </span>
              </a>
            </li>
          </Tooltip>
          <Tooltip title="Préstamos" placement="right">
            <li>
              <a onClick={() => onSwitchView("Prestamos")}>
                Préstamos
                <span style={{ marginLeft: "90px", color: "#FFC107" }}>
                  <MdOutlineRequestQuote />
                </span>
              </a>
            </li>
          </Tooltip>
          <Tooltip title="Pagos" placement="right">
            <li>
              <a onClick={() => onSwitchView("Pagos")}>
                Pagos
                <span style={{ marginLeft: "120px", color: "#FF5722" }}>
                  <RiBillLine />
                </span>
              </a>
            </li>
          </Tooltip>
          <Tooltip title="Cuenta" placement="right">
            <li>
              <a onClick={() => onSwitchView("Cuenta")}>
                Cuenta
                <span style={{ marginLeft: "110px", color: "#3F51B5" }}>
                  <MdAccountCircle />
                </span>
              </a>
            </li>
          </Tooltip>
          <Tooltip title="Salir" placement="right">
            <li>
              <a onClick={() => onSwitchView("Salir")}>
                Salir
                <span style={{ marginLeft: "130px", color: "#F44336" }}>
                  <FaSignOutAlt />
                </span>
              </a>
            </li>
          </Tooltip>
        </ul>
      </div>
    </>
  );
}
