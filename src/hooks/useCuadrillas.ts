import { useState, useEffect } from 'react';
import { getCuadrillasActivas, getHistorialCuadrillas } from '../services/cuadrillaService';
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
  miembros: MiembroUI[]; 
}

export function useCuadrillas(mostrarHistorial: boolean = false) {
  const [cuadrillas, setCuadrillas] = useState<CuadrillaUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [cuadrillasData, empleadosData] = await Promise.all([
          mostrarHistorial ? getHistorialCuadrillas() : getCuadrillasActivas(),
          getEmpleadosCuadrillas()
        ]);

        const cuadrillasProcesadas = cuadrillasData.map((cuadrilla) => {
          // Si el backend no manda 'esActivo' bien, usamos 'fechaFin' nula como alternativa para saber si está activo
                    const miembros = empleadosData.filter((emp) => {
            // Si no es de esta cuadrilla, lo ignoramos
            if (emp.idCuadrilla !== cuadrilla.idCuadrilla) return false;
            
            // Si estamos viendo el historial, queremos ver a TODOS los que pasaron por ahí
            if (mostrarHistorial) return true;
            
            //Si es una cuadrilla activa, solo mostramos a los activos actualmente
            return emp.esActivo === true || !emp.fechaFin;
          });

          
          // El backend mandó 'rol: null'. Le ponemos validación segura
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
            miembros: miembrosCompletos 
          };
        });

        setCuadrillas(cuadrillasProcesadas);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al cargar cuadrillas');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    }, [refreshKey, mostrarHistorial]);


  const refetch = () => setRefreshKey(k => k + 1);

  return { cuadrillas, loading, error, refetch };
}