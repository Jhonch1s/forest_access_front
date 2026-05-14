import { useState, useEffect } from 'react';
import type { Campo } from '../types/predio';
import { getCampos } from '../services/campoService';

export function useCampos() {
  const [campos, setCampos] = useState<Campo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getCampos()
      .then((data) => {
        if (!cancelled) setCampos(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const refetch = () => setRefreshKey((k) => k + 1);

  return { campos, loading, error, refetch };
}
