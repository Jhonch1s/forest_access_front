import { useState, useEffect } from 'react';
import Button from './Button';
import type { EmpleadoHabilitacionDTO, EmpleadoHabilitacionResponse } from '../types/empleado-habilitacion';
import type { Habilitacion } from '../types';
import { getHabilitaciones } from '../services/habilitacionService';
import { 
    obtenerHabilitacionesDeEmpleado,  
    createEmpleadoHabilitacion, 
    updateEmpleadoHabilitacion, 
    deleteEmpleadoHabilitacion } from '../services/empleadoHabilitacionService';

import "./EmpleadoHabilitacionesModal.css";

interface Props {
  empleadoId: number;
  empleadoNombre: string;
  open: boolean;
  onClose: () => void;
  onRefresh?: () => void; 
}

export default function EmpleadoHabilitacionesModal({ empleadoId, empleadoNombre, open, onClose, onRefresh }: Props) {
  const [habilitaciones, setHabilitaciones] = useState<EmpleadoHabilitacionResponse[]>([]);
  const [catalogoHabilitaciones, setCatalogoHabilitaciones] = useState<Habilitacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [newHabilitacionId, setNewHabilitacionId] = useState<number>(0);
  const [newFechaEmision, setNewFechaEmision] = useState('');
  const [newFechaVencimiento, setNewFechaVencimiento] = useState('');

  const [editing, setEditing] = useState<{ idHab: number; emision: string; vencimiento: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [habilitacionesEmpleado, todasHabilitaciones] = await Promise.all([
        obtenerHabilitacionesDeEmpleado(empleadoId),
        getHabilitaciones(),
      ]);
      setHabilitaciones(habilitacionesEmpleado);
      setCatalogoHabilitaciones(todasHabilitaciones);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && empleadoId) {
      loadData();
    }
  }, [open, empleadoId]);

  const handleCreate = async () => {
    if (!newHabilitacionId) {
      alert('Selecciona una habilitación');
      return;
    }
    if (!newFechaEmision || !newFechaVencimiento) {
      alert('Completa las fechas');
      return;
    }
    try {
      await createEmpleadoHabilitacion({
        idEmpleado: empleadoId,
        idHabilitacion: newHabilitacionId,
        fechaEmision: newFechaEmision,
        fechaVencimiento: newFechaVencimiento,
      });
      setShowForm(false);
      setNewHabilitacionId(0);
      setNewFechaEmision('');
      setNewFechaVencimiento('');
      await loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error al crear');
    }
  };

  const handleUpdate = async (idHab: number, emision: string, vencimiento: string) => {
    try {

        const dto: EmpleadoHabilitacionDTO = {
            idEmpleado: empleadoId,
            idHabilitacion: idHab,
            fechaEmision: emision,
            fechaVencimiento: vencimiento
        }
      await updateEmpleadoHabilitacion(empleadoId, idHab, dto);
      setEditing(null);
      await loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error al actualizar');
    }
  };

  const handleDelete = async (idHab: number) => {
    if (!confirm('¿Eliminar esta habilitación del empleado?')) return;
    try {
      await deleteEmpleadoHabilitacion(empleadoId, idHab);
      await loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Habilitaciones de {empleadoNombre}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {loading && <p>Cargando...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <>
              <div className="actions-bar">
                <Button variant="primary" size="small" onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancelar' : 'Agregar Habilitación'}
                </Button>
              </div>

              {showForm && (
                <div className="form-card">
                  <h3>Nueva habilitación</h3>
                  <div className="form-group">
                    <label>Habilitación</label>
                    <select value={newHabilitacionId} onChange={(e) => setNewHabilitacionId(Number(e.target.value))}>
                      <option value={0}>Seleccionar...</option>
                      {catalogoHabilitaciones.map(h => (
                        <option key={h.idHabilitacion} value={h.idHabilitacion}>{h.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Fecha Emisión</label>
                    <input type="date" value={newFechaEmision} onChange={(e) => setNewFechaEmision(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Fecha Vencimiento</label>
                    <input type="date" value={newFechaVencimiento} onChange={(e) => setNewFechaVencimiento(e.target.value)} />
                  </div>
                  <Button variant="primary" onClick={handleCreate}>Guardar</Button>
                </div>
              )}

              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Habilitación</th>
                      <th>Emisión</th>
                      <th>Vencimiento</th>
                      <th>Días restantes</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {habilitaciones.map((h) => (
                      <tr key={`${h.idEmpleado}-${h.idHabilitacion}`}>
                        {editing?.idHab === h.idHabilitacion ? (
                          <>
                            <td>{h.nombreHabilitacion}</td>
                            <td>
                              <input type="date" value={editing.emision} onChange={(e) => setEditing({ ...editing, emision: e.target.value })} />
                            </td>
                            <td>
                              <input type="date" value={editing.vencimiento} onChange={(e) => setEditing({ ...editing, vencimiento: e.target.value })} />
                            </td>
                            <td>
                              <Button variant="secondary" size="small" onClick={() => handleUpdate(h.idHabilitacion, editing.emision, editing.vencimiento)}>Guardar</Button>
                              <Button variant="danger" size="small" onClick={() => setEditing(null)}>Cancelar</Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{h.nombreHabilitacion}</td>
                            <td>{h.fechaEmision}</td>
                            <td>{h.fechaVencimiento}</td>

                            <td>
                              <Button variant="secondary" size="small" onClick={() => setEditing({ idHab: h.idHabilitacion, emision: h.fechaEmision, vencimiento: h.fechaVencimiento })}>Editar</Button>
                              <Button variant="danger" size="small" onClick={() => handleDelete(h.idHabilitacion)}>Eliminar</Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}