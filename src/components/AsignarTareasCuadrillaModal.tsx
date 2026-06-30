import { useState, useEffect } from 'react';
import type { AsignacionTratamientoResponse } from '../types/asignacion-tratamiento';
import type { CatalogoTareaResponse } from '../types/tarea';
import { getAsignaciones } from '../services/asignacionTratamientoService';
import { getCatalogoTareas } from '../services/catalogoTareaService';
import { createTareaAsignada } from '../services/tareaAsignadaService';
import Button from './Button';
import './AsignarTareasCuadrillaModal.css';

interface AsignarTareasCuadrillaModalProps {
  idCuadrilla: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AsignarTareasCuadrillaModal({ idCuadrilla, onClose, onSuccess }: AsignarTareasCuadrillaModalProps) {
  const [asignaciones, setAsignaciones] = useState<AsignacionTratamientoResponse[]>([]);
  const [catalogos, setCatalogos] = useState<CatalogoTareaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [idCampoSeleccionado, setIdCampoSeleccionado] = useState<string>('');
  const [idRodalSeleccionado, setIdRodalSeleccionado] = useState<string>('');
  const [idAsignacionSeleccionada, setIdAsignacionSeleccionada] = useState<string>('');
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState<Set<number>>(new Set());
  const [fechaLimite, setFechaLimite] = useState<string>(
    (() => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().split('T')[0];
    })()
  );
  const [descripcion, setDescripcion] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [asignacionesData, catalogosData] = await Promise.all([
          getAsignaciones(),
          getCatalogoTareas()
        ]);
        
        //solo mostramos las asignaciones que están planificadas o en ejecución
        const asignacionesActivas = asignacionesData.filter(
          a => a.estado === 'PLANIFICADO' || a.estado === 'EN_EJECUCION'
        );
        
