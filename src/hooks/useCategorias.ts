import { useState, useEffect } from 'react';
import type { CategoriaEmpleado } from '../types/categoria';
import { getCategorias } from '../services/categoriaService';

export function useCategorias() {
  const [categorias, setCategorias] = useState<CategoriaEmpleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategorias()
      .then(setCategorias)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categorias, loading, error };
}
