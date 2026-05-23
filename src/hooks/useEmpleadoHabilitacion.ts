import { useState, useEffect, useCallback } from 'react';
import { getEmpleadoHabilitaciones } from '../services/empleadoHabilitacionService';
import type { EmpleadoHabilitacionResponse } from '../types/empleado-habilitacion';

export function useEmpleadoHabilitaciones(){
    const [empleadoHabilitaciones, setEmpleadoHabilitaciones] = useState<EmpleadoHabilitacionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmpleadoHabilitaciones = useCallback( () =>{
        setLoading(true);
            setError(null);
            getEmpleadoHabilitaciones()
              .then(setEmpleadoHabilitaciones)
              .catch((err) => setError(err.message))
              .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
    fetchEmpleadoHabilitaciones();
  }, [fetchEmpleadoHabilitaciones]);

  return { empleadoHabilitaciones, loading, error, refetch: fetchEmpleadoHabilitaciones };
}