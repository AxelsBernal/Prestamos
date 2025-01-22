import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../css/Login.css';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Llama a la API para autenticar al usuario
      const response = await fetch(`${import.meta.env.VITE_REST_API_AUTH}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guarda el usuario en el contexto de autenticación
        login({ token: data.token, user: data.user });
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al conectarse con el servidor');
      console.error('Error en handleSubmit:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Inicio de sesión</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          <div className="login-input-group">
            <label>
              <i className="fas fa-user"></i>
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="login-input-group">
            <label>
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="login-actions">
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
          <div className="login-links">
            <button className="forgot-password-button">¿Olvidaste tu contraseña?</button>
          </div>
        </form>
      </div>
    </div>
  );
}
