
import { useEffect } from "react";
import type { TareaResponse } from "../types";
import './AsignacionList.css';
import { useTareasByAsignacion } from "../hooks/useTareas";

function TareasAsignacion({ 
  idAsignacion, 
  onSeleccionarGrupo,
  tareaSeleccionada,
  grupoSeleccionado
}: { 
  idAsignacion: number,
  onSeleccionarGrupo: (tareas: TareaResponse[], nombre: string) => void,
  tareaSeleccionada: string | null,
  grupoSeleccionado: TareaResponse[] | null
}) {
  const { tareas, loading, error, fetchTareas } = useTareasByAsignacion(idAsignacion);

  // Disparar la carga al montar el componente
  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!tareas.length) return <p>No hay tareas para esta asignación.</p>;

  // Agrupar por nombreCatalogo
  const grupos = new Map<string, TareaResponse[]>();
  tareas.forEach(tar => {
    const key = tar.nombreTareaCatalogo;
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key)!.push(tar);
  });

  return (
    <>
    {loading && (
        <div className="categoria-status">
          <div className="categoria-spinner" />
          <p>Cargando asignaciones...</p>
        </div>
      )}

      {Array.from(grupos.entries()).map(([nombreCatalogo, tareasGrupo]) => (
        <div
          key={nombreCatalogo}
          className={`grupo-tareas ${tareaSeleccionada === nombreCatalogo ? 'selected' : ''}`}
        >
          <div
            className="grupo-tareas-header"
            onClick={() => onSeleccionarGrupo(tareasGrupo, nombreCatalogo)}
          >
            <div className="grupo-tareas-info">
              <span className="grupo-tareas-nombre">{nombreCatalogo}</span>
              <span className="grupo-tareas-badge">{tareasGrupo.length}</span>
            </div>
            <span className="grupo-tareas-arrow">›</span>
          </div>
        </div>
      ))}
    </>
  );
  
}

export default TareasAsignacion;
