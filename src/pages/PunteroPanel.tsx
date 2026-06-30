import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getEmpleadosCuadrillas } from '../services/empleadoCuadrillaService';
import { getAsignaciones } from '../services/asignacionTratamientoService';
import { getTareasByAsignacion, createTarea, updateTarea } from '../services/tareaService';
import { getCatalogoTareas } from '../services/catalogoTareaService';
import { getEstados } from '../services/estadoService';
import { getAsignadasVigentesByCuadrilla, createTareaAsignada } from '../services/tareaAsignadaService';
import { getPunteroUsuarios, cambiarPasswordPuntero } from '../services/usuarioService';
import Button from '../components/Button';
import type { EmpleadoCuadrillaResponse } from '../types/empleado-cuadrilla';
import type { AsignacionTratamientoResponse } from '../types/asignacion-tratamiento';
import type { TareaResponse, TareaRequest, CatalogoTareaResponse, EstadoDTO } from '../types/tarea';
import type { TareaAsignadaResponse } from '../types/tarea-asignada';
import './PunteroPanel.css';

type Vista = 'parcelas' | 'tareas';

function getBadgeClass(estado: string): string {
  const upper = estado.toUpperCase();
  if (upper.includes('PENDIENT')) return 'badge-pendiente';
  if (upper.includes('PLANIFIC')) return 'badge-planificado';
  if (upper.includes('PROCESO') || upper.includes('EJECUC')) return 'badge-en-ejecucion';
  if (upper.includes('FINALIZ') || upper.includes('COMPLET')) return 'badge-completado';
  if (upper.includes('CANCEL')) return 'badge-cancelado';
  return 'badge-pendiente';
}

