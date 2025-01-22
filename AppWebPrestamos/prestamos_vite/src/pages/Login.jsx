import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REST_API_AUTH}/login`,
        credentials
      );
      login(response.data);
      console.log("Inicio de sesión exitoso, redirigiendo a /inicio");
      navigate("/");
    } catch (err) {
      console.error("Error en el inicio de sesión:", err);
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Inicio de Sesión</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="login-error">{error}</p>}
          <div className="login-input-group">
            <label>
              <i className="fas fa-user"></i>
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="login-input-group">
            <label>
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="login-actions">
            <button className="login-button" type="submit">
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
