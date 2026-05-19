import { useState, useEffect } from 'react';
import type { TratamientoDTO } from '../types/tarea';
import { getTratamientos } from '../services/tratamientoService';

export function useTratamientos() {
  const [tratamientos, setTratamientos] = useState<TratamientoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTratamientos()
      .then((data) => {
        if (!cancelled) setTratamientos(data);
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

  return { tratamientos, loading, error, refetch };
}
