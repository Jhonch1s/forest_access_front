import { useState, useEffect } from 'react';
import type { AsignacionTratamientoResponse } from '../types/asignacion-tratamiento';
import { getAsignaciones, getAsignacionesByParcela, getAsignacionesByRodal } from '../services/asignacionTratamientoService';

export function useAsignaciones() {
  const [asignaciones, setAsignaciones] = useState<AsignacionTratamientoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAsignaciones()
      .then((data) => {
        if (!cancelled) setAsignaciones(data);
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

  return { asignaciones, loading, error, refetch };
}

export function useAsignacionesByParcela(idParcela: number | null) {
  const [asignaciones, setAsignaciones] = useState<AsignacionTratamientoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (idParcela === null) {
      setAsignaciones([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getAsignacionesByParcela(idParcela)
      .then((data) => {
        if (!cancelled) setAsignaciones(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error desconocido');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [idParcela]);

  return { asignaciones, loading, error };
}

export function useAsignacionesByRodal(idRodal: number | null) {
  const [asignaciones, setAsignaciones] = useState<AsignacionTratamientoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (idRodal === null) {
      setAsignaciones([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getAsignacionesByRodal(idRodal)
      .then((data) => {
        if (!cancelled) setAsignaciones(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error desconocido');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [idRodal]);

  return { asignaciones, loading, error };
}
