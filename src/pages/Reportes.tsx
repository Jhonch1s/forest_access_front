import { useState, useMemo } from 'react';
import Button from '../components/Button';
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

/* ─── Mock data ─────────────────────────── */

const VALOR_JORNAL_BASE = 1200;

const MOCK_EMPLEADOS: ReporteEmpleado[] = [
  {
    idEmpleado: 1,
    nombre: 'Juan Pérez',
    cedula: '5.123.456-7',
    categoria: 'Operario',
    valorJornal: VALOR_JORNAL_BASE,
    totalTareas: 4,
    totalHoras: 10.5,
    diasConTrabajo: 1,
    tareasAgrupadas: [
      { nombreCatalogo: 'Desmalezado manual', cantidad: 2, horas: 5.0 },
      { nombreCatalogo: 'Aplicaci\u00f3n herbicida', cantidad: 1, horas: 3.5 },
      { nombreCatalogo: 'Poda de formaci\u00f3n', cantidad: 1, horas: 2.0 },
    ],
    habilitaciones: [
      { nombre: 'Motosierra', fechaVencimiento: '2026-06-15', diasRestantes: 12 },
      { nombre: 'Manejo de agroqu\u00edmicos', fechaVencimiento: '2026-09-20', diasRestantes: 109 },
    ],
  },
  {
    idEmpleado: 2,
    nombre: 'Mar\u00eda Garc\u00eda',
    cedula: '3.987.654-1',
    categoria: 'Tractorista',
    valorJornal: VALOR_JORNAL_BASE + 300,
    totalTareas: 3,
    totalHoras: 7.0,
    diasConTrabajo: 1,
    tareasAgrupadas: [
      { nombreCatalogo: 'Arado', cantidad: 2, horas: 4.5 },
      { nombreCatalogo: 'Rastraje', cantidad: 1, horas: 2.5 },
    ],
    habilitaciones: [],
  },
  {
    idEmpleado: 3,
    nombre: 'Carlos L\u00f3pez',
    cedula: '2.456.789-3',
    categoria: 'Operario',
    valorJornal: VALOR_JORNAL_BASE,
    totalTareas: 5,
    totalHoras: 12.0,
    diasConTrabajo: 1,
    tareasAgrupadas: [
      { nombreCatalogo: 'Desmalezado manual', cantidad: 3, horas: 7.5 },
      { nombreCatalogo: 'Poda de formaci\u00f3n', cantidad: 2, horas: 4.5 },
    ],
    habilitaciones: [
      { nombre: 'Motosierra', fechaVencimiento: '2026-05-30', diasRestantes: -4 },
      { nombre: 'Manejo de agroqu\u00edmicos', fechaVencimiento: '2026-07-01', diasRestantes: 28 },
    ],
  },
  {
    idEmpleado: 4,
    nombre: 'Ana Mart\u00ednez',
    cedula: '4.567.890-2',
    categoria: 'Capataz',
    valorJornal: VALOR_JORNAL_BASE + 600,
    totalTareas: 2,
    totalHoras: 8.0,
    diasConTrabajo: 1,
    tareasAgrupadas: [
      { nombreCatalogo: 'Supervisi\u00f3n', cantidad: 2, horas: 8.0 },
    ],
    habilitaciones: [
      { nombre: 'Manejo de agroqu\u00edmicos', fechaVencimiento: '2026-06-10', diasRestantes: 7 },
    ],
  },
  {
    idEmpleado: 5,
    nombre: 'Pedro Rodr\u00edguez',
    cedula: '2.345.678-9',
    categoria: 'Operario',
    valorJornal: VALOR_JORNAL_BASE,
    totalTareas: 4,
    totalHoras: 9.5,
    diasConTrabajo: 1,
    tareasAgrupadas: [
      { nombreCatalogo: 'Aplicaci\u00f3n herbicida', cantidad: 2, horas: 5.0 },
      { nombreCatalogo: 'Fertilizaci\u00f3n', cantidad: 1, horas: 2.5 },
      { nombreCatalogo: 'Desmalezado manual', cantidad: 1, horas: 2.0 },
    ],
    habilitaciones: [
      { nombre: 'Manejo de agroqu\u00edmicos', fechaVencimiento: '2026-11-15', diasRestantes: 165 },
      { nombre: 'Motosierra', fechaVencimiento: '2026-08-01', diasRestantes: 59 },
    ],
  },
  {
    idEmpleado: 6,
    nombre: 'Luc\u00eda Fern\u00e1ndez',
    cedula: '3.456.789-0',
    categoria: 'Tractorista',
    valorJornal: VALOR_JORNAL_BASE + 300,
    totalTareas: 3,
    totalHoras: 6.5,
    diasConTrabajo: 1,
    tareasAgrupadas: [
      { nombreCatalogo: 'Arado', cantidad: 2, horas: 4.0 },
      { nombreCatalogo: 'Nivelaci\u00f3n', cantidad: 1, horas: 2.5 },
    ],
    habilitaciones: [
      { nombre: 'Motosierra', fechaVencimiento: '2026-05-20', diasRestantes: -16 },
    ],
  },
  {
    idEmpleado: 7,
    nombre: 'Diego Ram\u00edrez',
    cedula: '4.789.012-5',
    categoria: 'Operario',
    valorJornal: VALOR_JORNAL_BASE,
    totalTareas: 5,
    totalHoras: 11.0,
    diasConTrabajo: 1,
    tareasAgrupadas: [
      { nombreCatalogo: 'Desmalezado manual', cantidad: 2, horas: 5.0 },
      { nombreCatalogo: 'Poda de formaci\u00f3n', cantidad: 2, horas: 4.0 },
      { nombreCatalogo: 'Aplicaci\u00f3n herbicida', cantidad: 1, horas: 2.0 },
    ],
    habilitaciones: [
      { nombre: 'Manejo de agroqu\u00edmicos', fechaVencimiento: '2026-06-05', diasRestantes: 2 },
      { nombre: 'Motosierra', fechaVencimiento: '2026-07-15', diasRestantes: 42 },
    ],
  },
];

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
  return Math.min(100, (totalHoras / (diasConTrabajo * 8)) * 100);
}

