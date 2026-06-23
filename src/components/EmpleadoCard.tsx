import { useState } from 'react';
import type { EmpleadoDTO, EmpleadoResponse } from '../types/empleado';
import type { EmpleadoHabilitacionDTO, EmpleadoHabilitacionResponse } from '../types/empleado-habilitacion';
import { obtenerHabilitacionesDeEmpleado } from '../services/empleadoHabilitacionService';
import Button from './Button';
import './EmpleadoCard.css';

interface EmpleadoCardProps {
  empleado: EmpleadoResponse;
  onEdit: (empleado: EmpleadoDTO) => void;
  onDelete: (empleado: EmpleadoDTO) => void;
  onEditHab: (habilitacion: EmpleadoHabilitacionDTO) => void;
  onDeleteHab: (habilitacion: EmpleadoHabilitacionDTO) => void;
  onCreateHab: (idEmpleado: number) => void;
}

const formatearFecha = (fecha: string): string => {
  if (!fecha) return '—';
  const partes = fecha.split(' ')[0].split('-');
  if (partes.length !== 3) return fecha;
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
};

const getDiasRestantes = (fechaVencimiento: string): number => {
  if (!fechaVencimiento) return Infinity;
  const [year, month, day] = fechaVencimiento.split(' ')[0].split('-').map(Number);
  const vencimiento = new Date(year, month - 1, day);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.floor((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
};

const getHabStatusClass = (fechaVencimiento: string): string => {
  const dias = getDiasRestantes(fechaVencimiento);
  if (dias < 0) return 'hab-vencida';
  if (dias <= 15) return 'hab-proximo-vencer';
  return '';
};

const getEmpleadoStatusClass = (diasRestantes?: number | null): string => {
  if (diasRestantes === null || diasRestantes === undefined) return '';
  if (diasRestantes < 0) return 'empleado-vencido';
  if (diasRestantes <= 15) return 'empleado-proximo-vencer';
  return '';
};

function EmpleadoCard({ empleado, onEdit, onDelete, onEditHab, onDeleteHab, onCreateHab }: EmpleadoCardProps) {
  const [habilitaciones, setHabilitaciones] = useState<EmpleadoHabilitacionResponse[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [expandido, setExpandido] = useState(false);

  const toggleExpandir = async () => {
    if (!expandido && !loaded) {
      try {
        const data = await obtenerHabilitacionesDeEmpleado(empleado.idEmpleado);
        setHabilitaciones(data);
        setLoaded(true);
      } catch (err) {
        console.error(err);
      }
    }
    setExpandido(prev => !prev);
  };

  const statusClass = getEmpleadoStatusClass(empleado.diasRestantes);

  return (
    <div className={`empleado-card ${statusClass} ${expandido ? 'expanded' : ''}`}>
      <div className="empleado-card-header" onClick={toggleExpandir}>
        <div className="empleado-card-info">
          <div className="empleado-card-title-row">
            <span className={`empleado-expand-icon ${expandido ? 'rotated' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <h4>{empleado.nombre}</h4>
            <span className={`empleado-status-badge ${empleado.activo ? 'activo' : 'inactivo'}`}>
              {empleado.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div className="empleado-card-meta">
            <span>C.I. {empleado.cedula}</span>
            <span>·</span>
            <span>{empleado.nombreCategoria}</span>
            <span>·</span>
            <span>{empleado.email}</span>
          </div>
        </div>
        <div className="empleado-card-actions" onClick={(e) => e.stopPropagation()}>
          <Button variant="secondary" size="small" onClick={() => onEdit(empleado)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Editar
          </Button>
          <Button variant="danger" size="small" onClick={() => onDelete(empleado)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Eliminar
          </Button>
        </div>
      </div>

      <div className="empleado-card-body-wrapper">
        <div className="empleado-card-body">
          <div className="empleado-card-body-header">
            <span className="empleado-card-body-title">Habilitaciones</span>
            <Button variant="primary" size="small" onClick={() => onCreateHab(empleado.idEmpleado)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Nueva
            </Button>
          </div>

          {(!loaded || habilitaciones.length === 0) ? (
            <div className="empleado-card-empty">
              <p>{loaded ? 'No hay habilitaciones registradas.' : 'Cargando habilitaciones...'}</p>
            </div>
          ) : (
            <>
              <div className="habilitacion-table-container">
                <table className="table habilitacion-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Emisión</th>
                      <th>Vencimiento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {habilitaciones.map((hab, i) => {
                      const habStatus = getHabStatusClass(hab.fechaVencimiento);
                      return (
                      <tr key={hab.idHabilitacion} className={habStatus} style={{ animationDelay: `${i * 40}ms` }}>
                        <td>{hab.nombreHabilitacion}</td>
                        <td>{formatearFecha(hab.fechaEmision)}</td>
                        <td>{formatearFecha(hab.fechaVencimiento)}</td>
                        <td className="hab-actions">
                          <Button variant="secondary" size="small" onClick={() => onEditHab(hab)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Editar
                          </Button>
                          <Button variant="danger" size="small" onClick={() => onDeleteHab(hab)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6}}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    );})}
                  </tbody>
                </table>
              </div>

              <div className="habilitacion-cards">
                {habilitaciones.map((hab) => {
                  const habStatus = getHabStatusClass(hab.fechaVencimiento);
                  return (
                  <div key={hab.idHabilitacion} className={`habilitacion-card ${habStatus}`}>
                    <div className="habilitacion-card-header">
                      <span className="habilitacion-card-name">{hab.nombreHabilitacion}</span>
                    </div>
                    <div className="habilitacion-card-body">
                      <div className="habilitacion-card-field">
                        <span className="habilitacion-card-label">Emisión</span>
                        <span className="habilitacion-card-value">{formatearFecha(hab.fechaEmision)}</span>
                      </div>
                      <div className="habilitacion-card-field">
                        <span className="habilitacion-card-label">Vencimiento</span>
                        <span className="habilitacion-card-value">{formatearFecha(hab.fechaVencimiento)}</span>
                      </div>
                    </div>
                    <div className="habilitacion-card-actions">
                      <Button variant="secondary" size="small" onClick={() => onEditHab(hab)}>Editar</Button>
                      <Button variant="danger" size="small" onClick={() => onDeleteHab(hab)}>Eliminar</Button>
                    </div>
                  </div>
                );})}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmpleadoCard;
