import { useState, useEffect } from 'react';
import type { TratamientoDependenciaResponse } from '../types/tarea';
import api from '../services/api';

export function useTratamientoDependencias() {
  const [dependencias, setDependencias] = useState<TratamientoDependenciaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get('/tratamientos-dependencias')
      .then((res) => {
        if (!cancelled) setDependencias(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error desconocido');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const refetch = () => setRefreshKey((k) => k + 1);

  return { dependencias, loading, error, refetch };
}