        setAsignaciones(asignacionesActivas);
        setCatalogos(catalogosData);
      } catch (err) {
        console.error("Error al cargar datos del modal:", err);
        setError("Error al cargar la información requerida.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Derivar listas únicas de campos y rodales
  const camposUnicos = Array.from(new Map(
    asignaciones.map(a => [a.idCampo, { id: a.idCampo, nombre: a.nombreCampo }])
  ).values());

  const rodalesUnicos = Array.from(new Map(
    asignaciones
      .filter(a => a.idCampo === Number(idCampoSeleccionado))
      .map(a => [a.idRodal, { id: a.idRodal, nombre: a.nombreRodal }])
  ).values());

  const parcelasFiltradas = asignaciones.filter(a => a.idRodal === Number(idRodalSeleccionado));

  const handleToggleTarea = (id: number) => {
    setTareasSeleccionadas(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (tareasSeleccionadas.size === catalogos.length) {
      setTareasSeleccionadas(new Set());
    } else {
      setTareasSeleccionadas(new Set(catalogos.map(c => c.idCatalogoTarea)));
    }
  };

  const handleSubmit = async () => {
    if (!idAsignacionSeleccionada) {
      setError("Debes seleccionar una parcela (asignación).");
      return;
    }
    if (tareasSeleccionadas.size === 0) {
      setError("Debes seleccionar al menos una tarea del catálogo.");
      return;
    }
    if (!fechaLimite) {
      setError("Debes indicar una fecha límite.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const idAsignacionNum = Number(idAsignacionSeleccionada);
      
      // Crear una TareaAsignada por cada tarea del catálogo seleccionada
      const promesas = Array.from(tareasSeleccionadas).map(idCatalogoTarea => 
        createTareaAsignada({
          idAsignacion: idAsignacionNum,
          idCuadrilla,
          idCatalogoTarea,
          descripcion,
          fechaLimite
        })
      );

      await Promise.all(promesas);
      onSuccess();
    } catch (err: unknown) {
      console.error("Error al asignar tareas:", err);
      setError("Ocurrió un error al intentar asignar las tareas. Es posible que algunas ya estuvieran asignadas.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="asignar-tareas-modal-overlay">
        <div className="asignar-tareas-modal" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="asignar-tareas-modal-overlay" onClick={onClose}>
      <div className="asignar-tareas-modal" onClick={e => e.stopPropagation()}>
        <div className="asignar-tareas-modal-header">
          <h2>Asignar Tareas a Cuadrilla</h2>
          <button className="asignar-tareas-close-btn" onClick={onClose} aria-label="Cerrar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="asignar-tareas-modal-content">
          {error && <div className="input-error-message" style={{ display: 'block', padding: '10px', backgroundColor: 'rgba(231, 76, 60, 0.1)', borderRadius: '4px' }}>{error}</div>}

          <div className="asignar-tareas-section-group">
            <div className="asignar-tareas-section">
              <label htmlFor="select-campo">Campo *</label>
              <select 
                id="select-campo"
                className="asignar-tareas-select"
                value={idCampoSeleccionado}
                onChange={(e) => {
                  setIdCampoSeleccionado(e.target.value);
                  setIdRodalSeleccionado('');
                  setIdAsignacionSeleccionada('');
                }}
              >
                <option value="" disabled>Selecciona un campo...</option>
                {camposUnicos.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {asignaciones.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--status-error)' }}>
                  No hay parcelas con tratamientos activos.
                </span>
              )}
            </div>

            {idCampoSeleccionado && (
              <div className="asignar-tareas-section">
                <label htmlFor="select-rodal">Rodal *</label>
                <select 
                  id="select-rodal"
                  className="asignar-tareas-select"
                  value={idRodalSeleccionado}
                  onChange={(e) => {
                    setIdRodalSeleccionado(e.target.value);
                    setIdAsignacionSeleccionada('');
                  }}
                >
                  <option value="" disabled>Selecciona un rodal...</option>
                  {rodalesUnicos.map(r => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {idRodalSeleccionado && (
              <div className="asignar-tareas-section">
                <label htmlFor="select-asignacion">Parcela en Tratamiento *</label>
                <select 
                  id="select-asignacion"
                  className="asignar-tareas-select"
                  value={idAsignacionSeleccionada}
                  onChange={(e) => setIdAsignacionSeleccionada(e.target.value)}
                >
                  <option value="" disabled>Selecciona una parcela...</option>
                  {parcelasFiltradas.map(a => (
                    <option key={a.idAsignacion} value={a.idAsignacion}>
                      {a.nombreParcela} — Trat: {a.nombreTratamiento}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="asignar-tareas-row-inline">
            <div className="asignar-tareas-section">
              <label htmlFor="input-fecha">Fecha Límite *</label>
              <input 
                id="input-fecha"
                type="date" 
                className="asignar-tareas-input"
                value={fechaLimite}
                onChange={e => setFechaLimite(e.target.value)}
              />
            </div>
            <div className="asignar-tareas-section">
              <label htmlFor="input-desc">Descripción General (Opcional)</label>
              <input 
                id="input-desc"
                type="text" 
                className="asignar-tareas-input"
                placeholder="Ej. Realizar en horario matutino..."
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
              />
            </div>
          </div>

          <div className="asignar-tareas-section">
            <label>Tareas a Asignar ({tareasSeleccionadas.size} seleccionadas) *</label>
            <div className="asignar-tareas-table-wrapper">
              <table className="asignar-tareas-table">
                <thead>
                  <tr>
                    <th className="asignar-tareas-checkbox-cell">
                      <input 
                        type="checkbox" 
                        className="asignar-tareas-checkbox"
                        checked={catalogos.length > 0 && tareasSeleccionadas.size === catalogos.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Tarea (Catálogo)</th>
                    <th>Requisito</th>
                  </tr>
                </thead>
                <tbody>
                  {catalogos.map(cat => (
                    <tr 
                      key={cat.idCatalogoTarea} 
                      className={tareasSeleccionadas.has(cat.idCatalogoTarea) ? 'selected' : ''}
                      onClick={() => handleToggleTarea(cat.idCatalogoTarea)}
                    >
                      <td className="asignar-tareas-checkbox-cell">
                        <input 
                          type="checkbox" 
                          className="asignar-tareas-checkbox"
                          checked={tareasSeleccionadas.has(cat.idCatalogoTarea)}
                          onChange={() => handleToggleTarea(cat.idCatalogoTarea)}
                          onClick={e => e.stopPropagation()}
                        />
                      </td>
                      <td>
                        <span className="asignar-tareas-task-name">{cat.nombre}</span>
                        {cat.descripcion && <span className="asignar-tareas-task-desc">{cat.descripcion}</span>}
                      </td>
                      <td>
                        {cat.idHabilitacion ? (
                          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                            Req: {cat.nombreHabilitacion}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ninguno</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {catalogos.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center' }}>No hay tareas en el catálogo.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div className="asignar-tareas-modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'text-bottom' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Confirmar Asignación
          </Button>
        </div>
      </div>
    </div>
  );
}
