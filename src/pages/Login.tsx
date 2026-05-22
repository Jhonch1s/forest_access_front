import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { login } from '../services/authService';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const u = usuario.trim();
    const p = password.trim();

    if (!u || !p) {
      setError('Completá todos los campos.');
      return;
    }

    if (u.length > 50 || p.length > 100) {
      setError('Los datos ingresados superan el límite permitido.');
      return;
    }

    setLoading(true);
    try {
      const token = await login({ usuario: u, password: p });
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch {
      setError('Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-brand-panel">
        <div className="login-brand-content">
          <svg
            className="login-tree-icon"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 4L12 28h8l-6 14h8l-6 14h36l-6-14h8l-6-14h8L32 4z"
              fill="rgba(34, 255, 216, 0.2)"
              stroke="#22ffd8"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <rect x="28" y="52" width="8" height="8" rx="1" fill="#22ffd8" opacity="0.6" />
          </svg>
          <h1 className="login-brand-title">Forest Access</h1>
          <p className="login-brand-tagline">Sistema de gestión forestal</p>
        </div>
        <div className="login-brand-footer">
          <p>v0.1.0</p>
          <p>&copy; 2026 Forest Access</p>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-wrapper">
          <h2 className="login-title">Iniciar Sesión</h2>
          <p className="login-subtitle">Ingresá tus credenciales para acceder</p>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="login-error">{error}</div>}

            <div className="form-field">
              <label htmlFor="usuario">Usuario</label>
              <div className="login-input-wrapper">
                <svg
                  className="login-input-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z" />
                </svg>
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Tu usuario"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password">Contraseña</label>
              <div className="login-input-wrapper">
                <svg
                  className="login-input-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="large" loading={loading}>
              Entrar
            </Button>
          </form>

          <p className="login-switch">
            ¿No tenés cuenta? <Link to="/register">Registrate</Link>
          </p>

          <div className="login-form-footer">
            <p>v0.1.0 &middot; &copy; 2026 Forest Access</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
