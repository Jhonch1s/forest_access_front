import { useState } from 'react';
import CuadrillaList from '../components/CuadrillaList';
import CuadrillaDetails from '../components/CuadrillaDetails';
import { useCuadrillas } from '../hooks/useCuadrillas';
import './Cuadrillas.css';

//importamos el modal que ya teniamos
import FormModal from '../components/FormModal';
import { createCuadrilla } from '../services/cuadrillaService';

function Cuadrillas() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);


  // Estado para controlar la visibilidad del modal, si no le damos click esta en false y si le damso click esta en true haciendo que se vea
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { cuadrillas, loading, error, refetch } = useCuadrillas(mostrarHistorial);

  // El Padre busca la cuadrilla seleccionada en el array para pasársela al hijo derecho
  const selectedCuadrilla = cuadrillas.find(c => c.idCuadrilla === selectedId) || null;


  // Función para crear una nueva cuadrilla, al ponerle la id en 0 le decimos a la bd que tiene que registrar su propio id autoincrement
  const handleCreate = async (values: Record<string, string | number>) => {
  await createCuadrilla({ 
    idCuadrilla: 0,
    nombre: values.nombre as string, 
    activa: true //la inicialisamos en true por defecto
  });
    setIsCreateModalOpen(false); //ocultamos modal
    refetch(); //actualizamos pagina para que se refleje el nuevo dato
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Cuadrillas</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gestión de grupos de trabajo</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
  <button 
    className={`button ${mostrarHistorial ? 'button-primary' : 'button-secondary'}`}
    onClick={() => {
      setMostrarHistorial(!mostrarHistorial);
      setSelectedId(null); // Deseleccionamos al cambiar de pestaña
    }}
  >
    {mostrarHistorial ? 'Ver Activas' : 'Ver Historial'}  
  </button>
  <button className="button button-primary" onClick={() => setIsCreateModalOpen(true)}>+ Nueva Cuadrilla</button>
</div>

      </div>

      <div className={`cuadrilla-layout ${selectedId ? 'detail-active' : 'list-active'}`}>

        {/*la lista entera */}
        <CuadrillaList 
          cuadrillas={cuadrillas}
          loading={loading}
          error={error}
          selectedId={selectedId} 
          onSelect={setSelectedId} 
          onRefetch={refetch}
        />

        {/* solo el objeto de la cuadrilla seleccionada */}
        <CuadrillaDetails 
          cuadrilla={selectedCuadrilla} 
          onRefetch={refetch}
          onClose={() => setSelectedId(null)}
        />

      </div>
      {isCreateModalOpen && (
        <FormModal
          title="Nueva Cuadrilla"
          fields={[
            { name: 'nombre', label: 'Nombre de la Cuadrilla', required: true }
          ]}
          onSubmit={handleCreate}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Cuadrillas;
