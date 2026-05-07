import { useCategorias } from '../hooks/useCategorias';
import Button from './Button';
import './CategoriaList.css';

function CategoriaList() {
  const { categorias, loading, error } = useCategorias();

  if (loading) {
    return (
      <div className="categoria-status">
        <div className="categoria-spinner" />
        <p>Cargando categorias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categoria-status categoria-error">
        <p>Error al cargar categorias: {error}</p>
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="categoria-status">
        <p>No hay categorias registradas.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: tabla */}
      <div className="categoria-table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Valor Jornal</th>
              <th>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.idCategoria}>
                <td>{cat.idCategoria}</td>
                <td>{cat.nombre}</td>
                <td>${cat.valorJornal}</td>
                <td>{cat.descripcion}</td>
                <td className="categoria-actions">
                  <Button variant="secondary" size="small">Editar</Button>
                  <Button variant="danger" size="small">Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="categoria-cards">
        {categorias.map((cat) => (
          <div key={cat.idCategoria} className="categoria-card">
            <div className="categoria-card-header">
              <h3 className="categoria-card-title">{cat.nombre}</h3>
              <span className="categoria-card-id">#{cat.idCategoria}</span>
            </div>
            <div className="categoria-card-body">
              <div className="categoria-card-field">
                <span className="categoria-card-label">Valor Jornal</span>
                <span className="categoria-card-value">${cat.valorJornal}</span>
              </div>
              <div className="categoria-card-field">
                <span className="categoria-card-label">Descripcion</span>
                <span className="categoria-card-value">{cat.descripcion}</span>
              </div>
            </div>
            <div className="categoria-card-actions">
              <Button variant="secondary" size="small">Editar</Button>
              <Button variant="danger" size="small">Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CategoriaList;
