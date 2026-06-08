import { useState, useEffect, useCallback } from 'react';
import type { EmpleadoResponse } from '../types/empleado';
import { obtenerEmpleadosPaginados } from '../services/empleadoService';

export function useEmpleados(pageSize:number = 5) {
  const [empleados, setEmpleados] = useState<EmpleadoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filtroActivo,setFiltroActivo] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchEmpleados = useCallback(async (page:number) => {
    setLoading(true);
    try {
      const offset = (page - 1 ) * pageSize;
      const data = await obtenerEmpleadosPaginados(offset,pageSize,filtroActivo);
      setEmpleados(data.empleados);
      setTotalItems(data.total);
      setTotalPages(Math.ceil(data.total / pageSize));
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  },[pageSize,filtroActivo]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchEmpleados(page);
    }
  };

  const filtrar = () => {
    setFiltroActivo(prev => !prev);
    setCurrentPage(1);
  }

  const refetch = () => fetchEmpleados(currentPage);

  useEffect(() => {
    fetchEmpleados(1);
  }, [fetchEmpleados]); 


  return { empleados, loading, error,currentPage, totalPages, goToPage,filtrar,filtroActivo, refetch };
}