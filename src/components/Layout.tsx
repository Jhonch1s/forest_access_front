import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <h1 className="logo">Forest Access</h1>
        </div>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Inicio
          </Link>
          <Link to="/categorias" className="nav-link" onClick={closeMenu}>
            Categorias
          </Link>
          <Link to="/login" className="nav-link" onClick={closeMenu}>
            Login
          </Link>
        </nav>
      </header>
      <main className="main">
        {children}
      </main>
    </div>
  );
}

export default Layout;
