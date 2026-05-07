import Button from '../components/Button';
import CategoriaList from '../components/CategoriaList';

function Categorias() {
  return (
    <div>
      <div className="page-header">
        <h2>Categorias de Empleados</h2>
        <Button variant="primary">+ Nueva Categoria</Button>
      </div>
      <CategoriaList />
    </div>
  );
}

export default Categorias;
