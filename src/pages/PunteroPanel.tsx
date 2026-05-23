import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getEmpleadosCuadrillas } from '../services/empleadoCuadrillaService';
import { getAsignaciones } from '../services/asignacionTratamientoService';
import { getTareas, createTarea } from '../services/tareaService';
import { getCatalogoTareas } from '../services/catalogoTareaService';
import { getEstados } from '../services/estadoService';
import Button from '../components/Button';
import type { EmpleadoCuadrillaResponse } from '../types/empleado-cuadrilla';
import type { AsignacionTratamientoResponse } from '../types/asignacion-tratamiento';
import type { TareaResponse, TareaDTO, CatalogoTareaResponse, EstadoDTO } from '../types/tarea';
import './PunteroPanel.css';

type Vista = 'parcelas' | 'tareas';

function getBadgeClass(estado: string): string {
  switch (estado) {
    case 'PENDIENTE': return 'badge-pendiente';
    case 'PLANIFICADO': return 'badge-planificado';
    case 'EN_EJECUCION': return 'badge-en-ejecucion';
    case 'COMPLETADO': return 'badge-completado';
    case 'CANCELADO': return 'badge-cancelado';
    default: return 'badge-pendiente';
  }
}

function getInitials(nombre: string): string {
  const parts = nombre.trim().split(' ');
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0][0] + (parts[0][1] || '')).toUpperCase();
}

