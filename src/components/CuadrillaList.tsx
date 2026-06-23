import { useState } from 'react';
import type { CuadrillaUI } from '../hooks/useCuadrillas';
import { terminarCuadrilla, deleteCuadrilla, reactivarCuadrilla } from '../services/cuadrillaService';
import ConfirmModal from './ConfirmModal';
import './CuadrillaList.css';

interface CuadrillaListProps {
  cuadrillas: CuadrillaUI[];
  loading: boolean;
  error: string | null;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onRefetch: () => void;
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (nuevaPagina: number) => void;
}

export default function CuadrillaList({ 
  cuadrillas, 
  loading, 
  error, 
  selectedId, 
  onSelect, 
  onRefetch,
  paginaActual,
  totalPaginas,
  onCambiarPagina 
}: CuadrillaListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteAction, setDeleteAction] = useState<'terminar' | 'eliminar' | 'reactivar'>('terminar');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, id: number, action: 'terminar' | 'eliminar' | 'reactivar') => {
    e.stopPropagation();
    setDeletingId(id);
    setDeleteAction(action);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      if (deleteAction === 'terminar') {
        await terminarCuadrilla(deletingId);
      } else if (deleteAction === 'reactivar') {
        await reactivarCuadrilla(deletingId);
      } else {
        await deleteCuadrilla(deletingId);
      }
      setModalOpen(false);
      onRefetch();
      if (selectedId === deletingId) {
        onSelect(0);
      }
    } catch (err: any) {
      console.error(err);
      if (deleteAction === 'reactivar' && err.response?.status === 409) {
        const msg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response?.data : "Algunos empleados ya están activos en otras cuadrillas. Edita esta cuadrilla para removerlos antes de recuperar.");
        setErrorMsg(msg);
      } else if (deleteAction === 'eliminar' && err.response?.status === 500) {
        setErrorMsg("No se puede eliminar permanentemente esta cuadrilla porque ya tiene historial de miembros o tareas asociadas en la base de datos. Para estos casos, ya está inactiva y debe permanecer así por cuestiones de registro.");
      } else {
        alert(deleteAction === 'terminar' ? "Error al terminar cuadrilla" : (deleteAction === 'reactivar' ? "Error al recuperar cuadrilla" : "Error al eliminar cuadrilla"));
      }
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };
  
  if (loading) {
    return (
      <div className="cuadrilla-list-status">
        <div className="cuadrilla-spinner" />
        <p>Cargando cuadrillas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cuadrilla-list-status cuadrilla-list-error">
        <p>Error al cargar cuadrillas: {error}</p>
      </div>
    );
  }

  return (
    <div className="cuadrilla-list-pane">
      <div className="cuadrilla-list-scrollable">
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
                  
                  {cuadrilla.activa ? (
                    <button 
                      className="delete-btn" 
                      onClick={(e) => handleDeleteClick(e, cuadrilla.idCuadrilla, 'terminar')}
                      title="Terminar Cuadrilla"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Finalizar
                    </button>
                  ) : (
                    <>
                      <button 
                        className="delete-btn" 
                        onClick={(e) => handleDeleteClick(e, cuadrilla.idCuadrilla, 'reactivar')}
                        title="Recuperar Cuadrilla"
                        style={{ color: 'var(--forest-primary, #059669)' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1 4 1 10 7 10"></polyline>
                          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                        Recuperar
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={(e) => handleDeleteClick(e, cuadrilla.idCuadrilla, 'eliminar')}
                        title="Eliminar Cuadrilla"
                        style={{ color: '#ef4444' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        Eliminar
                      </button>
                    </>
                  )}
                  <span className="chevron">›</span>
                </div>
            </div>
            
            <div className="cuadrilla-card-info">
                <p>Haz clic para ver los detalles y miembros.</p>
            </div>
          </div>
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="cuadrilla-pagination">
          <button 
            onClick={() => onCambiarPagina(paginaActual - 1)} 
            disabled={paginaActual === 1}
            className="pagination-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Anterior
          </button>
          
          <span className="pagination-info">
            Página {paginaActual} de {totalPaginas}
          </span>
          
          <button 
            onClick={() => onCambiarPagina(paginaActual + 1)} 
            disabled={paginaActual === totalPaginas}
            className="pagination-btn"
          >
            Siguiente
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      )}

      <ConfirmModal 
        isOpen={modalOpen}
        title={deleteAction === 'terminar' ? "Terminar Cuadrilla" : (deleteAction === 'reactivar' ? "Recuperar Cuadrilla" : "Eliminar Cuadrilla")}
        message={deleteAction === 'terminar' 
          ? "¿Estás seguro que deseas terminar esta cuadrilla? Pasará a inactiva y dejará a todos sus miembros liberados."
          : (deleteAction === 'reactivar' 
            ? "¿Estás seguro que deseas recuperar esta cuadrilla? Pasará a estar activa de nuevo." 
            : "¿Estás seguro que deseas eliminar permanentemente esta cuadrilla? Esta acción no se puede deshacer.")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalOpen(false)}
        isLoading={isDeleting}
      />

      {errorMsg && (
        <div className="modal-overlay" onClick={() => setErrorMsg(null)} style={{ zIndex: 1000 }}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <h3 style={{ color: 'var(--status-error)' }}>No se pudo realizar la acción</h3>
            <p style={{ marginTop: '12px', marginBottom: '24px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
              {errorMsg}
            </p>
            <div className="confirm-modal-actions" style={{ justifyContent: 'center' }}>
              <button 
                className="button button-primary" 
                onClick={() => setErrorMsg(null)}
                style={{ width: '100%' }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
