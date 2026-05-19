import { useState } from 'react';
import type { CuadrillaUI } from '../hooks/useCuadrillas';
import { terminarCuadrilla } from '../services/cuadrillaService';
import ConfirmModal from './ConfirmModal';
import './CuadrillaList.css';

// Ahora el hijo recibe todo por Props desde el Padre
interface CuadrillaListProps {
  cuadrillas: CuadrillaUI[];
  loading: boolean;
  error: string | null;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onRefetch: () => void;
}

export default function CuadrillaList({ cuadrillas, loading, error, selectedId, onSelect, onRefetch }: CuadrillaListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Evitar que seleccione la tarjeta
    setDeletingId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await terminarCuadrilla(deletingId);
      setModalOpen(false);
      onRefetch(); // Recargar datos
      if (selectedId === deletingId) {
        onSelect(0); // Deseleccionar
      }
    } catch (err) {
      console.error(err);
      alert("Error al terminar cuadrilla");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };
  
  if (loading) {
    return <div className="cuadrilla-list-pane"><p>Cargando cuadrillas...</p></div>;
  }

  if (error) {
    return <div className="cuadrilla-list-pane"><p style={{color: 'red'}}>Error: {error}</p></div>;
  }

  return (
    <div className="cuadrilla-list-pane">
      {cuadrillas.map((cuadrilla) => (
        <div 
          key={cuadrilla.idCuadrilla} 
          className={`cuadrilla-card ${selectedId === cuadrilla.idCuadrilla ? 'selected' : ''}`}
          onClick={() => onSelect(cuadrilla.idCuadrilla)}
        >   
          <div className="cuadrilla-card-header">
              <h3 className="cuadrilla-title">{cuadrilla.nombre}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`status-badge ${cuadrilla.activa ? 'active' : 'inactive'}`}>
                    {cuadrilla.activa ? 'Activa' : 'Inactiva'}
                </span>
                
                {cuadrilla.activa && (
                  <button 
                    className="icon-button danger-hover" 
                    onClick={(e) => handleDeleteClick(e, cuadrilla.idCuadrilla)}
                    title="Terminar Cuadrilla"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '4px', color: 'var(--text-secondary)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                )}
                <span className="chevron">›</span>
              </div>
          </div>
          
          <div className="cuadrilla-card-info">
              <p>Puntero: {cuadrilla.puntero}</p>
              <p className="miembros-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                {/* Ahora miembros es un array, así que pedimos su longitud (.length) */}
                {cuadrilla.miembros.length} miembros
              </p>
          </div>
        </div>
      ))}

      <ConfirmModal 
        isOpen={modalOpen}
        title="Terminar Cuadrilla"
        message="¿Estás seguro que deseas terminar esta cuadrilla? Pasará a inactiva y dejará a todos sus miembros liberados."
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}