function PunteroPanel() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [miCuadrilla, setMiCuadrilla] = useState<EmpleadoCuadrillaResponse | null>(null);
  const [miembros, setMiembros] = useState<EmpleadoCuadrillaResponse[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionTratamientoResponse[]>([]);
  const [tareas, setTareas] = useState<TareaResponse[]>([]);
  const [catalogos, setCatalogos] = useState<CatalogoTareaResponse[]>([]);
  const [estados, setEstados] = useState<EstadoDTO[]>([]);

  const [vista, setVista] = useState<Vista>('parcelas');
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState<AsignacionTratamientoResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formTouched, setFormTouched] = useState(false);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [form, setForm] = useState({
    idCatalogoTarea: '',
    idEmpleado: '',
    horas: '',
    descripcion: '',
    observaciones: '',
  });

  useEffect(() => {
    async function loadData() {
      if (!user?.idEmpleado) {
        setError('No se pudo identificar tu usuario. Contactá al administrador.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [relaciones, asignacionesData, tareasData, catalogosData, estadosData] = await Promise.all([
          getEmpleadosCuadrillas(),
          getAsignaciones(),
          getTareas(),
          getCatalogoTareas(),
          getEstados(),
        ]);

        const miRelacion = relaciones.find(
          (r) =>
            r.idEmpleado === user.idEmpleado &&
            r.esActivo &&
            (r.rol.toLowerCase().includes('puntero') || r.rol.toLowerCase().includes('capataz')),
        );

        if (!miRelacion) {
          setError('No se encontró una cuadrilla activa asignada a tu usuario.');
          setLoading(false);
          return;
        }

        const activos = relaciones.filter(
          (r) => r.idCuadrilla === miRelacion.idCuadrilla && r.esActivo,
        );

        const idsParcelasCuadrilla = new Set<number>();
        for (const rel of relaciones) {
          if (rel.idCuadrilla === miRelacion.idCuadrilla && rel.esActivo) {
            idsParcelasCuadrilla.add(rel.idEmpleado);
          }
        }

        const asignacionesActivas = asignacionesData.filter(
          (a) => a.estado === 'EN_EJECUCION' || a.estado === 'PLANIFICADO',
        );

        setMiCuadrilla(miRelacion);
        setMiembros(activos);
        setAsignaciones(asignacionesActivas);
        setTareas(tareasData);
        setCatalogos(catalogosData);
        setEstados(estadosData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const tareasDeAsignacion = useMemo(() => {
    if (!asignacionSeleccionada) return [];
    return tareas.filter(
      (t) =>
        t.nombreTareaCatalogo === asignacionSeleccionada.nombreTratamiento ||
        t.descripcion?.toLowerCase().includes(asignacionSeleccionada.nombreParcela.toLowerCase()),
    );
  }, [tareas, asignacionSeleccionada]);

  const tareasDeHoy = useMemo(() => {
    return tareas.filter((t) => {
      if (!t.fechaFinalizacion) return true;
      return t.fechaFinalizacion >= today;
    });
  }, [tareas, today]);

  const handleSeleccionarAsignacion = (asignacion: AsignacionTratamientoResponse) => {
    setAsignacionSeleccionada(asignacion);
    setVista('tareas');
  };

  const handleVolver = () => {
    setVista('parcelas');
    setAsignacionSeleccionada(null);
  };

  const handleAbrirModal = () => {
    setForm({
      idCatalogoTarea: '',
      idEmpleado: miembros.length > 0 ? String(miembros[0].idEmpleado) : '',
      horas: '',
      descripcion: '',
      observaciones: '',
    });
    setFormTouched(false);
    setSubmitError(null);
    setShowModal(true);
  };

  const handleCrearTarea = async () => {
    setSubmitError(null);
    setFormTouched(true);

    if (!form.idCatalogoTarea || !form.idEmpleado || !form.horas) {
      setSubmitError('Completá los campos obligatorios.');
      return;
    }

    const catalogo = catalogos.find((c) => c.idCatalogoTarea === Number(form.idCatalogoTarea));
    const miembro = miembros.find((m) => m.idEmpleado === Number(form.idEmpleado));
    const estadoInicial = estados.find((e) => e.nombre === 'PENDIENTE' || e.nombre === 'EN_PROGRESO');

    if (!catalogo || !miembro) {
      setSubmitError('Datos inválidos.');
      return;
    }

    const dto: TareaDTO = {
      idTarea: 0,
      catalogoTarea: {
        idCatalogoTarea: catalogo.idCatalogoTarea,
        nombre: catalogo.nombre,
        descripcion: catalogo.descripcion,
        requiereHabilitacion: { idHabilitacion: 0, nombre: '', descripcion: '' },
      },
      estado: estadoInicial
        ? { idEstado: estadoInicial.idEstado, nombre: estadoInicial.nombre }
        : { idEstado: 1, nombre: 'PENDIENTE' },
      empleado: {
        idEmpleado: miembro.idEmpleado,
        nombre: miembro.nombreEmpleado,
        cedula: '',
        telefono: '',
        email: '',
        fechaIngreso: '',
        activo: true,
        idCategoria: 0,
      },
      historicoTratamiento: {
        idHistorico: 0,
        idParcela: asignacionSeleccionada?.idParcela ?? 0,
        idTratamiento: asignacionSeleccionada?.idTratamiento ?? 0,
        cuadrilla: miCuadrilla?.idCuadrilla ?? 0,
        fechaInicio: today,
        fechaFin: '',
        observaciones: '',
      },
      plantilla: {
        idPlantilla: 0,
        nombre: catalogo.nombre,
        descripcion: catalogo.descripcion,
        catalogoTarea: {
          idCatalogoTarea: catalogo.idCatalogoTarea,
          nombre: catalogo.nombre,
          descripcion: catalogo.descripcion,
          requiereHabilitacion: { idHabilitacion: 0, nombre: '', descripcion: '' },
        },
      },
      fechaCreacion: today,
      fechaInicio: today,
      fechaFinEstimada: '',
      fechaFinalizacion: '',
      descripcion: form.descripcion,
      horas: Number(form.horas),
      observaciones: form.observaciones,
    };

    try {
      setSubmitting(true);
      const nueva = await createTarea(dto);
      setTareas((prev) => [...prev, nueva]);
      setShowModal(false);
    } catch (err: unknown) {
      let msg = 'Error al crear tarea.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: string | { message?: string; error?: string } } };
        const data = axiosErr.response?.data;
        if (typeof data === 'string') msg = data;
        else msg = data?.message ?? data?.error ?? msg;
      }
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="puntero-status">
        <div className="puntero-spinner" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="puntero-status puntero-error">
        <p>{error}</p>
      </div>
    );
  }

  if (vista === 'tareas' && asignacionSeleccionada) {
    return (
      <div className="puntero-panel">
        <div className="puntero-header">
          <button className="puntero-back" onClick={handleVolver} aria-label="Volver">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Volver</span>
          </button>
        </div>

        <div className="puntero-card puntero-card-asignacion">
          <div className="puntero-card-header">
            <h3>{asignacionSeleccionada.nombreParcela}</h3>
            <span className={`badge ${getBadgeClass(asignacionSeleccionada.estado)}`}>
              {asignacionSeleccionada.estado}
            </span>
          </div>
          <div className="puntero-card-meta">
            <span>{asignacionSeleccionada.nombreTratamiento}</span>
            <span>&bull;</span>
            <span>{asignacionSeleccionada.nombreRodal}</span>
          </div>
        </div>

        <div className="puntero-section-header">
          <h3>Tareas ({tareasDeAsignacion.length})</h3>
        </div>

        {tareasDeAsignacion.length === 0 ? (
          <div className="puntero-empty">
            <p>No hay tareas para esta parcela.</p>
          </div>
        ) : (
          <div className="puntero-tareas-list">
            {tareasDeAsignacion.map((t) => (
              <div key={t.idTarea} className="puntero-tarea-card">
                <div className="puntero-tarea-header">
                  <span className="puntero-tarea-empleado">{t.nombreEmpleado}</span>
                  <span className={`badge ${t.nombreEstado === 'COMPLETADO' ? 'badge-success' : 'badge-warning'}`}>
                    {t.nombreEstado}
                  </span>
                </div>
                <div className="puntero-tarea-body">
                  <span className="puntero-tarea-tipo">{t.nombreTareaCatalogo}</span>
                  <span className="puntero-tarea-horas">{t.horas}h</span>
                </div>
                {t.descripcion && <p className="puntero-tarea-desc">{t.descripcion}</p>}
              </div>
            ))}
          </div>
        )}

        <button className="puntero-fab" onClick={handleAbrirModal} aria-label="Nueva tarea">
          <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" role="dialog" aria-modal="true" aria-label="Nueva tarea" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Nueva Tarea</h3>
                <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Cerrar">
                  &times;
                </button>
              </div>

              <div className="modal-form">
                {submitError && <div className="modal-error">{submitError}</div>}

                <div className="form-field">
                  <label htmlFor="idCatalogoTarea">
                    Tipo de tarea <span className="required">*</span>
                  </label>
                  <select
                    id="idCatalogoTarea"
                    value={form.idCatalogoTarea}
                    onChange={(e) => setForm((f) => ({ ...f, idCatalogoTarea: e.target.value }))}
                    className={formTouched && !form.idCatalogoTarea ? 'error' : ''}
                  >
                    <option value="">Seleccionar...</option>
                    {catalogos.map((c) => (
                      <option key={c.idCatalogoTarea} value={c.idCatalogoTarea}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="idEmpleado">
                    Empleado <span className="required">*</span>
                  </label>
                  <select
                    id="idEmpleado"
                    value={form.idEmpleado}
                    onChange={(e) => setForm((f) => ({ ...f, idEmpleado: e.target.value }))}
                    className={formTouched && !form.idEmpleado ? 'error' : ''}
                  >
                    <option value="">Seleccionar...</option>
                    {miembros.map((m) => (
                      <option key={m.idEmpleado} value={m.idEmpleado}>
                        {m.nombreEmpleado} — {m.rol}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="horas">
                    Horas trabajadas <span className="required">*</span>
                  </label>
                  <input
                    id="horas"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={form.horas}
                    onChange={(e) => setForm((f) => ({ ...f, horas: e.target.value }))}
                    placeholder="Ej: 6"
                    className={formTouched && !form.horas ? 'error' : ''}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="descripcion">Descripción</label>
                  <input
                    id="descripcion"
                    type="text"
                    value={form.descripcion}
                    onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                    placeholder="Opcional..."
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="observaciones">Observaciones</label>
                  <textarea
                    id="observaciones"
                    value={form.observaciones}
                    onChange={(e) => setForm((f) => ({ ...f, observaciones: e.target.value }))}
                    placeholder="Opcional..."
                    rows={2}
                  />
                </div>

                <div className="modal-actions">
                  <Button variant="secondary" onClick={() => setShowModal(false)} type="button">
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleCrearTarea} loading={submitting}>
                    Guardar Tarea
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="puntero-panel">
      <div className="puntero-cuadrilla-info">
        <h2>{miCuadrilla?.nombreCuadrilla}</h2>
        <p className="puntero-cuadrilla-rol">Puntero: {miCuadrilla?.nombreEmpleado}</p>
        <p className="puntero-cuadrilla-count">{miembros.length} miembros activos</p>
      </div>

      <div className="puntero-miembros-row">
        {miembros.slice(0, 6).map((m) => (
          <div key={m.idEmpleado} className="puntero-avatar" title={`${m.nombreEmpleado} — ${m.rol}`}>
            {getInitials(m.nombreEmpleado)}
          </div>
        ))}
        {miembros.length > 6 && (
          <div className="puntero-avatar puntero-avatar-more">+{miembros.length - 6}</div>
        )}
      </div>

      <div className="puntero-section-header">
        <h3>Parcelas en Tratamiento ({asignaciones.length})</h3>
      </div>

      {asignaciones.length === 0 ? (
        <div className="puntero-empty">
          <p>No hay parcelas con tratamiento activo.</p>
        </div>
      ) : (
        <div className="puntero-parcelas-list">
          {asignaciones.map((a) => {
            const tareasParcela = tareasDeHoy.filter(
              (t) =>
                t.descripcion?.toLowerCase().includes(a.nombreParcela.toLowerCase()) ||
                t.nombreTareaCatalogo === a.nombreTratamiento,
            );
            return (
              <button
                key={a.idAsignacion}
                className="puntero-parcela-card"
                onClick={() => handleSeleccionarAsignacion(a)}
              >
                <div className="puntero-parcela-header">
                  <span className="puntero-parcela-nombre">{a.nombreParcela}</span>
                  <span className={`badge ${getBadgeClass(a.estado)}`}>{a.estado}</span>
                </div>
                <div className="puntero-parcela-meta">
                  <span>{a.nombreTratamiento}</span>
                  <span>&bull;</span>
                  <span>{a.nombreRodal}</span>
                </div>
                <div className="puntero-parcela-footer">
                  <span className="puntero-parcela-tareas">
                    {tareasParcela.length} tarea{tareasParcela.length !== 1 ? 's' : ''} hoy
                  </span>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PunteroPanel;
