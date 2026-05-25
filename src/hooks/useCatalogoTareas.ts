import { useState, useEffect } from 'react';
import { getCatalogoTareas } from '../services/catalogoTareaService';
import type { CatalogoTareaResponse } from '../types/tarea';

export function useCatalogoTareas() {
  const [catalogos, setCatalogos] = useState<CatalogoTareaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCatalogoTareas()
      .then((data) => {
        if (!cancelled) setCatalogos(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar catálogo');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { catalogos, loading, error };
}
