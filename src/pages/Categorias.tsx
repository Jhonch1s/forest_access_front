function Categorias() {
  // TODO: conectar con el backend para obtener categorias reales
  const categorias = [
    { id: 1, nombre: 'Guarda Forestal', descripcion: 'Vigilancia y proteccion del bosque' },
    { id: 2, nombre: 'Tecnico Forestal', descripcion: 'Monitoreo e inventario de areas' },
    { id: 3, nombre: 'Administrador', descripcion: 'Gestion general del sistema' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Categorias de Empleados</h2>
        <button className="btn btn-primary">+ Nueva Categoria</button>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.nombre}</td>
                <td>{cat.descripcion}</td>
                <td>
                  <button className="btn btn-small btn-secondary">Editar</button>
                  <button className="btn btn-small btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categorias;
