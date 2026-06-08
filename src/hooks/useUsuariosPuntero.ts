import { useState, useEffect, useCallback } from 'react';
import { getPunteroUsuarios } from '../services/usuarioService';
import { getEmpleadosCuadrillas } from '../services/empleadoCuadrillaService';
import type { PunteroUsuarioResponse } from '../types/auth';
import type { EmpleadoCuadrillaResponse } from '../types/empleado-cuadrilla';

export interface PunteroDisponible {
  idEmpleado: number;
  nombreEmpleado: string;
}

export function useUsuariosPuntero() {
  const [usuariosPuntero, setUsuariosPuntero] = useState<PunteroUsuarioResponse[]>([]);
  const [punterosDisponibles, setPunterosDisponibles] = useState<PunteroDisponible[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usuarios, relaciones] = await Promise.allSettled([
        getPunteroUsuarios(),
        getEmpleadosCuadrillas(),
      ]);

      let usuariosData: PunteroUsuarioResponse[] = [];
      let relacionesData: EmpleadoCuadrillaResponse[] = [];

      if (usuarios.status === 'fulfilled') {
        usuariosData = usuarios.value;
      } else {
        console.error('[useUsuariosPuntero] Error fetching puntero usuarios:', usuarios.reason);
      }

      if (relaciones.status === 'fulfilled') {
        relacionesData = relaciones.value;
      } else {
        console.error('[useUsuariosPuntero] Error fetching empleados-cuadrillas:', relaciones.reason);
      }

      const punteroRelations = relacionesData.filter(
        (r) => r.rol?.toLowerCase().trim() === 'puntero' && r.esActivo
      );

      const punterosMap = new Map<number, string>();
      for (const r of punteroRelations) {
        if (!punterosMap.has(r.idEmpleado)) {
          punterosMap.set(r.idEmpleado, r.nombreEmpleado);
        }
      }

      const enriched = usuariosData.map((u) => ({
        ...u,
        nombreEmpleado: punterosMap.get(u.idEmpleado) ?? '—',
      }));

      const punterosConUsuario = new Set(usuariosData.map((u) => u.idEmpleado));

      const disponibles: PunteroDisponible[] = [];
      for (const [idEmpleado, nombreEmpleado] of punterosMap) {
        if (!punterosConUsuario.has(idEmpleado)) {
          disponibles.push({ idEmpleado, nombreEmpleado });
        }
      }

      setUsuariosPuntero(enriched);
      setPunterosDisponibles(disponibles);
    } catch (err) {
      console.error('[useUsuariosPuntero] Unexpected error:', err);
      setUsuariosPuntero([]);
      setPunterosDisponibles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { usuariosPuntero, punterosDisponibles, loading, refetch: fetchData };
}
