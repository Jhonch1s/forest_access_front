import type { Rodal, Parcela } from '../types/predio';
import Button from './Button';
import './RodalCard.css';

interface RodalCardProps {
  rodal: Rodal;
  parcelas: Parcela[];
  expandido: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddParcela: () => void;
  onEditParcela: (parcela: Parcela) => void;
  onDeleteParcela: (parcela: Parcela) => void;
}

function RodalCard({
  rodal,
  parcelas,
  expandido,
  onToggle,
  onEdit,
  onDelete,
  onAddParcela,
  onEditParcela,
  onDeleteParcela,
}: RodalCardProps) {
  const totalAreaParcelas = parcelas.reduce((sum, p) => sum + p.area, 0);

  return (
    <div className={`rodal-card ${expandido ? 'expanded' : ''}`}>
      <div className="rodal-card-header" onClick={onToggle}>
        <div className="rodal-card-info">
          <div className="rodal-card-title-row">
            <span className={`rodal-expand-icon ${expandido ? 'rotated' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <h4>{rodal.nombre}</h4>
            <span className="rodal-parcela-count">
              {parcelas.length} parcela{parcelas.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="rodal-card-meta">
            <span>{rodal.area} ha totales</span>
            {parcelas.length > 0 && <span>· {totalAreaParcelas.toFixed(2)} ha en parcelas</span>}
          </div>
        </div>
        <div className="rodal-card-actions" onClick={(e) => e.stopPropagation()}>
          <Button variant="secondary" size="small" onClick={onEdit}>
            Editar
          </Button>
          <Button variant="danger" size="small" onClick={onDelete}>
            Eliminar
          </Button>
        </div>
      </div>

      <div className="rodal-card-body-wrapper">
        <div className="rodal-card-body">
          <div className="rodal-card-body-header">
            <span className="rodal-card-body-title">Parcelas</span>
            <Button variant="primary" size="small" onClick={onAddParcela}>
              + Parcela
            </Button>
          </div>

          {parcelas.length === 0 ? (
            <div className="rodal-card-empty">
              <p>No hay parcelas en este rodal.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="parcela-table-container">
                <table className="table parcela-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Cultivo</th>
                      <th>Plantación</th>
                      <th>Área</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parcelas.map((parcela, i) => (
                      <tr key={parcela.idParcela} style={{ animationDelay: `${i * 40}ms` }}>
                        <td>{parcela.nombre}</td>
                        <td>{parcela.tipoCultivo}</td>
                        <td>{parcela.anioPlantacion}</td>
                        <td>{parcela.area} ha</td>
                        <td className="parcela-actions">
                          <Button variant="secondary" size="small" onClick={() => onEditParcela(parcela)}>
                            Editar
                          </Button>
                          <Button variant="danger" size="small" onClick={() => onDeleteParcela(parcela)}>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="parcela-cards">
                {parcelas.map((parcela, i) => (
                  <div key={parcela.idParcela} className="parcela-card" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="parcela-card-header">
                      <span className="parcela-card-name">{parcela.nombre}</span>
                      <span className="parcela-card-area">{parcela.area} ha</span>
                    </div>
                    <div className="parcela-card-body">
                      <div className="parcela-card-field">
                        <span className="parcela-card-label">Cultivo</span>
                        <span className="parcela-card-value">{parcela.tipoCultivo}</span>
                      </div>
                      <div className="parcela-card-field">
                        <span className="parcela-card-label">Plantación</span>
                        <span className="parcela-card-value">{parcela.anioPlantacion}</span>
                      </div>
                    </div>
                    <div className="parcela-card-actions">
                      <Button variant="secondary" size="small" onClick={() => onEditParcela(parcela)}>
                        Editar
                      </Button>
                      <Button variant="danger" size="small" onClick={() => onDeleteParcela(parcela)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RodalCard;
