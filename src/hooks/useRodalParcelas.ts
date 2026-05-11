import { useState, useEffect, useMemo } from 'react';
import type { Rodal, Parcela } from '../types/predio';
import { getRodales } from '../services/rodalService';
import { getParcelas } from '../services/parcelaService';

export function useRodalParcelas(idCampo: number | null) {
  const [rodalesRaw, setRodalesRaw] = useState<Rodal[]>([]);
  const [parcelasPorRodalRaw, setParcelasPorRodalRaw] = useState<Map<number, Parcela[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (idCampo === null) return;

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [allRodales, allParcelas] = await Promise.all([getRodales(), getParcelas()]);
        if (cancelled) return;

        const filteredRodales = allRodales.filter(
          (r) => r.campo?.idCampo === idCampo || (r as unknown as Record<string, number>)['campo'] === idCampo,
        );
        setRodalesRaw(filteredRodales);

        const map = new Map<number, Parcela[]>();
        for (const rodal of filteredRodales) {
          const parcelasDelRodal = allParcelas.filter(
            (p) => p.rodal?.idRodal === rodal.idRodal || (p as unknown as Record<string, number>)['rodal'] === rodal.idRodal,
          );
          map.set(rodal.idRodal, parcelasDelRodal);
        }
        setParcelasPorRodalRaw(map);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [idCampo, refreshKey]);

  const refetch = () => setRefreshKey((k) => k + 1);

  const rodales = idCampo === null ? [] : rodalesRaw;
  const parcelasPorRodal = useMemo(
    () => (idCampo === null ? new Map<number, Parcela[]>() : parcelasPorRodalRaw),
    [idCampo, parcelasPorRodalRaw],
  );

  return { rodales, parcelasPorRodal, loading, error, refetch };
}
