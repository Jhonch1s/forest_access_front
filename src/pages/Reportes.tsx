import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import Button from '../components/Button';
import { getReporteBatch, esPageResponse } from '../services/reporteService';
import type { ReporteEmpleadoDTO, ReporteBatchPage } from '../types/reporte';
import html2pdf from 'html2pdf.js';
import './Reportes.css';

/* ─── SVG icons ─────────────────────────── */

function IconClipboard({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

function IconClock({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconTrendUp({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconDownload({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconAlert({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconCross({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconCalendar({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconSearch({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

/* ─── Tipos internos ────────────────────── */

interface TareaAgrupada {
  nombreCatalogo: string;
  cantidad: number;
  horas: number;
}

interface HabilitacionInfo {
  nombre: string;
  fechaVencimiento: string;
  diasRestantes: number;
}

interface ReporteEmpleado {
  idEmpleado: number;
  nombre: string;
  cedula: string;
  categoria: string;
  valorJornal: number;
  totalTareas: number;
  totalHoras: number;
  diasConTrabajo: number;
  tareasAgrupadas: TareaAgrupada[];
  habilitaciones: HabilitacionInfo[];
}

/* ─── Mapper DTO → interno ─────────────── */

function mapEmpleadoDTO(dto: ReporteEmpleadoDTO): ReporteEmpleado {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    idEmpleado: dto.idEmpleado,
    nombre: dto.nombre,
    cedula: dto.cedula,
    categoria: dto.nombreCategoria,
    valorJornal: dto.valorJornal,
    totalTareas: dto.totalTareas,
    totalHoras: dto.totalHoras,
    diasConTrabajo: dto.diasTrabajados,
    tareasAgrupadas: dto.tareas.map((t) => ({
      nombreCatalogo: t.nombreCatalogo,
      cantidad: t.cantidad,
      horas: t.horas,
    })),
    habilitaciones: dto.habilitaciones.map((h) => {
      const venc = new Date(h.fechaVencimiento + 'T00:00:00');
      const diff = Math.ceil((venc.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return {
        nombre: h.nombreHabilitacion,
        fechaVencimiento: h.fechaVencimiento,
        diasRestantes: diff,
      };
    }),
  };
}

/* ─── Helpers ───────────────────────────── */

type RangoKey = 'hoy' | 'semana' | 'mes';
type SortKey = 'nombre' | 'horas' | 'incentivo';
type ViewMode = 'paginado' | 'scroll';

const PAGE_SIZE = 4;

function formatIncentivoHoras(h: number): string {
  if (h === 0) return '0.0h';
  const signo = h > 0 ? '+' : '';
  return `${signo}${h.toFixed(1)}h`;
}

function formatMoneda(valor: number): string {
  const signo = valor >= 0 ? '+' : '';
  return `${signo}$${Math.abs(valor).toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getHabilitacionStatus(dias: number): 'ok' | 'proximo' | 'vencido' {
  if (dias < 0) return 'vencido';
  if (dias <= 15) return 'proximo';
  return 'ok';
}

function incentivoHoras(totalHoras: number, diasConTrabajo: number): number {
  return totalHoras - diasConTrabajo * 8;
}

function incentivoValor(incentivoH: number, valorJornal: number): number {
  return incentivoH * (valorJornal / 8);
}

function jornadaPct(totalHoras: number, diasConTrabajo: number): number {
  if (diasConTrabajo <= 0) return 0;
  return Math.min(100, (totalHoras / (diasConTrabajo * 8)) * 100);
}

const PDF_OPTIONS = {
  margin: [10, 10, 10, 10] as [number, number, number, number],
  image: { type: 'jpeg' as const, quality: 0.95 },
  enableLinks: false,
  html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
  jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
  pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
};

const RANGO_LABELS: Record<RangoKey, string> = {
  hoy: 'Hoy',
  semana: 'Semana',
  mes: 'Mes',
};

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function rangeOptions(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/* ─── Componente ReporteEmpleadoCard ────── */

function ReporteEmpleadoCard({ emp, onExportPDF, exportando }: { emp: ReporteEmpleado; onExportPDF?: (id: number) => void; exportando?: boolean }) {
  const incentivoH = incentivoHoras(emp.totalHoras, emp.diasConTrabajo);
  const incentivoV = incentivoValor(incentivoH, emp.valorJornal);
  const pct = jornadaPct(emp.totalHoras, emp.diasConTrabajo);
  const tieneHabsProximas = emp.habilitaciones.some(
    (h) => getHabilitacionStatus(h.diasRestantes) === 'proximo',
  );
  const tieneHabsVencidas = emp.habilitaciones.some(
    (h) => getHabilitacionStatus(h.diasRestantes) === 'vencido',
  );

  let borderClass = 'reporte-card-border-ok';
  if (tieneHabsVencidas) borderClass = 'reporte-card-border-vencido';
  else if (tieneHabsProximas) borderClass = 'reporte-card-border-proximo';

  return (
    <div className={`reporte-card ${borderClass}`} data-reporte-id={emp.idEmpleado}>
      <div className="reporte-card-border" />

      <div className="reporte-card-body">
        {/* Header */}
        <div className="reporte-card-header">
          <div className="reporte-card-id">
            <span className="reporte-card-avatar">
              {emp.nombre.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
            </span>
            <div>
              <span className="reporte-card-nombre">{emp.nombre}</span>
              <span className="reporte-card-meta">
                {emp.cedula} &middot; {emp.categoria}
              </span>
            </div>
          </div>
          <div className="reporte-card-header-right">
            <span className="reporte-card-jornal-valor">
              <IconCalendar size={12} />
              {emp.diasConTrabajo} d&iacute;a{emp.diasConTrabajo !== 1 ? 's' : ''}
            </span>
            <button
              className="reporte-card-pdf"
              onClick={() => onExportPDF?.(emp.idEmpleado)}
              disabled={exportando}
              aria-label={`Exportar PDF de ${emp.nombre}`}
            >
              <IconDownload size={14} />
              {exportando ? '...' : 'PDF'}
            </button>
          </div>
        </div>

        {/* 2-column content */}
        <div className="reporte-card-content">
          {/* Left column - Tareas */}
          <div className="reporte-card-tareas-col">
            <div className="reporte-col-header">
              <IconClipboard size={14} />
              Tareas realizadas ({emp.totalTareas})
            </div>
            <div className="reporte-tareas-list">
              {emp.tareasAgrupadas.map((t) => (
                <div key={t.nombreCatalogo} className="reporte-tarea-row">
                  <div className="reporte-tarea-info">
                    <span className="reporte-tarea-nombre">{t.nombreCatalogo}</span>
                    <span className="reporte-tarea-meta">
                      {t.cantidad > 1 && <>&times;{t.cantidad}</>}
                    </span>
                  </div>
                  <span className="reporte-tarea-horas">{t.horas.toFixed(1)}h</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Stats */}
          <div className="reporte-card-stats-col">
            {/* Jornada */}
            <div className="reporte-stat-block">
              <div className="reporte-stat-block-header">
                <IconClock size={14} />
                Jornada
              </div>
              <div className="reporte-jornada-bar-track">
                <div className="reporte-jornada-bar-fill" style={{ width: `${pct}%` }} />
                <div className="reporte-jornada-bar-marker" style={{ left: `${emp.diasConTrabajo > 0 ? (8 / (emp.diasConTrabajo * 8)) * 100 : 0}%` }} />
              </div>
              <div className="reporte-jornada-labels">
                <span className="reporte-jornada-hrs">{emp.totalHoras.toFixed(1)}h</span>
                <span className="reporte-jornada-base">base: {emp.diasConTrabajo * 8}h</span>
              </div>
            </div>

            {/* Incentivo */}
            <div className="reporte-stat-block">
              <div className="reporte-stat-block-header">
                <IconTrendUp size={14} />
                Incentivo
              </div>
              <div className="reporte-stat-incentivo">
                <span className={`reporte-inc-horas ${incentivoH >= 0 ? 'reportes-incentivo-pos' : 'reportes-incentivo-neg'}`}>
                  {formatIncentivoHoras(incentivoH)}
                </span>
                <span className="reporte-inc-valor">{formatMoneda(incentivoV)}</span>
              </div>
            </div>

            {/* Habilitaciones */}
            <div className="reporte-stat-block">
              <div className="reporte-stat-block-header">
                Habilitaciones
              </div>
              {emp.habilitaciones.length === 0 ? (
                <div className="reporte-hab-empty">Sin habilitaciones</div>
              ) : (
                <div className="reporte-hab-list">
                  {emp.habilitaciones.map((h) => {
                    const status = getHabilitacionStatus(h.diasRestantes);
                    return (
                      <div key={h.nombre} className={`reporte-hab-item hab-${status}`}>
                        {status === 'vencido' ? (
                          <IconCross size={12} />
                        ) : status === 'proximo' ? (
                          <IconAlert size={12} />
                        ) : (
                          <IconCheck size={12} />
                        )}
                        <span className="reporte-hab-nombre">{h.nombre}</span>
                        {status === 'vencido' && (
                          <span className="reporte-hab-dias vencido">Vencida</span>
                        )}
                        {status === 'proximo' && (
                          <span className="reporte-hab-dias proximo">{h.diasRestantes}d</span>
                        )}
                        {status === 'ok' && (
                          <span className="reporte-hab-dias ok">{h.diasRestantes}d</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Página principal ─────────────────── */

function Reportes() {
  const [rango, setRango] = useState<RangoKey>('hoy');
  const [sortBy, setSortBy] = useState<SortKey>('nombre');
  const [viewMode, setViewMode] = useState<ViewMode>('paginado');
  const [pagina, setPagina] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportando, setExportando] = useState<'idle' | 'full'>('idle');
  const pageRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const [inicioDia, setInicioDia] = useState(today.getDate());
  const [inicioMes, setInicioMes] = useState(today.getMonth());
  const [inicioAnio, setInicioAnio] = useState(today.getFullYear());
  const [finDia, setFinDia] = useState(today.getDate());
  const [finMes, setFinMes] = useState(today.getMonth());
  const [finAnio, setFinAnio] = useState(today.getFullYear());
  const [empleadosDTO, setEmpleadosDTO] = useState<ReporteEmpleadoDTO[]>([]);
  const [paginaDTO, setPaginaDTO] = useState<ReporteEmpleadoDTO[]>([]);
  const [totalPaginasBackend, setTotalPaginasBackend] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDates = useCallback(() => {
    const inicioDate = new Date(inicioAnio, inicioMes, inicioDia);
    const finDate = new Date(finAnio, finMes, finDia);
    if (inicioDate > finDate) return null;
    const inicio = `${String(inicioAnio).padStart(4, '0')}-${String(inicioMes + 1).padStart(2, '0')}-${String(inicioDia).padStart(2, '0')}`;
    const hasta = `${String(finAnio).padStart(4, '0')}-${String(finMes + 1).padStart(2, '0')}-${String(finDia).padStart(2, '0')}`;
    return { inicio, hasta };
  }, [inicioAnio, inicioMes, inicioDia, finAnio, finMes, finDia]);

  function fetchReporte() {
    const dates = getDates();
    if (!dates) {
      setError('La fecha de inicio no puede ser posterior a la fecha fin');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getReporteBatch(dates)
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data as ReporteBatchPage).content;
        setEmpleadosDTO(arr);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function handleRangoChange(key: RangoKey) {
    setRango(key);
    setPagina(1);
    const now = new Date();
    const diaSemana = now.getDay() === 0 ? 7 : now.getDay();
    let dInicio: { dia: number; mes: number; anio: number };
    let dFin: { dia: number; mes: number; anio: number };
    switch (key) {
      case 'hoy':
        dInicio = dFin = { dia: now.getDate(), mes: now.getMonth(), anio: now.getFullYear() };
        break;
      case 'semana': {
        const diffLunes = 1 - diaSemana;
        const lunes = new Date(now);
        lunes.setDate(now.getDate() + diffLunes);
        const domingo = new Date(lunes);
        domingo.setDate(lunes.getDate() + 6);
        dInicio = { dia: lunes.getDate(), mes: lunes.getMonth(), anio: lunes.getFullYear() };
        dFin = { dia: domingo.getDate(), mes: domingo.getMonth(), anio: domingo.getFullYear() };
        break;
      }
      case 'mes': {
        const primerDia = new Date(now.getFullYear(), now.getMonth(), 1);
        const ultimoDia = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        dInicio = { dia: primerDia.getDate(), mes: primerDia.getMonth(), anio: primerDia.getFullYear() };
        dFin = { dia: ultimoDia.getDate(), mes: ultimoDia.getMonth(), anio: ultimoDia.getFullYear() };
        break;
      }
    }
    setInicioDia(dInicio.dia);
    setInicioMes(dInicio.mes);
    setInicioAnio(dInicio.anio);
    setFinDia(dFin.dia);
    setFinMes(dFin.mes);
    setFinAnio(dFin.anio);
  }

  /* ─── Exportar PDF ────────────────────── */

  const exportarPDFCompleto = useCallback(async () => {
    setExportando('full');
    document.body.classList.add('exportando-pdf');
    try {
      const dates = getDates();
      if (!dates) return;
      const element = pageRef.current;
      if (!element) return;
      await html2pdf()
        .set({
          ...PDF_OPTIONS,
          filename: dates.inicio === dates.hasta
            ? `reporte-diario-${dates.inicio}.pdf`
            : `reporte-diario-${dates.inicio}_a_${dates.hasta}.pdf`,
        })
        .from(element)
        .save();
    } catch (err) {
      console.error('Error al exportar PDF completo:', err);
    } finally {
      document.body.classList.remove('exportando-pdf');
      setExportando('idle');
    }
  }, [getDates]);

  const exportarPDFEmpleado = useCallback(async (idEmpleado: number) => {
    setExportando('full');
    document.body.classList.add('exportando-pdf');
    flushSync(() => {});
    try {
      const element = document.querySelector<HTMLElement>(`[data-reporte-id="${idEmpleado}"]`);
      if (!element) return;
      const emp = empleadosDTO.find((e) => e.idEmpleado === idEmpleado);
      const name = emp?.nombre.replace(/[^a-zA-Z0-9]/g, '_') || `empleado-${idEmpleado}`;
      const dates = getDates();
      const suffix = dates ? `_${dates.inicio}` : '';
      await html2pdf()
        .set({
          ...PDF_OPTIONS,
          margin: 12,
          filename: `reporte-${name}${suffix}.pdf`,
        })
        .from(element)
        .save();
    } catch (err) {
      console.error('Error al exportar PDF de empleado:', err);
    } finally {
      document.body.classList.remove('exportando-pdf');
      setExportando('idle');
    }
  }, [empleadosDTO, getDates]);

  useEffect(() => {
    fetchReporte();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inicioDia, inicioMes, inicioAnio, finDia, finMes, finAnio]);

  useEffect(() => {
    if (viewMode !== 'paginado') return;
    const dates = getDates();
    if (!dates) return;
    getReporteBatch({ ...dates, page: pagina - 1, size: PAGE_SIZE })
      .then((data) => {
        if (esPageResponse(data)) {
          setPaginaDTO(data.content);
          setTotalPaginasBackend(data.totalPages);
        }
      })
      .catch(() => {});
  }, [viewMode, pagina, getDates]);

  const empleados = useMemo(() => empleadosDTO.map(mapEmpleadoDTO), [empleadosDTO]);

  const searchLower = searchTerm.toLowerCase();
  const empleadosFiltrados = useMemo(() => {
    if (!searchTerm) return empleados;
    return empleados.filter(
      (e) =>
        e.nombre.toLowerCase().includes(searchLower) ||
        e.cedula.toLowerCase().includes(searchLower) ||
        e.categoria.toLowerCase().includes(searchLower),
    );
  }, [empleados, searchTerm]);

  const empleadosOrdenados = useMemo(() => {
    const copia = [...empleadosFiltrados];
    switch (sortBy) {
      case 'nombre':
        copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'horas':
        copia.sort((a, b) => b.totalHoras - a.totalHoras);
        break;
      case 'incentivo':
        copia.sort(
          (a, b) =>
            incentivoHoras(b.totalHoras, b.diasConTrabajo) -
            incentivoHoras(a.totalHoras, a.diasConTrabajo),
        );
        break;
    }
    return copia;
  }, [sortBy, empleadosFiltrados]);

  const totalPaginas = useMemo(() => {
    if (viewMode === 'paginado' && !searchTerm) {
      return Math.max(totalPaginasBackend, 1);
    }
    return Math.ceil(empleadosOrdenados.length / PAGE_SIZE);
  }, [viewMode, totalPaginasBackend, empleadosOrdenados.length, searchTerm]);

  const empleadosPagina = useMemo(() => {
    if (viewMode === 'paginado') {
      if (!searchTerm && paginaDTO.length > 0) {
        const mapped = paginaDTO.map(mapEmpleadoDTO);
        return mapped;
      }
      return empleadosOrdenados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
    }
    return empleadosOrdenados;
  }, [viewMode, pagina, empleadosOrdenados, paginaDTO, searchTerm]);

  const totalTareas = useMemo(() => empleados.reduce((s, e) => s + e.totalTareas, 0), [empleados]);
  const totalHoras = useMemo(() => empleados.reduce((s, e) => s + e.totalHoras, 0), [empleados]);
  const totalIncentivoH = useMemo(
    () => empleados.reduce((s, e) => s + incentivoHoras(e.totalHoras, e.diasConTrabajo), 0),
    [empleados],
  );
  const totalIncentivoV = useMemo(
    () =>
      empleados.reduce(
        (s, e) => s + incentivoValor(incentivoHoras(e.totalHoras, e.diasConTrabajo), e.valorJornal),
        0,
      ),
    [empleados],
  );

  return (
    <div className="reportes-page" ref={pageRef}>
      {/* SECCIÓN SUPERIOR (clara) */}
      <div className="reportes-top">
        <div className="page-header">
          <h2>Reportes Diarios</h2>
          <Button variant="primary" onClick={exportarPDFCompleto} disabled={exportando !== 'idle' || viewMode !== 'scroll'}>
            <IconDownload size={16} />
            {exportando !== 'idle' ? 'Generando PDF...' : viewMode !== 'scroll' ? 'PDF (vista scroll)' : 'Exportar PDF'}
          </Button>
        </div>

        {/* Filtros */}
        <div className="reportes-filtros">
          <div className="reportes-filtros-rango">
            <span className="reportes-filtros-label">Rango:</span>
            {(['hoy', 'semana', 'mes'] as RangoKey[]).map((key) => (
              <button
                key={key}
                className={`reportes-rango-btn ${rango === key ? 'active' : ''}`}
                onClick={() => handleRangoChange(key)}
              >
                {RANGO_LABELS[key]}
              </button>
            ))}
            <span className="reportes-filtros-fechas">
              <IconCalendar size={12} />
              <span className="reportes-filtros-label">Inicio:</span>
              <select className="reportes-select-date" value={inicioDia} onChange={e => setInicioDia(Number(e.target.value))}>
                {rangeOptions(1, 31).map(d => <option key={d} value={d}>{String(d).padStart(2, '0')}</option>)}
              </select>
              <select className="reportes-select-date" value={inicioMes} onChange={e => setInicioMes(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select className="reportes-select-date" value={inicioAnio} onChange={e => setInicioAnio(Number(e.target.value))}>
                {rangeOptions(2024, 2028).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <span className="reportes-filtros-sep">&mdash;</span>
              <span className="reportes-filtros-label">Fin:</span>
              <select className="reportes-select-date" value={finDia} onChange={e => setFinDia(Number(e.target.value))}>
                {rangeOptions(1, 31).map(d => <option key={d} value={d}>{String(d).padStart(2, '0')}</option>)}
              </select>
              <select className="reportes-select-date" value={finMes} onChange={e => setFinMes(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select className="reportes-select-date" value={finAnio} onChange={e => setFinAnio(Number(e.target.value))}>
                {rangeOptions(2024, 2028).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </span>
          </div>

          <div className="reportes-filtros-actions">
            <div className="reportes-filtros-field">
              <span className="reportes-filtros-label">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="reportes-select"
              >
                <option value="nombre">Nombre</option>
                <option value="horas">Horas</option>
                <option value="incentivo">Incentivo</option>
              </select>
            </div>

            <div className="reportes-filtros-field">
              <span className="reportes-filtros-label">Vista:</span>
              <div className="reportes-view-toggle">
                <button
                  className={`reportes-view-btn ${viewMode === 'paginado' ? 'active' : ''}`}
                  onClick={() => { setPagina(1); setViewMode('paginado'); }}
                >
                  Paginado
                </button>
                <button
                  className={`reportes-view-btn ${viewMode === 'scroll' ? 'active' : ''}`}
                  onClick={() => setViewMode('scroll')}
                >
                  Scroll
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="reportes-resumen">
          <div className="reportes-resumen-card">
            <span className="reportes-resumen-icon">
              <IconClipboard size={22} />
            </span>
            <div>
              <span className="reportes-resumen-valor">{totalTareas}</span>
              <span className="reportes-resumen-label">Tareas realizadas</span>
            </div>
          </div>
          <div className="reportes-resumen-card">
            <span className="reportes-resumen-icon">
              <IconClock size={22} />
            </span>
            <div>
              <span className="reportes-resumen-valor">{totalHoras.toFixed(1)}<small>h</small></span>
              <span className="reportes-resumen-label">
                Horas totales &middot; {empleados.length} empleados
              </span>
            </div>
          </div>
          <div className="reportes-resumen-card">
            <span className="reportes-resumen-icon">
              <IconTrendUp size={22} />
            </span>
            <div>
              <span className={`reportes-resumen-valor ${totalIncentivoH >= 0 ? 'reportes-incentivo-pos' : 'reportes-incentivo-neg'}`}>
                {formatIncentivoHoras(totalIncentivoH)}
              </span>
              <span className="reportes-resumen-label">
                Incentivo &middot; {formatMoneda(totalIncentivoV)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR (oscura) */}
      <div className="reportes-bottom">
        <div className="reportes-bottom-header">
          <div className="reportes-bottom-header-left">
            <h3>Empleados ({empleadosOrdenados.length})</h3>
            <span className="reportes-bottom-subtitle">
              {rango === 'hoy' && 'Reporte del d\u00eda de hoy'}
              {rango === 'semana' && 'Reporte de la semana actual'}
              {rango === 'mes' && 'Reporte del mes actual'}
            </span>
          </div>
          <div className="reportes-search-wrap">
            <IconSearch size={14} />
            <input
              className="reportes-search-input"
              type="text"
              placeholder="Buscar empleado..."
              value={searchTerm}
              onChange={(e) => { setPagina(1); setSearchTerm(e.target.value); }}
            />
            {searchTerm && (
              <button className="reportes-search-clear" onClick={() => { setPagina(1); setSearchTerm(''); }} aria-label="Limpiar búsqueda">
                &times;
              </button>
            )}
          </div>
        </div>

        {viewMode === 'paginado' && totalPaginas > 1 && (
          <div className="reportes-pagination-top">
            <span className="reportes-pag-info">
              P&aacute;g. {pagina} de {totalPaginas}
            </span>
            <div className="reportes-pag-controls">
              <button
                className="reportes-pag-btn"
                disabled={pagina <= 1}
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
              >
                &larr; Anterior
              </button>
              <button
                className="reportes-pag-btn"
                disabled={pagina >= totalPaginas}
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              >
                Siguiente &rarr;
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="reportes-list" style={{ padding: '20px 0', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
            Cargando reporte...
          </div>
        ) : error ? (
          <div className="reportes-list" style={{ padding: '20px 0', textAlign: 'center', color: 'var(--status-error)', fontSize: 13 }}>
            {error}
            <div style={{ marginTop: 12 }}>
              <Button variant="secondary" onClick={fetchReporte}>
                Reintentar
              </Button>
            </div>
          </div>
        ) : (
          <div className="reportes-list">
            {empleadosPagina.map((emp) => (
              <ReporteEmpleadoCard key={emp.idEmpleado} emp={emp} onExportPDF={exportarPDFEmpleado} exportando={exportando !== 'idle'} />
            ))}
          </div>
        )}

        {viewMode === 'paginado' && totalPaginas > 1 && (
          <div className="reportes-pagination-bottom">
            <div className="reportes-pag-pages">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`reportes-pag-page ${pagina === p ? 'active' : ''}`}
                  onClick={() => setPagina(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;
