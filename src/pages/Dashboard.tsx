import { useState } from 'react';
import './Dashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend,} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

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
  const [cuadrillaSeleccionada, setCuadrillaSeleccionada] = useState(null); 
  const [misCuadrillas, setMisCuadrillas] = useState([
    { id: 1, nombre: "Cuadrilla Alfa", tratamiento: "Fumigación de malezas", fecha: "15/06/2026" },
    { id: 2, nombre: "Cuadrilla Beta", tratamiento: "Control de plagas", fecha: "16/06/2026" },
    { id: 3, nombre: "Cuadrilla Gamma", tratamiento: "Poda preventiva", fecha: "17/06/2026" }
  ]);

  // Datos para la gráfica de barras
  const barData = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    datasets: [
      {
        label: 'Tareas Realizadas',
        data: [12, 19, 15, 22, 30],
        backgroundColor: '#226583',
        borderRadius: 6,
      },
    ],
  };

  // datos para la gráfica de líneas
  const lineData = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [
      {
        label: 'Horas Trabajadas',
        data: [120, 150, 140, 180],
        borderColor: '#308230',
        backgroundColor: 'rgba(48, 130, 48, 0.1)',
        pointBackgroundColor: '#308230',
        fill: true,
        tension: 0.4, //esto hace que la línea sea curva
      },
    ],
  };

  // Datos para la gráfica circular
  const doughnutData = {
    labels: ['En proceso', 'Pendientes', 'Finalizadas'],
    datasets: [
      {
        data: [10, 5, 25],
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

  // Opciones generales para que las gráficas se adapten al contenedor
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
        return "#ebf1b4ff";
      case "Vencida":
        return "#ee7d90ff";
    }
  };

  const Habilitaciones = [
    { id: 1, trabajo: "Permiso de trabajo 1", area: "Area 1", fecha: "15/06/2026", estado: "Por vencer", empleado: "Juan Perez" },
    { id: 2, trabajo: "Permiso de trabajo 2", area: "Area 2", fecha: "16/06/2026", estado: "Vencida", empleado: "Pepito" },
    { id: 3, trabajo: "Permiso de trabajo 3", area: "Area 3", fecha: "17/06/2026", estado: "Por vencer", empleado: "Periquito" },
    { id: 4, trabajo: "Permiso de trabajo 4", area: "Area 4", fecha: "18/06/2026", estado: "Vencida", empleado: "Juan Perez" },
    { id: 5, trabajo: "Permiso de trabajo 5", area: "Area 5", fecha: "19/06/2026", estado: "Vencida", empleado: "Pepito" },
    { id: 6, trabajo: "Permiso de trabajo 6", area: "Area 6", fecha: "20/06/2026", estado: "Por vencer", empleado: "Periquito" }
  ];

  const [estadosOcultos, setEstadosOcultos] = useState([]);

  const toggleFiltroEstado = (estado) => {
    if (estadosOcultos.includes(estado)) {
    // Si ya estaba oculto, lo removemos del array
      setEstadosOcultos(estadosOcultos.filter(e => e !== estado));
    } else {
    // Si estaba visible, lo agregamos al array (se oculta)
      setEstadosOcultos([...estadosOcultos, estado]);
    }
  };
  
  //para hacer los acordeones y que se escondan si no tienen datos
  const [mostrarHabilitaciones, setMostrarHabilitaciones] = useState(true);
  const [mostrarCuadrillas, setMostrarCuadrillas] = useState(true);

  //filtro para que solo se muestren las habilitaciones que no esten ocultas
  const habilitacionesVisibles = Habilitaciones.filter((habilitacion) => !estadosOcultos.includes(habilitacion.estado));

  return (
  <div className="dashboard-container">
    <h2>Dashboard</h2>
    {habilitacionesVisibles.length > 0 && (
    <div className="dashboard-card posicion-relativa-tarjeta">
      <h3>Habilitaciones por vencer</h3>
      <p className="text-muted">Permisos de trabajo que venceran en los próximos 7 días</p>
      
      <div className="leyenda-habilitaciones">
        <div 
          className={`leyenda-item ${estadosOcultos.includes("Vencida") ? 'desactivado' : ''}`} 
          onClick={() => toggleFiltroEstado("Vencida")}
        >
          <span className="cuadradito-color" style={{ backgroundColor: "#ee7d90ff" }}></span>
          <span>Vencidas</span>
        </div>
        <div 
          className={`leyenda-item ${estadosOcultos.includes("Por vencer") ? 'desactivado' : ''}`} 
          onClick={() => toggleFiltroEstado("Por vencer")}
        >
          <span className="cuadradito-color" style={{ backgroundColor: "#ebf1b4ff" }}></span>
          <span>Por vencer</span>
        </div>
      </div>

      <div className="dashboard-card-habilitacion">
        {Habilitaciones.filter((habilitacion) => !estadosOcultos.includes(habilitacion.estado)).map((habilitacion) => (
            <div key={habilitacion.id} className="habilitacion-caja" style={{ backgroundColor: colorEstadoHabilitacion(habilitacion.estado) }}>
              <p><strong>{habilitacion.empleado}</strong></p>
              <p>{habilitacion.trabajo}</p>
              <p>{habilitacion.fecha}</p>
            </div>
          ))}
      </div>
    </div>
    )}

    {habilitacionesVisibles.length === 0 && (
      <div className="dashboard-card posicion-relativa-tarjeta">
      <h3>Habilitaciones por vencer</h3>
      <p className="text-muted">No hay habilitaciones</p>
      <div className="leyenda-habilitaciones">
        <div 
          className={`leyenda-item ${estadosOcultos.includes("Vencida") ? 'desactivado' : ''}`} 
          onClick={() => toggleFiltroEstado("Vencida")}
        >
          <span className="cuadradito-color" style={{ backgroundColor: "#ee7d90ff" }}></span>
          <span>Vencidas</span>
        </div>
        <div 
          className={`leyenda-item ${estadosOcultos.includes("Por vencer") ? 'desactivado' : ''}`} 
          onClick={() => toggleFiltroEstado("Por vencer")}
        >
          <span className="cuadradito-color" style={{ backgroundColor: "#ebf1b4ff" }}></span>
          <span>Por vencer</span>
        </div>
      </div>
      </div>
    )}

      <div className="dashboard-grid">
        {/* panel izquierdo: lista de cuadrillas */}
        <div className="dashboard-panel">
          <h3>Cuadrillas con tratamientos hoy</h3>
          <div className="cuadrillas-lista">
            {misCuadrillas.map((cuadrilla) => (
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
        
        {/* panel derecho, gaficas, habilitaciones y detalles */}
        <div>
          {!cuadrillaSeleccionada ? (
            <div className="dashboard-panel-derecho">
              
              <div className="dashboard-card">
                <h3>Resumen de Tareas</h3>
                
                <div className="graficas-grid">
                  {/* 1. Gráfica de Barras */}
                  <div className="grafica-wrapper">
                    <h4>Productividad Semanal</h4>
                    <div className="grafica-canvas-container">
                      <Bar data={barData} options={chartOptions} />
                    </div>
                  </div>

                  {/* 2. Gráfica de Líneas */}
                  <div className="grafica-wrapper">
                    <h4>Evolución de Horas</h4>
                    <div className="grafica-canvas-container">
                      <Line data={lineData} options={chartOptions} />
                    </div>
                  </div>

                  {/* 3. Gráfica Circular */}
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
