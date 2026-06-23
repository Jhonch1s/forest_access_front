import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './PunteroLayout.css';

interface PunteroLayoutProps {
  children: React.ReactNode;
}

function PunteroLayout({ children }: PunteroLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="puntero-layout">
      <header className="puntero-topbar">
        <div className="puntero-topbar-brand">
          <svg viewBox="0 0 64 64" fill="none" width="28" height="28">
            <path d="M32 4L12 28h8l-6 14h8l-6 14h36l-6-14h8l-6-14h8L32 4z" fill="rgba(34,255,216,0.2)" stroke="#22ffd8" strokeWidth="2" strokeLinejoin="round" />
            <rect x="28" y="52" width="8" height="8" rx="1" fill="#22ffd8" opacity="0.6" />
          </svg>
          <span className="puntero-topbar-title">Forest Access</span>
          <span className="puntero-topbar-company">Forestal AG</span>
        </div>
        <div className="puntero-topbar-user">
          <span className="puntero-topbar-name">{user?.nombreUsuario}</span>
          <button className="puntero-logout-btn" onClick={handleLogout} aria-label="Cerrar sesión">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h5a1 1 0 100-2H4V5h4a1 1 0 100-2H3zm10.293 3.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>
      <main className="puntero-main">
        {children}
      </main>
    </div>
  );
}

export default PunteroLayout;
