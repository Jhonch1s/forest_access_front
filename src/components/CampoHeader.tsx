import type { Campo } from '../types/predio';
import Button from './Button';
import SatelliteMap from './SatelliteMap';
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
      <div className="campo-hero campo-hero-empty">
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

  const hasCoords = campo.coordLat !== 0 && campo.coordLng !== 0;

  return (
    <div className="campo-hero">
      <div className="campo-hero-content">
        <div className="campo-hero-info">
          <div className="campo-hero-top">
            <h2 className="campo-hero-title">{campo.nombre}</h2>
            <button className="campo-change-btn" onClick={onChangeCampo}>
              Cambiar campo
            </button>
          </div>

          <div className="campo-hero-details">
            {campo.padron && (
              <div className="campo-hero-stat">
                <span className="campo-stat-label">Padrón</span>
                <span className="campo-stat-value">{campo.padron}</span>
              </div>
            )}
            <div className="campo-hero-stat">
              <span className="campo-stat-label">Superficie</span>
              <span className="campo-stat-value">{campo.superficieTotal} ha</span>
            </div>
            {hasCoords && (
              <div className="campo-hero-stat">
                <span className="campo-stat-label">Coordenadas</span>
                <span className="campo-stat-value">
                  {campo.coordLat.toFixed(8)}, {campo.coordLng.toFixed(8)}
                </span>
              </div>
            )}
          </div>

          <div className="campo-hero-actions">
            <Button variant="secondary" size="small" onClick={onEdit}>
              Editar
            </Button>
            <Button variant="danger" size="small" onClick={onDelete}>
              Eliminar
            </Button>
          </div>
        </div>

        {hasCoords && (
          <div className="campo-hero-map">
            <SatelliteMap
              lat={campo.coordLat}
              lng={campo.coordLng}
              nombre={campo.nombre}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CampoHeader;
