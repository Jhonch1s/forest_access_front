import { useState, useEffect } from 'react';
import './Dashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { getDashboardData } from '../services/dashboardService';
import type { DashboardDTO, CuadrillaResumenDTO } from '../types/dashboard';

// registramos los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [cuadrillaSeleccionada, setCuadrillaSeleccionada] = useState<CuadrillaResumenDTO | null>(null); 
  const [dashboardData, setDashboardData] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err: unknown) {
        console.error(err);
        setError("Error al cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const [estadosOcultos, setEstadosOcultos] = useState<string[]>([]);

  const toggleFiltroEstado = (estado: string) => {
    if (estadosOcultos.includes(estado)) {
      setEstadosOcultos(estadosOcultos.filter(e => e !== estado));
    } else {
      setEstadosOcultos([...estadosOcultos, estado]);
    }
  };
  
  const [mostrarHabilitaciones, setMostrarHabilitaciones] = useState(true);
  const [mostrarCuadrillas, setMostrarCuadrillas] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '300px' }}>
        <div className="dashboard-spinner" />
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p style={{ color: 'var(--status-error)' }}>{error || "Error desconocido"}</p>
      </div>
    );
  }

  const { cuadrillasActivas, habilitacionesPorVencer, estadisticas } = dashboardData;

  // Datos para la gráfica de barras
  const barData = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    datasets: [
      {
        label: 'Tareas Realizadas',
        data: estadisticas.productividadSemanal,
        backgroundColor: '#226583',
        borderRadius: 6,
      },
    ],
  };

  // datos para la gráfica de líneas
  const lineData = {
    labels: estadisticas.labelsSemanas,
    datasets: [
      {
        label: 'Horas Trabajadas',
        data: estadisticas.evolucionHoras,
        borderColor: '#308230',
        backgroundColor: 'rgba(48, 130, 48, 0.1)',
        pointBackgroundColor: '#308230',
        fill: true,
        tension: 0.4, 
      },
    ],
  };

  // Datos para la gráfica circular
  const doughnutData = {
    labels: ['En proceso', 'Pendientes', 'Finalizadas'],
    datasets: [
      {
        data: [
          estadisticas.estadoTareas['En proceso'] || 0,
          estadisticas.estadoTareas['Pendiente'] || 0,
          estadisticas.estadoTareas['Finalizada'] || 0
        ],
        backgroundColor: [
          '#5a80aa',
          '#c41e3a',
          '#308230',
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  const colorEstadoHabilitacion = (estado: string) => {
    switch (estado) {
      case "Por vencer":
        return { background: "#fff3cd", color: "#856404", borderLeft: "4px solid #ffc107" };
      case "Vencida":
        return { background: "#f8d7da", color: "#721c24", borderLeft: "4px solid #dc3545" };
    }
    return {};
  };
  
  //filtro para que solo se muestren las habilitaciones que no esten ocultas
  const habilitacionesVisibles = habilitacionesPorVencer.filter((habilitacion) => {
    if (estadosOcultos.includes(habilitacion.estado)) return false;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      return habilitacion.empleado.toLowerCase().includes(lowerSearch) || 
             habilitacion.trabajo.toLowerCase().includes(lowerSearch);
    }
    return true;
  });

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      
            {/* Acordeón Habilitaciones */}
            {habilitacionesPorVencer.length > 0 && (
              <div className="dashboard-card posicion-relativa-tarjeta">
                <div className="dashboard-card-header" onClick={() => setMostrarHabilitaciones(!mostrarHabilitaciones)}>
                  <h3>Habilitaciones por vencer</h3>
                  <span className="flecha-acordeon">{mostrarHabilitaciones ? '▲' : '▼'}</span>
                </div>
              
                {mostrarHabilitaciones && (
                  <div className="dashboard-card-body">
                    <div className="habilitaciones-body-header">
                      <p className="text-muted">Permisos de trabajo que vencerán en los próximos 7 días</p>
                      
                      <div className="leyenda-habilitaciones alineada-derecha">
                        <input 
                          type="text" 
                          placeholder="Buscar empleado o permiso..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="habilitaciones-search"
                        />
                        <div 
                          className={`leyenda-item ${estadosOcultos.includes("Vencida") ? 'desactivado' : ''}`} 
                          onClick={() => toggleFiltroEstado("Vencida")}
                        >
                          <span className="cuadradito-color" style={{ backgroundColor: "#f8d7da" }}></span>
                          <span>Vencidas</span>
                        </div>
                        <div 
                          className={`leyenda-item ${estadosOcultos.includes("Por vencer") ? 'desactivado' : ''}`} 
                          onClick={() => toggleFiltroEstado("Por vencer")}
                        >
                          <span className="cuadradito-color" style={{ backgroundColor: "#fff3cd" }}></span>
                          <span>Por vencer</span>
                        </div>
                      </div>
                    </div>
                
                    {habilitacionesVisibles.length > 0 ? (
                      <div className="dashboard-card-habilitacion">
                        {habilitacionesVisibles.map((habilitacion) => (
                          <div key={habilitacion.id} className="habilitacion-caja" style={colorEstadoHabilitacion(habilitacion.estado)}>
                            <p style={{ color: colorEstadoHabilitacion(habilitacion.estado).color }}><strong>{habilitacion.empleado}</strong></p>
                            <p style={{ color: colorEstadoHabilitacion(habilitacion.estado).color }}>{habilitacion.trabajo}</p>
                            <p style={{ color: colorEstadoHabilitacion(habilitacion.estado).color }}>{habilitacion.fecha}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-datos-mensaje">No hay habilitaciones para mostrar con los filtros activos.</p>
                    )}
                  </div>
                )}
              </div>
            )}
      <div className={`dashboard-layout-dinamico ${mostrarCuadrillas && cuadrillasActivas.length > 0 ? 'con-cuadrillas' : 'solo-graficas'}`}>
        {/* Acordeón Cuadrillas */}
        {cuadrillasActivas.length > 0 && (
          <div className="dashboard-card posicion-relativa-tarjeta cuadrillas-tarjeta-acordeon">
            <div className="dashboard-card-header" onClick={() => setMostrarCuadrillas(!mostrarCuadrillas)}>
              <h3>Cuadrillas con tratamientos hoy</h3>
              <span className="flecha-acordeon">{mostrarCuadrillas ? '▲' : '▼'}</span>
            </div>

            {mostrarCuadrillas && (
              <div className="dashboard-card-body">
                <div className="cuadrillas-lista">
                  {cuadrillasActivas.map((cuadrilla) => (
                    <button 
                      key={cuadrilla.id} 
                      onClick={() => setCuadrillaSeleccionada(cuadrilla)} 
                      className={`cuadrilla-btn ${cuadrillaSeleccionada?.id === cuadrilla.id ? 'active' : ''}`}
                    >
                      {cuadrilla.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Parte derecha: Gráficas y Detalle Cuadrilla */}
        <div className="dashboard-main-content">
          {!cuadrillaSeleccionada ? (
            <div className="dashboard-panel-derecho">
              <div className="dashboard-card">
                <h3>Resumen de Tareas</h3>
                <div className="graficas-grid">
                  {/* Gráfica de Barras */}
                  <div className="grafica-wrapper">
                    <h4>Productividad Semanal</h4>
                    <div className="grafica-canvas-container">
                      <Bar data={barData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Gráfica de Líneas */}
                  <div className="grafica-wrapper">
                    <h4>Evolución de Horas</h4>
                    <div className="grafica-canvas-container">
                      <Line data={lineData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Gráfica Circular */}
                  <div className="grafica-wrapper grafica-full-width">
                    <h4>Estado Actual de Tareas</h4>
                    <div className="grafica-canvas-container doughnut-container">
                      <Doughnut data={doughnutData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard-card cuadrilla-detalle">
              <h2>{cuadrillaSeleccionada.nombre}</h2>
              <div className="detalle-info">
                <p><strong>Tratamiento:</strong> {cuadrillaSeleccionada.tratamiento}</p>
                <p><strong>Fecha de inicio:</strong> {cuadrillaSeleccionada.fecha}</p>
              </div>
              
              <button onClick={() => setCuadrillaSeleccionada(null)} className="btn-volver">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
