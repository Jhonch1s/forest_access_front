import { useState, useEffect, useRef, useCallback } from 'react';
import type { AsignacionTratamientoResponse } from '../types/asignacion-tratamiento';
import { getAsignaciones, 
  getAsignacionesByParcela,
  getAsignacionesByParcelaPaginado, 
  getAsignacionesByRodal } from '../services/asignacionTratamientoService';

export function useAsignaciones() {
  const [asignaciones, setAsignaciones] = useState<AsignacionTratamientoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const pendingRef = useRef<{
    resolve: (data: AsignacionTratamientoResponse[]) => void;
    reject: (error: string) => void;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAsignaciones()
      .then((data) => {
        if (!cancelled) {
          setAsignaciones(data);
          setError(null);
          pendingRef.current?.resolve(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Error desconocido';
          setError(msg);
          pendingRef.current?.reject(msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
        pendingRef.current = null;
      });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const refetch = useCallback(() => {
    return new Promise<AsignacionTratamientoResponse[]>((resolve, reject) => {
      pendingRef.current = { resolve, reject };
      setRefreshKey((k) => k + 1);
    });
  }, []);

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

export function useAsignacionesByParcelaPaginado(idParcela:number | null = 10,pageSize:number = 5){

  const [asignacionesPaginadas, setAsignaciones] = useState<AsignacionTratamientoResponse[]>([]);
  const [loadingAsignaciones, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [, setTotalItems] = useState(0);

  const fetchAsignaciones = useCallback(async (page:number) => {
      setLoading(true);
      try {

        if (idParcela === null) {
      setAsignaciones([]);
      return;
    }
        const offset = (page - 1 ) * pageSize;
        const data = await getAsignacionesByParcelaPaginado(idParcela,offset,pageSize);
        setAsignaciones(data.asignaciones);
        setTotalItems(data.total);
        setTotalPages(Math.ceil(data.total / pageSize));
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    },[pageSize,idParcela]);
  
    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        fetchAsignaciones(page);
      }
    };
  
  
    const refetch = () => fetchAsignaciones(currentPage);
  
    useEffect(() => {
      fetchAsignaciones(1);
    }, [fetchAsignaciones]); 

    return { asignacionesPaginadas, loadingAsignaciones, error, goToPage,refetch,currentPage,totalPages };

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
