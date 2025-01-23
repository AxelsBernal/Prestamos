import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/cuenta.css";

const Cuenta = () => {
  const [user, setUser] = useState({ nombre: "", email: "", password: "", createdAt: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_REST_API_AUTH}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="cuenta-container">
      <h2>Mi Cuenta</h2>
      <form className="cuenta-form">
        <div className="cuenta-field">
          <label>Nombre</label>
          <input type="text" value={user.nombre} readOnly />
        </div>
        <div className="cuenta-field">
          <label>Correo Electrónico</label>
          <input type="email" value={user.email} readOnly />
        </div>
        <div className="cuenta-field">
          <label>Fecha de Creación</label>
          <input type="text" value={new Date(user.createdAt).toLocaleDateString()} readOnly />
        </div>
      </form>
    </div>
  );
};

export default Cuenta;
