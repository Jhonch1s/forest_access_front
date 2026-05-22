import { useState, useMemo, useCallback } from 'react';
import './AsignarTratamientos.css';
import { useCampos } from '../hooks/useCampos';
import { useRodalParcelas } from '../hooks/useRodalParcelas';
import { useTratamientos } from '../hooks/useTratamientos';
import { useAsignaciones } from '../hooks/useAsignaciones';
import { useTratamientoDependencias } from '../hooks/useTratamientoDependencias';
import { createAsignacion, deleteAsignacion } from '../services/asignacionTratamientoService';
import Button from '../components/Button';
import type { Parcela } from '../types/predio';

function formatDateInput(d: Date): string {
  return d.toISOString().split('T')[0];
}

function getEstadoBadgeClass(estado: string): string {
  switch (estado) {
    case 'PENDIENTE': return 'badge-pendiente';
    case 'PLANIFICADO': return 'badge-planificado';
    case 'EN_EJECUCION': return 'badge-en-ejecucion';
    case 'COMPLETADO': return 'badge-completado';
    case 'CANCELADO': return 'badge-cancelado';
    default: return 'badge-pendiente';
  }
}

function AsignarTratamientos() {
  const [selectedCampoId, setSelectedCampoId] = useState<number | null>(null);
  const [selectedParcelas, setSelectedParcelas] = useState<Set<number>>(new Set());
  const [expandedRodales, setExpandedRodales] = useState<Set<number>>(new Set());

  const [idTratamiento, setIdTratamiento] = useState<number | null>(null);
  const [fechaAsignacion, setFechaAsignacion] = useState(formatDateInput(new Date()));
  const [fechaInicioEstimada, setFechaInicioEstimada] = useState('');
  const [fechaFinEstimada, setFechaFinEstimada] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  const { campos, loading: loadingCampos } = useCampos();
  const { rodales, parcelasPorRodal, loading: loadingRodales } = useRodalParcelas(selectedCampoId);
  const { tratamientos, loading: loadingTratamientos } = useTratamientos();
  const { asignaciones, refetch } = useAsignaciones();
  const { dependencias } = useTratamientoDependencias();

  const toggleRodal = useCallback((idRodal: number) => {
    setExpandedRodales((prev) => {
      const next = new Set(prev);
      if (next.has(idRodal)) next.delete(idRodal);
      else next.add(idRodal);
      return next;
    });
  }, []);

  const toggleParcela = useCallback((idParcela: number) => {
    setSelectedParcelas((prev) => {
      const next = new Set(prev);
      if (next.has(idParcela)) next.delete(idParcela);
      else next.add(idParcela);
      return next;
    });
  }, []);

  const toggleRodalCompleto = useCallback((_idRodal: number, parcelas: Parcela[]) => {
    const ids = parcelas.map((p) => p.idParcela);
    setSelectedParcelas((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  }, []);

  const rodalesConParcelas = useMemo(() => {
    return rodales.map((rodal) => ({
      rodal,
      parcelas: parcelasPorRodal.get(rodal.idRodal) ?? [],
      allSelected: (parcelasPorRodal.get(rodal.idRodal) ?? []).every((p) => selectedParcelas.has(p.idParcela)),
      someSelected: (parcelasPorRodal.get(rodal.idRodal) ?? []).some((p) => selectedParcelas.has(p.idParcela)),
    }));
  }, [rodales, parcelasPorRodal, selectedParcelas]);

  const selectedCount = selectedParcelas.size;

  const asignacionesVisibles = useMemo(() => {
    return asignaciones
      .filter((a) => selectedParcelas.has(a.idParcela))
      .filter((a) => !deletedIds.has(a.idAsignacion));
  }, [asignaciones, selectedParcelas, deletedIds]);

  const dependenciasDelTratamiento = useMemo(() => {
    if (!idTratamiento) return [];
    return dependencias.filter((d) => d.idTratamientoPosterior === idTratamiento);
  }, [dependencias, idTratamiento]);

  const handleCampoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const id = val ? Number(val) : null;
    setSelectedCampoId(id);
    setSelectedParcelas(new Set());
    setExpandedRodales(new Set());
  };

  const handleEliminarAsignacion = async (idAsignacion: number, nombreTratamiento: string) => {
    if (!confirm(`¿Eliminar la asignación de "${nombreTratamiento}"?`)) return;
    setDeletedIds((prev) => new Set(prev).add(idAsignacion));
    try {
      await deleteAsignacion(idAsignacion);
      await refetch();
      setDeletedIds(new Set());
    } catch (err: unknown) {
      setDeletedIds((prev) => {
        const next = new Set(prev);
        next.delete(idAsignacion);
        return next;
      });
      let msg = 'Error al eliminar asignación.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: string | { message?: string; error?: string } } };
        const data = axiosErr.response?.data;
        if (typeof data === 'string') msg = data;
        else msg = data?.message ?? data?.error ?? msg;
      }
      setSubmitError(msg);
    }
  };

  const handleFechaInicioChange = (value: string) => {
    setFechaInicioEstimada(value);
    if (fechaFinEstimada && value > fechaFinEstimada) {
      setFechaFinEstimada('');
    }
  };

  const handleFechaFinChange = (value: string) => {
    setFechaFinEstimada(value);
    if (fechaInicioEstimada && value < fechaInicioEstimada) {
      setFechaInicioEstimada('');
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!idTratamiento) {
      setSubmitError('Seleccioná un tratamiento.');
      return;
    }
    if (selectedCount === 0) {
      setSubmitError('Seleccioná al menos una parcela.');
      return;
    }
    if (!fechaInicioEstimada || !fechaFinEstimada) {
      setSubmitError('Completá las fechas estimadas.');
      return;
    }
    if (fechaInicioEstimada > fechaFinEstimada) {
      setSubmitError('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    setSubmitting(true);
    try {
      let bulkRodalId: number | null = null;
      const parcelasSueltas: number[] = [];

      for (const { rodal, parcelas, allSelected } of rodalesConParcelas) {
        if (allSelected && parcelas.length > 0) {
          if (bulkRodalId === null && parcelasSueltas.length === 0) {
            bulkRodalId = rodal.idRodal;
          } else {
            if (bulkRodalId !== null) {
              const prevBulkParcelas = parcelasPorRodal.get(bulkRodalId) ?? [];
              parcelasSueltas.push(...prevBulkParcelas.map((p) => p.idParcela));
              bulkRodalId = null;
            }
            parcelasSueltas.push(...parcelas.map((p) => p.idParcela));
          }
        } else {
          const seleccionadas = parcelas.filter((p) => selectedParcelas.has(p.idParcela));
          parcelasSueltas.push(...seleccionadas.map((p) => p.idParcela));
        }
      }

      if (bulkRodalId !== null) {
        await createAsignacion({
          idRodal: bulkRodalId,
          idTratamiento,
          fechaAsignacion,
          fechaInicioEstimada,
          fechaFinEstimada,
          observaciones,
          estado: 'PENDIENTE',
        });
        setSubmitSuccess(`Tratamiento asignado a rodal completo.`);
      } else {
        const uniqueParcelas = Array.from(new Set(parcelasSueltas));
        await Promise.all(
          uniqueParcelas.map((idParcela) =>
            createAsignacion({
              idParcela,
              idTratamiento,
              fechaAsignacion,
              fechaInicioEstimada,
              fechaFinEstimada,
              observaciones,
              estado: 'PENDIENTE',
            })
          )
        );
        setSubmitSuccess(`Tratamiento asignado a ${uniqueParcelas.length} parcela(s).`);
      }

      await refetch();
    } catch (err: unknown) {
      let msg = 'Error al asignar tratamiento.';
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

  return (
    <div className="asignar-container">
      <div className="page-header">
        <div>
          <h2>Asignar Tratamientos</h2>
          <p>Planificá tratamientos forestales sobre parcelas o rodales.</p>
        </div>
      </div>

      <div className="asignar-layout">
        {/* Panel Izquierdo: Jerarquia */}
        <div className="asignar-panel">
          <h3 className="panel-title">Seleccionar Parcelas</h3>

          <div className="campo-selector">
            <label htmlFor="campo">Campo</label>
            <select id="campo" value={selectedCampoId ?? ''} onChange={handleCampoChange} disabled={loadingCampos}>
              <option value="">{loadingCampos ? 'Cargando...' : 'Seleccioná un campo'}</option>
              {campos.map((c) => (
                <option key={c.idCampo} value={c.idCampo}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="arbol-container">
            {!selectedCampoId && (
              <p className="arbol-empty">Seleccioná un campo para ver rodales y parcelas.</p>
            )}
            {selectedCampoId && loadingRodales && (
              <p className="arbol-empty">Cargando rodales...</p>
            )}
            {selectedCampoId && !loadingRodales && rodalesConParcelas.length === 0 && (
              <p className="arbol-empty">No hay rodales registrados para este campo.</p>
            )}
            {rodalesConParcelas.map(({ rodal, parcelas, allSelected, someSelected }) => {
              const selectedCountInRodal = parcelas.filter((p) => selectedParcelas.has(p.idParcela)).length;
              const isExpanded = expandedRodales.has(rodal.idRodal);
              return (
                <div key={rodal.idRodal} className={`rodal-item ${allSelected ? 'rodal-selected' : ''}`}>
                  <div className="rodal-header" onClick={() => toggleRodal(rodal.idRodal)}>
                    <button
                      className={`rodal-toggle ${isExpanded ? 'expanded' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRodal(rodal.idRodal);
                      }}
                      type="button"
                      aria-label="Expandir rodal"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <label className="custom-checkbox" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = !allSelected && someSelected;
                        }}
                        onChange={() => toggleRodalCompleto(rodal.idRodal, parcelas)}
                      />
                      <span className="custom-checkbox-box">
                        <svg className="custom-checkbox-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </label>
                    <svg className="rodal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 19h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      <path d="M12 11v.01" />
                      <path d="M8 11v.01" />
                      <path d="M16 11v.01" />
                      <path d="M12 15v.01" />
                      <path d="M8 15v.01" />
                      <path d="M16 15v.01" />
                    </svg>
                    <span className="rodal-name">{rodal.nombre}</span>
                    <span className={`rodal-count ${allSelected ? 'all-selected' : someSelected ? 'some-selected' : ''}`}>
                      {someSelected && !allSelected ? `${selectedCountInRodal}/${parcelas.length} seleccionadas` : `${parcelas.length} parcelas`}
                    </span>
                  </div>

                  <div className={`parcelas-wrapper ${isExpanded ? 'expanded' : ''}`}>
                    <div className="parcelas-list">
                      {parcelas.map((p) => (
                        <label
                          key={p.idParcela}
                          className={`parcela-item ${selectedParcelas.has(p.idParcela) ? 'parcela-selected' : ''}`}
                        >
                          <span className="custom-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedParcelas.has(p.idParcela)}
                              onChange={() => toggleParcela(p.idParcela)}
                            />
                            <span className="custom-checkbox-box">
                              <svg className="custom-checkbox-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          </span>
                          <svg className="parcela-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span className="parcela-name">{p.nombre}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="selection-summary">
            <strong>{selectedCount}</strong> parcela(s) seleccionada(s)
          </p>
        </div>

        {/* Panel Derecho: Formulario y Asignaciones */}
        <div className="asignar-panel">
          <h3 className="panel-title">Asignar Tratamiento</h3>

          <div className="form-section">
            <div className="form-field">
              <label htmlFor="tratamiento">Tratamiento</label>
              <select
                id="tratamiento"
                value={idTratamiento ?? ''}
                onChange={(e) => setIdTratamiento(e.target.value ? Number(e.target.value) : null)}
                disabled={loadingTratamientos}
              >
                <option value="">{loadingTratamientos ? 'Cargando...' : 'Seleccioná un tratamiento'}</option>
                {tratamientos.map((t) => (
                  <option key={t.idTratamiento} value={t.idTratamiento}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            {dependenciasDelTratamiento.length > 0 && (
              <div className="dependencia-info">
                <strong>Dependencias de este tratamiento:</strong>
                <ul style={{ margin: '4px 0', paddingLeft: 16 }}>
                  {dependenciasDelTratamiento.map((d) => (
                    <li key={`${d.idTratamientoAnterior}-${d.idTratamientoPosterior}`}>
                      Requiere <strong>{d.nombreTratamientoAnterior}</strong> con al menos <strong>{d.diasEsperaMinimo}</strong> días de espera
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="fechaAsignacion">Fecha de Asignación</label>
              <input
                id="fechaAsignacion"
                type="date"
                value={fechaAsignacion}
                onChange={(e) => setFechaAsignacion(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Rango de Fechas Estimado</label>
              <div className="date-range-row">
                <div className="date-range-field">
                  <label htmlFor="fechaInicio">Desde</label>
                  <input
                    id="fechaInicio"
                    type="date"
                    value={fechaInicioEstimada}
                    max={fechaFinEstimada || undefined}
                    onChange={(e) => handleFechaInicioChange(e.target.value)}
                  />
                </div>
                <div className="date-range-field">
                  <label htmlFor="fechaFin">Hasta</label>
                  <input
                    id="fechaFin"
                    type="date"
                    value={fechaFinEstimada}
                    min={fechaInicioEstimada || undefined}
                    onChange={(e) => handleFechaFinChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Opcional..."
                maxLength={500}
                rows={2}
              />
            </div>

            {submitError && <div className="error-message">{submitError}</div>}
            {submitSuccess && (
              <div className="error-message" style={{ color: 'var(--status-success)', background: 'rgba(48,130,48,0.05)' }}>
                {submitSuccess}
              </div>
            )}

            <div className="submit-row">
              <Button variant="secondary" onClick={() => {
                setSelectedParcelas(new Set());
                setIdTratamiento(null);
                setFechaInicioEstimada('');
                setFechaFinEstimada('');
                setObservaciones('');
                setSubmitError(null);
                setSubmitSuccess(null);
              }} disabled={submitting}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Limpiar
              </Button>
              <Button variant="primary" onClick={handleSubmit} loading={submitting}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Asignar Tratamiento
              </Button>
            </div>
          </div>

          <div className="asignaciones-section">
            <h3 className="panel-title">
              Asignaciones Existentes ({asignacionesVisibles.length})
            </h3>
            <div className="asignaciones-list">
              {asignacionesVisibles.length === 0 && (
                <p className="arbol-empty">No hay asignaciones para las parcelas seleccionadas.</p>
              )}
              {asignacionesVisibles.map((a) => (
                <div key={a.idAsignacion} className="asignacion-card">
                  <div className="asignacion-info">
                    <span className="asignacion-tratamiento">{a.nombreTratamiento}</span>
                    <span className="asignacion-meta">
                      {a.nombreParcela} &bull; {a.fechaInicioEstimada} a {a.fechaFinEstimada}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${getEstadoBadgeClass(a.estado)}`}>{a.estado}</span>
                    {a.estado === 'PENDIENTE' && (
                      <button
                        className="icon-button danger-hover"
                        onClick={() => handleEliminarAsignacion(a.idAsignacion, a.nombreTratamiento)}
                        title="Eliminar asignación"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)', display: 'flex' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AsignarTratamientos;