const RANGO_LABELS: Record<RangoKey, string> = {
  hoy: 'Hoy',
  semana: 'Semana',
  mes: 'Mes',
};

/* ─── Componente ReporteEmpleadoCard ────── */

function ReporteEmpleadoCard({ emp }: { emp: ReporteEmpleado }) {
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
    <div className={`reporte-card ${borderClass}`}>
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
              onClick={() => window.print()}
              aria-label={`Exportar PDF de ${emp.nombre}`}
            >
              <IconDownload size={14} />
              PDF
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
                <div className="reporte-jornada-bar-marker" style={{ left: `${(8 / (emp.diasConTrabajo * 8)) * 100}%` }} />
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

  const empleadosOrdenados = useMemo(() => {
    const copia = [...MOCK_EMPLEADOS];
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
  }, [sortBy]);

  const totalPaginas = Math.ceil(empleadosOrdenados.length / PAGE_SIZE);
  const empleadosPagina = viewMode === 'paginado'
    ? empleadosOrdenados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE)
    : empleadosOrdenados;

  const totalTareas = useMemo(() => MOCK_EMPLEADOS.reduce((s, e) => s + e.totalTareas, 0), []);
  const totalHoras = useMemo(() => MOCK_EMPLEADOS.reduce((s, e) => s + e.totalHoras, 0), []);
  const totalIncentivoH = useMemo(
    () => MOCK_EMPLEADOS.reduce((s, e) => s + incentivoHoras(e.totalHoras, e.diasConTrabajo), 0),
    [],
  );
  const totalIncentivoV = useMemo(
    () =>
      MOCK_EMPLEADOS.reduce(
        (s, e) => s + incentivoValor(incentivoHoras(e.totalHoras, e.diasConTrabajo), e.valorJornal),
        0,
      ),
    [],
  );

  return (
    <div className="reportes-page">
      {/* SECCIÓN SUPERIOR (clara) */}
      <div className="reportes-top">
        <div className="page-header">
          <h2>Reportes Diarios</h2>
          <Button variant="primary" onClick={() => window.print()}>
            <IconDownload size={16} />
            Exportar PDF
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
                onClick={() => setRango(key)}
              >
                {RANGO_LABELS[key]}
              </button>
            ))}
            <span className="reportes-filtros-fechas">
              <IconCalendar size={12} />
              01/06/2026 &mdash; 01/06/2026
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
                Horas totales &middot; {MOCK_EMPLEADOS.length} empleados
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
          <h3>Empleados ({empleadosOrdenados.length})</h3>
          <span className="reportes-bottom-subtitle">
            {rango === 'hoy' && 'Reporte del d\u00eda de hoy'}
            {rango === 'semana' && 'Reporte de la semana actual'}
            {rango === 'mes' && 'Reporte del mes actual'}
          </span>
        </div>

        {viewMode === 'paginado' && empleadosOrdenados.length > PAGE_SIZE && (
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

        <div className="reportes-list">
          {empleadosPagina.map((emp) => (
            <ReporteEmpleadoCard key={emp.idEmpleado} emp={emp} />
          ))}
        </div>

        {viewMode === 'paginado' && empleadosOrdenados.length > PAGE_SIZE && (
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
