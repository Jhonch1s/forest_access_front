import type { Campo } from '../types/predio';
import Button from './Button';
import './CampoHeader.css';

interface CampoHeaderProps {
  campo: Campo | null;
  onEdit: () => void;
  onDelete: () => void;
  onChangeCampo: () => void;
  onCrearCampo: () => void;
}

function CampoHeader({ campo, onEdit, onDelete, onChangeCampo, onCrearCampo }: CampoHeaderProps) {
  if (!campo) {
    return (
      <div className="campo-header campo-header-empty">
        <div className="campo-empty-icon">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M32 4L12 28h8l-6 14h8l-6 14h36l-6-14h8l-6-14h8L32 4z"
              fill="rgba(34, 255, 216, 0.2)"
              stroke="#22ffd8"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <rect x="28" y="52" width="8" height="8" rx="1" fill="#22ffd8" opacity="0.6" />
          </svg>
        </div>
        <h3>No hay campos registrados</h3>
        <p>Creá tu primer campo para comenzar a gestionar rodales y parcelas.</p>
        <Button variant="primary" onClick={onCrearCampo}>
          + Crear Primer Campo
        </Button>
      </div>
    );
  }

  return (
    <div className="campo-header">
      <div className="campo-header-info">
        <div className="campo-header-top">
          <h3>{campo.nombre}</h3>
          <button className="campo-change-btn" onClick={onChangeCampo}>
            Cambiar campo
          </button>
        </div>
        <div className="campo-header-details">
          {campo.padron && (
            <span className="campo-detail">
              <span className="campo-detail-label">Padrón:</span> {campo.padron}
            </span>
          )}
          <span className="campo-detail">
            <span className="campo-detail-label">Superficie:</span> {campo.superficieTotal} ha
          </span>
          {campo.coordLat !== 0 && campo.coordLng !== 0 && (
            <span className="campo-detail">
              <span className="campo-detail-label">Coords:</span> {campo.coordLat}, {campo.coordLng}
            </span>
          )}
        </div>
      </div>
      <div className="campo-header-actions">
        <Button variant="secondary" size="small" onClick={onEdit}>
          Editar
        </Button>
        <Button variant="danger" size="small" onClick={onDelete}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}

export default CampoHeader;
