import { useState, useEffect, useCallback } from 'react';
import type { ProductoDTO } from '../types/tarea';
import { getProductos } from '../services/productoService';

export function useProductos() {
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = useCallback(() => {
    setLoading(true);
    setError(null);
    getProductos()
      .then(setProductos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return { productos, loading, error, refetch: fetchProductos };
}
