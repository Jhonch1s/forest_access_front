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
  onBuscarParcela: (parcela: Parcela) => void;
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
  onBuscarParcela,
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Editar
          </Button>
          <Button variant="danger" size="small" onClick={onDelete}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Eliminar
          </Button>
        </div>
      </div>

      <div className="rodal-card-body-wrapper">
        <div className="rodal-card-body">
          <div className="rodal-card-body-header">
            <span className="rodal-card-body-title">Parcelas</span>
            <Button variant="primary" size="small" onClick={onAddParcela}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Parcela
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
                          <Button variant="secondary" size="small" onClick={() => onBuscarParcela(parcela)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            Buscar parcela
                          </Button>
                          <Button variant="secondary" size="small" onClick={() => onEditParcela(parcela)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Editar
                          </Button>
                          <Button variant="danger" size="small" onClick={() => onDeleteParcela(parcela)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
                      <Button variant="secondary" size="small" onClick={() => onBuscarParcela(parcela)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        Buscar parcela
                      </Button>
                      <Button variant="secondary" size="small" onClick={() => onEditParcela(parcela)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Editar
                      </Button>
                      <Button variant="danger" size="small" onClick={() => onDeleteParcela(parcela)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
