import { useState, useEffect } from 'react';
import type { EmpleadoDTO } from '../types/empleado';
import { getEmpleados } from '../services/empleadoService';

export function useEmpleados() {
  const [empleados, setEmpleados] = useState<EmpleadoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getEmpleados()
      .then(setEmpleados)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refreshKey]);


  const refetch = () => setRefreshKey((k) => k + 1);
  return { empleados, loading, error, refetch };
}