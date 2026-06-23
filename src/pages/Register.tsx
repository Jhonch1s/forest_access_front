import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { register } from '../services/authService';
import { getPerfiles } from '../services/perfilService';
import type { Perfil } from '../types';
import './Login.css';

function Register() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [perfilId, setPerfilId] = useState<number | ''>('');
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPerfiles()
      .then(setPerfiles)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const u = usuario.trim();
    const p = password.trim();
    const c = confirmPassword.trim();

    if (!u || !p || !c) {
      setError('Completá todos los campos.');
      return;
    }

    if (u.length < 3 || u.length > 50) {
      setError('El usuario debe tener entre 3 y 50 caracteres.');
      return;
    }

    if (p.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (p.length > 100) {
      setError('La contraseña supera el límite permitido.');
      return;
    }

    if (p !== c) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!perfilId) {
      setError('Seleccioná un perfil.');
      return;
    }

    setLoading(true);
    try {
      await register({ nombreUsuario: u, password: p });
      navigate('/');
    } catch {
      setError('Error al registrar. Intentá de nuevo.');
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
          <p>&copy; 2026 Forestal AG</p>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-wrapper">
          <h2 className="login-title">Crear Cuenta</h2>
          <p className="login-subtitle">Registrate para acceder al sistema</p>

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
                  placeholder="Elegí tu usuario"
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
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
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
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetí tu contraseña"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="perfil">Perfil</label>
              <select
                id="perfil"
                value={perfilId}
                onChange={(e) => setPerfilId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Seleccioná un perfil</option>
                {perfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" variant="primary" size="large" loading={loading}>
              Registrarse
            </Button>
          </form>

          <p className="login-switch">
            ¿Ya tenés cuenta? <Link to="/">Iniciá sesión</Link>
          </p>

          <div className="login-form-footer">
            <p>v1.0.0 &middot; &copy; 2026 Forestal AG</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
