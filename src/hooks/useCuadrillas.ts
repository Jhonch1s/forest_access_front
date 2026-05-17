import { useState, useEffect } from 'react';
import { getCuadrillas } from '../services/cuadrillaService';
import { getEmpleadosCuadrillas } from '../services/empleadoCuadrillaService';

export interface MiembroUI {
  id: number;
  nombre: string;
  iniciales: string;
  rol: string;
}

export interface CuadrillaUI {
  idCuadrilla: number;
  nombre: string;
  activa: boolean;
  puntero: string;
  miembros: MiembroUI[]; // ¡Ahora guardamos la lista completa, no solo el número!
}

export function useCuadrillas() {
  const [cuadrillas, setCuadrillas] = useState<CuadrillaUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [cuadrillasData, empleadosData] = await Promise.all([
          getCuadrillas(),
          getEmpleadosCuadrillas()
        ]);

        console.log("DATOS CRUDOS DE EMPLEADOS:", empleadosData);

        const cuadrillasProcesadas = cuadrillasData.map((cuadrilla) => {
          // Si el backend no manda 'esActivo' bien, usamos 'fechaFin' nula como alternativa para saber si está activo
          const miembros = empleadosData.filter((emp) => 
            emp.idCuadrilla === cuadrilla.idCuadrilla && 
            (emp.esActivo === true || !emp.fechaFin)
          );
          
          // El backend mandó 'rol: null'. Le ponemos validación segura (emp.rol && ...)
          const punteroObj = miembros.find((emp) => 
            emp.rol && (emp.rol.toLowerCase().includes('puntero') || emp.rol.toLowerCase().includes('capataz'))
          );
          const nombrePuntero = punteroObj ? punteroObj.nombreEmpleado : 'Sin asignar';

          // Mapeamos los miembros para sacarles las iniciales dinámicamente
          const miembrosCompletos: MiembroUI[] = miembros.map(emp => {
            const partes = emp.nombreEmpleado.split(' ');
            const iniciales = partes.length > 1 ? partes[0][0] + partes[1][0] : partes[0][0];
            return {
              id: emp.idEmpleado,
              nombre: emp.nombreEmpleado,
              iniciales: iniciales.toUpperCase(),
              rol: emp.rol || 'Sin rol' // Si viene null, mostramos esto
            };
          });

          return {
            idCuadrilla: cuadrilla.idCuadrilla,
            nombre: cuadrilla.nombre,
            activa: cuadrilla.activa,
            puntero: nombrePuntero,
            miembros: miembrosCompletos // Pasamos el array entero
          };
        });

        setCuadrillas(cuadrillasProcesadas);
      } catch (err: any) {
        setError(err.message || 'Error al cargar cuadrillas');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [refreshKey]);

  const refetch = () => setRefreshKey(k => k + 1);

  return { cuadrillas, loading, error, refetch };
}