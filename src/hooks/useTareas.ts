import { useState, useEffect, useCallback } from 'react';
import { getTareas } from '../services/tareaService';
import type { TareaResponse } from '../types/tarea';

export function useTareas() {
  const [tareas, setTareas] = useState<TareaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTareas()
      .then((data) => {
        if (!cancelled) setTareas(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar tareas');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { tareas, loading, error, refetch };
}