function getEstadoIdPorNombre(nombre: string): number {
  const upper = nombre.toUpperCase();
  if (upper.includes('FINALIZ')) return 3;
  if (upper.includes('PENDIENT')) return 2;
  if (upper.includes('PROCESO') || upper.includes('EJECUC')) return 1;
  return 1;
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
  const [tareasAsignadas, setTareasAsignadas] = useState<TareaAsignadaResponse[]>([]);

  const [vista, setVista] = useState<Vista>('parcelas');
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState<AsignacionTratamientoResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editandoTarea, setEditandoTarea] = useState<TareaResponse | null>(null);
  const [formTouched, setFormTouched] = useState(false);
  const [asignadaForm, setAsignadaForm] = useState<Record<number, { idEmpleado: string; horas: string }>>({});
  const [registrandoAsignada, setRegistrandoAsignada] = useState<number | null>(null);

  const [miUsuarioId, setMiUsuarioId] = useState<number | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }, []);

  const [form, setForm] = useState({
    idCatalogoTarea: '',
    idEmpleado: '',
    horas: '',
    descripcion: '',
    observaciones: '',
    marcarCompletada: false,
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
        const [relaciones, asignacionesData, catalogosData, estadosData, punteroUsuarios] = await Promise.all([
          getEmpleadosCuadrillas(),
          getAsignaciones(),
          getCatalogoTareas(),
          getEstados(),
          getPunteroUsuarios(),
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

        const miUsuario = punteroUsuarios.find(u => u.idEmpleado === user.idEmpleado);
        if (miUsuario) {
          setMiUsuarioId(miUsuario.id);
        }

        const activos = relaciones.filter(
          (r) => r.idCuadrilla === miRelacion.idCuadrilla && r.esActivo,
        );

        const asignacionesActivas = asignacionesData.filter(
          (a) => a.estado === 'EN_EJECUCION' || a.estado === 'PLANIFICADO',
        );

        const asignadasData = await getAsignadasVigentesByCuadrilla(miRelacion.idCuadrilla);

        // ponytail: fetch tareas per asignacion; allSettled so one 500 doesn't kill everything
        const resultados = await Promise.allSettled(
          asignacionesActivas.map((a) => getTareasByAsignacion(a.idAsignacion)),
        );
        const allTareas = resultados
          .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getTareasByAsignacion>>> => r.status === 'fulfilled')
          .flatMap((r) => r.value);

        setMiCuadrilla(miRelacion);
        setMiembros(activos);
        setAsignaciones(asignacionesActivas);
        setTareas(allTareas);
        setCatalogos(catalogosData);
        setEstados(estadosData);
        setTareasAsignadas(asignadasData);
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
      (t) => t.idAsignacion === asignacionSeleccionada.idAsignacion && t.fecha === today,
    );
  }, [tareas, asignacionSeleccionada, today]);

  const tareasDeHoy = useMemo(() => {
    return tareas.filter((t) => t.fecha === today);
  }, [tareas, today]);

  const asignadasDeParcela = useMemo(() => {
    if (!asignacionSeleccionada) return [];
    return tareasAsignadas.filter((ta) => ta.idAsignacion === asignacionSeleccionada.idAsignacion);
  }, [tareasAsignadas, asignacionSeleccionada]);

  const contarAsignadas = (idAsignacion: number) => {
    return tareasAsignadas.filter((ta) => ta.idAsignacion === idAsignacion).length;
  };

  const updateAsignadaForm = useCallback((idTareaAsignada: number, field: string, value: string) => {
    setAsignadaForm((prev) => ({
      ...prev,
      [idTareaAsignada]: { ...prev[idTareaAsignada], [field]: value },
    }));
  }, []);

  const handleSeleccionarAsignacion = (asignacion: AsignacionTratamientoResponse) => {
    setAsignacionSeleccionada(asignacion);
    setAsignadaForm({});
    setVista('tareas');
  };

  const handleVolver = () => {
    setVista('parcelas');
    setAsignacionSeleccionada(null);
  };

  const handleCerrarModal = useCallback(() => {
    setShowModal(false);
    setEditandoTarea(null);
    setSubmitError(null);
  }, []);

  const handleAbrirModal = () => {
    setForm({
      idCatalogoTarea: '',
      idEmpleado: miembros.length > 0 ? String(miembros[0].idEmpleado) : '',
      horas: '',
      descripcion: '',
      observaciones: '',
      marcarCompletada: false,
    });
    setFormTouched(false);
    setSubmitError(null);
    setEditandoTarea(null);
    setShowModal(true);
  };

  const handleAbrirModalParaPeon = (miembro: EmpleadoCuadrillaResponse) => {
    setForm({
      idCatalogoTarea: '',
      idEmpleado: String(miembro.idEmpleado),
      horas: '',
      descripcion: '',
      observaciones: '',
      marcarCompletada: false,
    });
    setFormTouched(false);
    setSubmitError(null);
    setEditandoTarea(null);
    setShowModal(true);
  };

  const handleAbrirEdicion = (tarea: TareaResponse) => {
    setForm({
      idCatalogoTarea: String(tarea.idCatalogoTarea),
      idEmpleado: String(tarea.idEmpleado),
      horas: String(tarea.horas),
      descripcion: tarea.descripcion,
      observaciones: tarea.observaciones,
      marcarCompletada: tarea.nombreEstado === 'Finalizada',
    });
    setFormTouched(false);
    setSubmitError(null);
    setEditandoTarea(tarea);
    setShowModal(true);
  };

  const handleRegistrarDesdeAsignada = async (ta: TareaAsignadaResponse) => {
    const formData = asignadaForm[ta.idTareaAsignada];
    if (!formData?.idEmpleado) return;

    const estadoInicial = estados.find(
      (e) => e.nombre.toUpperCase().includes('PENDIENT') || e.nombre.toUpperCase().includes('PROCESO'),
    );

    const request: TareaRequest = {
      idAsignacion: asignacionSeleccionada!.idAsignacion,
      idEmpleado: Number(formData.idEmpleado),
      idEstado: estadoInicial ? getEstadoIdPorNombre(estadoInicial.nombre) : 1,
      idCatalogoTarea: ta.idCatalogoTarea,
      fecha: today,
      descripcion: ta.descripcion ?? '',
      horas: Number(formData.horas) || 0,
      observaciones: '',
    };

    try {
      setRegistrandoAsignada(ta.idTareaAsignada);
      const nueva = await createTarea(request);
      if (!nueva || typeof nueva.idTarea !== 'number') {
        throw new Error('Respuesta inválida del servidor');
      }
      setTareas((prev) => [...prev, nueva]);
      setTareasAsignadas((prev) => prev.filter((a) => a.idTareaAsignada !== ta.idTareaAsignada));
      setAsignadaForm((prev) => {
        const next = { ...prev };
        delete next[ta.idTareaAsignada];
        return next;
      });

      // Update local state: PLANIFICADO → EN_EJECUCION
      if (asignacionSeleccionada?.estado === 'PLANIFICADO') {
        setAsignaciones((prev) =>
          prev.map((a) =>
            a.idAsignacion === asignacionSeleccionada.idAsignacion
              ? { ...a, estado: 'EN_EJECUCION' }
              : a,
          ),
        );
        setAsignacionSeleccionada((prev) => (prev ? { ...prev, estado: 'EN_EJECUCION' } : prev));
      }
    } catch (err: unknown) {
      let msg = 'Error al registrar tarea.';
      let status: number | undefined;
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: string | { message?: string; error?: string } } };
        status = axiosErr.response?.status;
        const data = axiosErr.response?.data;
        if (typeof data === 'string') msg = data;
        else msg = data?.message ?? data?.error ?? msg;
      }
      if (status === 401 || status === 403) {
        msg = 'No tenés permisos para registrar tareas. Contactá al administrador.';
      }
      alert(msg);
    } finally {
      setRegistrandoAsignada(null);
    }
  };

  const handleFinalizarTarea = async (tarea: TareaResponse) => {
    const estadoCompletado = estados.find(
      (e) => e.nombre.toUpperCase().includes('FINALIZ'),
    );
    if (!estadoCompletado) return;

    const estadoId = getEstadoIdPorNombre(estadoCompletado.nombre);

    try {
      const actualizada = await updateTarea(tarea.idTarea, {
        idAsignacion: tarea.idAsignacion,
        idEmpleado: tarea.idEmpleado,
        idEstado: estadoId,
        idCatalogoTarea: tarea.idCatalogoTarea,
        fecha: tarea.fecha,
        descripcion: tarea.descripcion,
        horas: tarea.horas,
        observaciones: tarea.observaciones,
      });
      setTareas((prev) => prev.map((t) => (t.idTarea === actualizada.idTarea ? actualizada : t)));

      if (miCuadrilla) {
        const nuevaAsignada = await createTareaAsignada({
          idAsignacion: tarea.idAsignacion,
          idCuadrilla: miCuadrilla.idCuadrilla,
          idCatalogoTarea: tarea.idCatalogoTarea,
          descripcion: tarea.descripcion,
          fechaLimite: today,
        });
        setTareasAsignadas((prev) => [...prev, nuevaAsignada]);
      }
    } catch (err: unknown) {
      let msg = 'Error al finalizar tarea.';
      let status: number | undefined;
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: string | { message?: string; error?: string } } };
        status = axiosErr.response?.status;
        const data = axiosErr.response?.data;
        if (typeof data === 'string') msg = data;
        else msg = data?.message ?? data?.error ?? msg;
      }
      if (status === 401 || status === 403) {
        msg = 'No tenés permisos para finalizar tareas. Contactá al administrador.';
      }
      alert(msg);
    }
  };

  const handleCrearTarea = async () => {
    setSubmitError(null);
    setFormTouched(true);

    if (!form.idCatalogoTarea || !form.idEmpleado || !form.horas) {
      setSubmitError('Completá los campos obligatorios.');
      return;
    }

    if (!asignacionSeleccionada) {
      setSubmitError('No hay una asignación seleccionada.');
      return;
    }

    const estadoInicial = form.marcarCompletada
      ? estados.find((e) => e.nombre.toUpperCase().includes('FINALIZ'))
      : estados.find(
          (e) => e.nombre.toUpperCase().includes('PENDIENT') || e.nombre.toUpperCase().includes('PROCESO'),
        );

    const request: TareaRequest = {
      idAsignacion: asignacionSeleccionada.idAsignacion,
      idEmpleado: Number(form.idEmpleado),
      idEstado: estadoInicial ? getEstadoIdPorNombre(estadoInicial.nombre) : 1,
      idCatalogoTarea: Number(form.idCatalogoTarea),
      fecha: today,
      descripcion: form.descripcion,
      horas: Number(form.horas),
      observaciones: form.observaciones,
    };

    try {
      setSubmitting(true);
      let result: TareaResponse;
      if (editandoTarea) {
        result = await updateTarea(editandoTarea.idTarea, request);
        setTareas((prev) => prev.map((t) => (t.idTarea === result.idTarea ? result : t)));
      } else {
        result = await createTarea(request);
        if (!result || typeof result.idTarea !== 'number') {
          throw new Error('Respuesta inválida del servidor');
        }
        setTareas((prev) => [...prev, result]);
      }
      handleCerrarModal();

      // Update local state: PLANIFICADO → EN_EJECUCION (only for new tasks)
      if (!editandoTarea && asignacionSeleccionada?.estado === 'PLANIFICADO') {
        setAsignaciones((prev) =>
          prev.map((a) =>
            a.idAsignacion === asignacionSeleccionada.idAsignacion
              ? { ...a, estado: 'EN_EJECUCION' }
              : a,
          ),
        );
        setAsignacionSeleccionada((prev) => (prev ? { ...prev, estado: 'EN_EJECUCION' } : prev));
      }
    } catch (err: unknown) {
      let msg = 'Error al crear tarea.';
      let status: number | undefined;
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: string | { message?: string; error?: string } } };
        status = axiosErr.response?.status;
        const data = axiosErr.response?.data;
        if (typeof data === 'string') msg = data;
        else msg = data?.message ?? data?.error ?? msg;
      }
      if (status === 401 || status === 403) {
        msg = 'No tenés permisos para crear tareas. Contactá al administrador.';
      }
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCambiarPassword = async () => {
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Ingresá tu contraseña actual');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setPasswordError('La nueva contraseña debe tener al menos 4 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (!miUsuarioId) {
      setPasswordError('No se pudo identificar tu usuario. Cerrá sesión y volvé a iniciar.');
      return;
    }

    setPasswordSubmitting(true);
    try {
      await cambiarPasswordPuntero(miUsuarioId, currentPassword, newPassword);
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Contraseña actualizada correctamente');
    } catch (err: unknown) {
      let msg = 'Error al cambiar la contraseña';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
        msg = axiosErr.response?.data?.message ?? axiosErr.response?.data?.error ?? msg;
      }
      setPasswordError(msg);
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleCerrarPasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
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

        {asignadasDeParcela.length > 0 && (
          <>
            <div className="puntero-section-header">
              <h3>Tareas Asignadas ({asignadasDeParcela.length})</h3>
            </div>
            <div className="puntero-asignadas-list">
              {asignadasDeParcela.map((ta) => (
                <div key={ta.idTareaAsignada} className="puntero-asignada-card">
                  <div className="puntero-asignada-header">
                    <span className="puntero-asignada-tipo">{ta.nombreCatalogoTarea}</span>
                    {ta.descripcion && <span className="puntero-asignada-desc">{ta.descripcion}</span>}
                  </div>
                  <div className="puntero-asignada-form">
                    <select
                      value={asignadaForm[ta.idTareaAsignada]?.idEmpleado ?? ''}
                      onChange={(e) => updateAsignadaForm(ta.idTareaAsignada, 'idEmpleado', e.target.value)}
                    >
                      <option value="">Seleccionar peón...</option>
                      {miembros.map((m) => (
                        <option key={m.idEmpleado} value={m.idEmpleado}>
                          {m.nombreEmpleado}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      placeholder="Horas"
                      value={asignadaForm[ta.idTareaAsignada]?.horas ?? ''}
                      onChange={(e) => updateAsignadaForm(ta.idTareaAsignada, 'horas', e.target.value)}
                    />
                    <Button
                      variant="primary"
                      size="small"
                      loading={registrandoAsignada === ta.idTareaAsignada}
                      disabled={!asignadaForm[ta.idTareaAsignada]?.idEmpleado}
                      onClick={() => handleRegistrarDesdeAsignada(ta)}
                    >
                      Registrar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="puntero-section-header">
          <h3>Cuadrilla ({miembros.length})</h3>
        </div>

        <div className="puntero-miembros-list">
          {miembros.map((m) => {
            const tareasPeon = tareasDeAsignacion.filter((t) => t.idEmpleado === m.idEmpleado);
            const totalHoras = tareasPeon.reduce((sum, t) => sum + t.horas, 0);

            const asignadasPendientes = asignadasDeParcela.filter((ta) => {
              const yaHecha = tareas.some(
                (t) =>
                  t.idAsignacion === ta.idAsignacion &&
                  t.idCatalogoTarea === ta.idCatalogoTarea &&
                  t.idEmpleado === m.idEmpleado &&
                  t.fecha === today,
              );
              return !yaHecha;
            });

            return (
              <div key={m.idEmpleado} className="puntero-miembro-card">
                <div className="puntero-miembro-info">
                  <span className="puntero-miembro-nombre">{m.nombreEmpleado}</span>
                  {tareasPeon.length > 0 ? (
                    <span className="puntero-miembro-tareas">
                      {totalHoras}h ({tareasPeon.length} tarea{tareasPeon.length > 1 ? 's' : ''})
                    </span>
                  ) : asignadasPendientes.length > 0 ? (
                    <span className="puntero-miembro-asignadas">
                      asignada{asignadasPendientes.length > 1 ? 's' : ''}: {asignadasPendientes.map((a) => a.nombreCatalogoTarea).join(', ')}
                    </span>
                  ) : (
                    <span className="puntero-miembro-sin-tareas">sin tareas</span>
                  )}
                </div>
                {tareasPeon.length === 0 && (
                  <button
                    className="puntero-miembro-add"
                    onClick={() => handleAbrirModalParaPeon(m)}
                    aria-label={`Nueva tarea para ${m.nombreEmpleado}`}
                  >
                    +tarea
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="puntero-section-header">
          <h3>Tareas Registradas ({tareasDeAsignacion.length})</h3>
        </div>

        {tareasDeAsignacion.length === 0 ? (
          <div className="puntero-empty">
            <p>No hay tareas registradas para esta parcela.</p>
          </div>
        ) : (
          <div className="puntero-tareas-list">
            {tareasDeAsignacion.map((t) => (
              <div key={t.idTarea} className={`puntero-tarea-card${t.nombreEstado === 'Finalizada' ? ' completada' : ''}`}>
                <div className="puntero-tarea-header">
                  <span className="puntero-tarea-empleado">{t.nombreEmpleado}</span>
                  <div className="puntero-tarea-header-right">
                    <span className={`badge ${t.nombreEstado === 'Finalizada' ? 'badge-success' : 'badge-warning'}`}>
                      {t.nombreEstado}
                    </span>
                    {t.nombreEstado !== 'Finalizada' ? (
                      <button
                        className="puntero-tarea-complete-btn"
                        onClick={() => handleFinalizarTarea(t)}
                        aria-label="Marcar como completada"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        className="puntero-tarea-edit-btn"
                        onClick={() => handleAbrirEdicion(t)}
                        aria-label="Editar tarea"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    )}
                  </div>
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
           <div className="modal-overlay" onClick={handleCerrarModal}>
            <div className="modal-content" role="dialog" aria-modal="true" aria-label={editandoTarea ? 'Editar tarea' : 'Nueva tarea'} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editandoTarea ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
                <button className="modal-close" onClick={handleCerrarModal} aria-label="Cerrar">
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

                <div className="form-field-row">
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

                  <div className="form-field form-field-checkbox">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={form.marcarCompletada}
                        onChange={(e) => setForm((f) => ({ ...f, marcarCompletada: e.target.checked }))}
                      />
                      Completada
                    </label>
                  </div>
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
                  <Button variant="secondary" onClick={handleCerrarModal} type="button">
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleCrearTarea} loading={submitting}>
                    {editandoTarea ? 'Actualizar Tarea' : 'Guardar Tarea'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="modal-overlay" onClick={handleCerrarPasswordModal}>
            <div className="modal-content" role="dialog" aria-modal="true" aria-label="Cambiar contraseña" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Cambiar Contraseña</h3>
                <button className="modal-close" onClick={handleCerrarPasswordModal} aria-label="Cerrar">
                  &times;
                </button>
              </div>
              <div className="modal-form">
                {passwordError && <div className="modal-error">{passwordError}</div>}

                <div className="form-field">
                  <label htmlFor="currentPassword">Contraseña Actual</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={passwordSubmitting}
                    placeholder="Ingresá tu contraseña actual"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={passwordSubmitting}
                    placeholder="Mínimo 4 caracteres"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={passwordSubmitting}
                    placeholder="Repetí la nueva contraseña"
                  />
                </div>

                <div className="modal-actions">
                  <Button variant="secondary" onClick={handleCerrarPasswordModal} type="button" disabled={passwordSubmitting}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleCambiarPassword} loading={passwordSubmitting}>
                    Guardar
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
        <div className="puntero-cuadrilla-header">
          <div>
            <h2>{miCuadrilla?.nombreCuadrilla}</h2>
            <p className="puntero-cuadrilla-rol">Puntero: {miCuadrilla?.nombreEmpleado}</p>
            <p className="puntero-cuadrilla-count">{miembros.length} miembros activos</p>
          </div>
          <button
            className="puntero-password-btn"
            onClick={() => setShowPasswordModal(true)}
            aria-label="Cambiar contraseña"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Cambiar contraseña</span>
          </button>
        </div>
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
              (t) => t.idAsignacion === a.idAsignacion,
            );
            const asignadasCount = contarAsignadas(a.idAsignacion);
            return (
              <button
                key={a.idAsignacion}
                className="puntero-parcela-card"
                onClick={() => handleSeleccionarAsignacion(a)}
              >
                <div className="puntero-parcela-header">
                  <span className="puntero-parcela-nombre">{a.nombreParcela}</span>
                  <div className="puntero-parcela-badges">
                    {asignadasCount > 0 && (
                      <span className="badge badge-asignadas">{asignadasCount} asignada{asignadasCount > 1 ? 's' : ''}</span>
                    )}
                    <span className={`badge ${getBadgeClass(a.estado)}`}>{a.estado}</span>
                  </div>
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

      {showPasswordModal && (
        <div className="modal-overlay" onClick={handleCerrarPasswordModal}>
          <div className="modal-content" role="dialog" aria-modal="true" aria-label="Cambiar contraseña" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cambiar Contraseña</h3>
              <button className="modal-close" onClick={handleCerrarPasswordModal} aria-label="Cerrar">
                &times;
              </button>
            </div>
            <div className="modal-form">
              {passwordError && <div className="modal-error">{passwordError}</div>}

              <div className="form-field">
                <label htmlFor="currentPassword">Contraseña Actual</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={passwordSubmitting}
                  placeholder="Ingresá tu contraseña actual"
                />
              </div>

              <div className="form-field">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordSubmitting}
                  placeholder="Mínimo 4 caracteres"
                />
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordSubmitting}
                  placeholder="Repetí la nueva contraseña"
                />
              </div>

              <div className="modal-actions">
                <Button variant="secondary" onClick={handleCerrarPasswordModal} type="button" disabled={passwordSubmitting}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleCambiarPassword} loading={passwordSubmitting}>
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PunteroPanel;
