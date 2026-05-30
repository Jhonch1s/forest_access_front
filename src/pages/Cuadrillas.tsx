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


  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { cuadrillas, loading, error, refetch, paginaActual, totalPaginas, cambiarPagina } = useCuadrillas(mostrarHistorial);
  const selectedCuadrilla = cuadrillas.find(c => c.idCuadrilla === selectedId) || null;
  const handleCreate = async (values: Record<string, string | number>) => {
  await createCuadrilla({ 
    idCuadrilla: 0,
    nombre: values.nombre as string, 
    activa: true 
  });
    setIsCreateModalOpen(false);
    refetch(); 
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Cuadrillas</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gestión de grupos de trabajo</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            className={`button ${mostrarHistorial ? 'button-primary' : 'button-secondary'}`}
            onClick={() => {
              setMostrarHistorial(!mostrarHistorial);
              setSelectedId(null);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '15px' }}
          >
            {mostrarHistorial ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Ver Activas
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="10"></circle></svg>
                Ver Historial
              </>
            )}  
          </button>
          <button 
            className="button button-primary" 
            onClick={() => setIsCreateModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '15px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Cuadrilla
          </button>
        </div>

      </div>

      <div className={`cuadrilla-layout ${selectedId ? 'detail-active' : 'list-active'}`}>

        <CuadrillaList 
          cuadrillas={cuadrillas}
          loading={loading}
          error={error}
          selectedId={selectedId} 
          onSelect={setSelectedId} 
          onRefetch={refetch}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={cambiarPagina}
        />

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
