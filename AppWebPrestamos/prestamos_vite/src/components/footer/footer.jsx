import React from "react";
import "./Footer.css"; 

import { FaBars } from "react-icons/fa";

import { useState,useEffect } from "react";

import { Tooltip } from "@mui/material";

export default function Footer(){

  const [isVisible, setIsVisible] = useState(() => {
    const storedState = localStorage.getItem("footerVisible");
    return storedState === "true";
  });

  const toggleFooter = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    localStorage.setItem("footerVisible", newState);
  };

  useEffect(() => {
    const content = document.getElementById("content");
    if (content) {
      content.classList.toggle("with-footer", isVisible);
      content.classList.toggle("no-footer", !isVisible);
    }
  }, [isVisible]);

  return (
    <>
      <Tooltip title='Ocultar/Mostrar' placement="right">
        <button className="toggle-button-footer" onClick={toggleFooter}>
          <FaBars/>
        </button>
      </Tooltip>
      <footer className={`footer ${isVisible ? 'visible' : 'hidden'}`}>
        <p>© {new Date().getFullYear()} Sistema Web de Prestamos. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="/Productos">Acerca de</a>
          <a href="/Inventarios">Contacto</a>
          <a href="/Ventas">Privacidad</a>
        </div>
      </footer>
    </>
  );
}
