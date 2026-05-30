import { useState, useEffect } from 'react';
import { getCuadrillasActivas, getHistorialCuadrillas } from '../services/cuadrillaService';
import { getEmpleadosCuadrillas } from '../services/empleadoCuadrillaService';

export interface MiembroUI {
  id: number;
  nombre: string;
  iniciales: string;
  rol: string;
}

export interface CuadrillaUI {
  idCuadrilla: number;
  nombre: string;
  activa: boolean;
  puntero: string;
  miembros: MiembroUI[]; 
}

export function useCuadrillas(mostrarHistorial: boolean = false, itemsPorPagina: number = 4) {
  const [allCuadrillas, setAllCuadrillas] = useState<CuadrillaUI[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setPaginaActual(1);
  }, [mostrarHistorial]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [cuadrillasData, empleadosData] = await Promise.all([
          mostrarHistorial ? getHistorialCuadrillas() : getCuadrillasActivas(),
          getEmpleadosCuadrillas()
        ]);

        const cuadrillasProcesadas = cuadrillasData.map((cuadrilla) => {
          const miembros = empleadosData.filter((emp) => {
            if (emp.idCuadrilla !== cuadrilla.idCuadrilla) return false;
            if (mostrarHistorial) return true;
            return emp.esActivo === true || !emp.fechaFin;
          });

          const punteroObj = miembros.find((emp) => 
            emp.rol && (emp.rol.toLowerCase().includes('puntero') || emp.rol.toLowerCase().includes('capataz'))
          );
          const nombrePuntero = punteroObj ? punteroObj.nombreEmpleado : 'Sin asignar';

          const miembrosCompletos: MiembroUI[] = miembros.map(emp => {
            const partes = emp.nombreEmpleado.split(' ');
            const iniciales = partes.length > 1 ? partes[0][0] + partes[1][0] : partes[0][0];
            return {
              id: emp.idEmpleado,
              nombre: emp.nombreEmpleado,
              iniciales: iniciales.toUpperCase(),
              rol: emp.rol || 'Sin rol'
            };
          });

          return {
            idCuadrilla: cuadrilla.idCuadrilla,
            nombre: cuadrilla.nombre,
            activa: cuadrilla.activa,
            puntero: nombrePuntero,
            miembros: miembrosCompletos 
          };
        });

        setAllCuadrillas(cuadrillasProcesadas);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al cargar cuadrillas');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [refreshKey, mostrarHistorial]);

  const refetch = () => setRefreshKey(k => k + 1);

  const totalPaginas = Math.ceil(allCuadrillas.length / itemsPorPagina) || 1;
  
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const cuadrillasPaginadas = allCuadrillas.slice(indicePrimerItem, indiceUltimoItem);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return { 
    cuadrillas: cuadrillasPaginadas, 
    loading, 
    error, 
    refetch,
    paginaActual,
    totalPaginas,
    cambiarPagina
  };
}