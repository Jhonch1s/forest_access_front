import { useState, useEffect, useCallback } from 'react';
import type { CategoriaEmpleado } from '../types/categoria';
import { getCategorias } from '../services/categoriaService';

export function useCategorias() {
  const [categorias, setCategorias] = useState<CategoriaEmpleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(() => {
    setLoading(true);
    setError(null);
    getCategorias()
      .then(setCategorias)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return { categorias, loading, error, refetch: fetchCategorias };
}
