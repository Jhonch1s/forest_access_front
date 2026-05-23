import { useState, useEffect } from 'react';
import type { EmpleadoResponse } from '../types/empleado';
import { getEmpleados } from '../services/empleadoService';

export function useEmpleados() {
  const [empleados, setEmpleados] = useState<EmpleadoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const data = await getEmpleados();
      setEmpleados(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, [refreshKey]); 

  const refetch = () => setRefreshKey(prev => prev + 1);

  return { empleados, loading, error, refetch };
}