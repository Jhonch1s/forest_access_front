import type { Campo } from '../types/predio';
import Button from './Button';
import './CampoSelector.css';

interface CampoSelectorProps {
  campos: Campo[];
  campoActualId: number | null;
  onSelect: (campo: Campo) => void;
  onCrearNuevo: () => void;
  onClose: () => void;
}

function CampoSelector({ campos, campoActualId, onSelect, onCrearNuevo, onClose }: CampoSelectorProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content campo-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Seleccionar Campo</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="campo-selector-body">
          {campos.length === 0 ? (
            <div className="campo-selector-empty">
              <p>No hay campos registrados.</p>
            </div>
          ) : (
            <ul className="campo-selector-list">
              {campos.map((campo) => (
                <li key={campo.idCampo}>
                  <button
                    className={`campo-selector-item ${campo.idCampo === campoActualId ? 'active' : ''}`}
                    onClick={() => onSelect(campo)}
                  >
                    <span className="campo-selector-name">{campo.nombre}</span>
                    <span className="campo-selector-meta">
                      {campo.padron && `P: ${campo.padron} · `}{campo.superficieTotal} ha
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="campo-selector-footer">
          <Button variant="primary" onClick={onCrearNuevo}>
            + Crear Nuevo Campo
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CampoSelector;
