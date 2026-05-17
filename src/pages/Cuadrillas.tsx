import { useState } from 'react';
import CuadrillaList from '../components/CuadrillaList';
import CuadrillaDetails from '../components/CuadrillaDetails';
import { useCuadrillas } from '../hooks/useCuadrillas';
import './Cuadrillas.css';

function Cuadrillas() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // ELEVAMOS EL ESTADO: El Padre pide los datos a la base de datos UNA sola vez
  const { cuadrillas, loading, error, refetch } = useCuadrillas();

  // El Padre busca la cuadrilla seleccionada en el array para pasársela al hijo derecho
  const selectedCuadrilla = cuadrillas.find(c => c.idCuadrilla === selectedId) || null;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Cuadrillas</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gestión de grupos de trabajo</p>
        </div>
        <button className="button button-primary">+ Nueva Cuadrilla</button>
      </div>

      <div className="cuadrilla-layout">
        {/* Izquierda: Le pasamos la lista entera */}
        <CuadrillaList 
          cuadrillas={cuadrillas}
          loading={loading}
          error={error}
          selectedId={selectedId} 
          onSelect={setSelectedId} 
          onRefetch={refetch}
        />

        {/* Derecha: Le pasamos SOLO el objeto de la cuadrilla seleccionada */}
        <CuadrillaDetails 
          cuadrilla={selectedCuadrilla} 
          onRefetch={refetch}
        />
      </div>
    </div>
  );
}

export default Cuadrillas;
