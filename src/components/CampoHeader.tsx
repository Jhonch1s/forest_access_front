import type { Campo, Parcela } from '../types/predio';
import Button from './Button';
import SatelliteMap from './SatelliteMap';
import './CampoHeader.css';

interface CampoHeaderProps {
  campo: Campo | null;
  onEdit: () => void;
  onDelete: () => void;
  onChangeCampo: () => void;
  onCrearCampo: () => void;
  parcelaSeleccionada?: Parcela | null;
}

function CampoHeader({ campo, onEdit, onDelete, onChangeCampo, onCrearCampo, parcelaSeleccionada }: CampoHeaderProps) {
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 16, height: 16, marginRight: 6}}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Crear Primer Campo
        </Button>
      </div>
    );
  }

  const currentLat = parcelaSeleccionada ? parcelaSeleccionada.coordLat : campo.coordLat;
  const currentLng = parcelaSeleccionada ? parcelaSeleccionada.coordLng : campo.coordLng;
  const currentNombre = parcelaSeleccionada ? parcelaSeleccionada.nombre : campo.nombre;
  const hasCoords = campo.coordLat !== 0 && campo.coordLng !== 0;
  const showMap = currentLat !== 0 && currentLng !== 0;

  return (
    <div className="campo-hero">
      <div className="campo-hero-content">
        <div className="campo-hero-info">
          <div className="campo-hero-top">
            <h2 className="campo-hero-title">{campo.nombre}</h2>
            <button className="campo-change-btn" onClick={onChangeCampo}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 4, verticalAlign: 'middle'}}><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Editar
            </Button>
            <Button variant="danger" size="small" onClick={onDelete}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Eliminar
            </Button>
          </div>

          {parcelaSeleccionada && (
            <div className="campo-hero-parcela-selected" style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--forest-accent)' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--forest-accent)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6, verticalAlign: 'middle'}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Parcela Seleccionada: {parcelaSeleccionada.nombre}
              </h4>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', opacity: 0.7 }}>Superficie</strong>
                  {parcelaSeleccionada.area} ha
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', opacity: 0.7 }}>Cultivo</strong>
                  {parcelaSeleccionada.tipoCultivo}
                </div>
                {parcelaSeleccionada.coordLat !== 0 && (
                  <div>
                    <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', opacity: 0.7 }}>Coordenadas</strong>
                    {parcelaSeleccionada.coordLat.toFixed(6)}, {parcelaSeleccionada.coordLng.toFixed(6)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {showMap && (
          <div className="campo-hero-map">
            <SatelliteMap
              lat={currentLat}
              lng={currentLng}
              nombre={currentNombre}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CampoHeader;
