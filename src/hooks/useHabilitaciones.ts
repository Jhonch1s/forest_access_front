import { useState, useEffect, useCallback } from 'react';
import type { HabilitacionDTO, } from '../types/habilitacion';
import { getHabilitaciones } from '../services/habilitacionService';

export function useHabilitaciones() {
  const [habilitaciones, setHabilitaciones] = useState<HabilitacionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabilitaciones = useCallback(() => {
    setLoading(true);
    setError(null);
    getHabilitaciones()
        .then(setHabilitaciones)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));

  }, []);

  useEffect(() => {
    fetchHabilitaciones();
  }, [fetchHabilitaciones]); 


  return { habilitaciones, loading, error, refetch:fetchHabilitaciones };
}