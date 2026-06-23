import { useState, useEffect, useCallback } from 'react';
import { obtenerCuadrillasPaginadas, getUltimosMiembros } from '../services/cuadrillaService';

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
  cantidadMiembros: number;
  miembros: MiembroUI[]; 
}

export function useCuadrillas(mostrarHistorial: boolean = false, itemsPorPagina: number = 4) {
  const [cuadrillas, setCuadrillas] = useState<CuadrillaUI[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setPaginaActual(1);
  }, [mostrarHistorial]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const offset = (paginaActual - 1) * itemsPorPagina;
      
      //obtener la página de cuadrillas del backend
      const data = await obtenerCuadrillasPaginadas(offset, itemsPorPagina, !mostrarHistorial);
      
      const cuadrillasProcesadas = data.cuadrillas.map((cuadrilla) => {
          return {
            idCuadrilla: cuadrilla.idCuadrilla,
            nombre: cuadrilla.nombre,
            activa: cuadrilla.activa,
            puntero: 'Cargando...',
            cantidadMiembros: 0,
            miembros: [] 
          };
      });

      setCuadrillas(cuadrillasProcesadas);
      setTotalPaginas(Math.ceil(data.total / itemsPorPagina) || 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar cuadrillas');
    } finally {
      setLoading(false);
    }
  }, [paginaActual, mostrarHistorial, itemsPorPagina, refreshKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => setRefreshKey(k => k + 1);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return { 
    cuadrillas, 
    loading, 
    error, 
    refetch,
    paginaActual,
    totalPaginas,
    cambiarPagina
  };
}