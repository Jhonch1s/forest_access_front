import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>Bienvenido a Forest Access</h2>
      <p>Sistema de gestión de acceso forestal.</p>
      <div className="card-grid">
        <div className="card">
          <h3>Categorias</h3>
          <p>Administrar categorias de empleados</p>
          <Link to="/categorias">Ver categorias →</Link>
        </div>
        <div className="card">
          <h3>Login</h3>
          <p>Acceder al sistema</p>
          <Link to="/login">Iniciar sesion →</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
