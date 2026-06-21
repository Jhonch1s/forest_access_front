import type { AsignacionTratamientoResponse } from "../types"
import { useState } from "react";
import Button from "./Button";
import type { TareaResponse } from "../types";
import './AsignacionList.css';
import { getTareasByAsignacion } from "../services/tareaService";

interface AsignacionesListProps {
    asignaciones: AsignacionTratamientoResponse[];
}

function AsignacionList({ asignaciones }: AsignacionesListProps) {

    const asignacionesPlanificadas = asignaciones.filter(asig => asig.estado === 'PLANIFICADO');
    const asignacionesEnProgreso = asignaciones.filter(asig => asig.estado === 'EN_EJECUCION');
    const asignacionesFinalizadas = asignaciones.filter(asig => asig.estado === 'COMPLETADO');

    const [tareasPorTratamiento, setTareasPorTratamiento] = useState<Map<number, TareaResponse[]>>(new Map());

    const [expandidos, setExpandidos] = useState(new Set());

    const [grupoSeleccionado, setGrupoSeleccionado] = useState<TareaResponse[] | null>(null);

    const [tareaSeleccionada, setTareaSeleccionada] = useState<string | null>(null);


    const seleccionarGrupo = (tareas: TareaResponse[],nombreCatalogo:string) => {
        setGrupoSeleccionado(tareas);
        setTareaSeleccionada(nombreCatalogo);
        const planificadas = document.getElementById("planificadas");
        const finalizadas = document.getElementById("finalizadas");
        const contenedor = document.getElementById("contenedor-tareas");
        if (planificadas) planificadas.style.display = "none";
        if (finalizadas) finalizadas.style.display = "none";
        if (contenedor) contenedor.style.display = "block";
    };

    const seleccionarGrupo2 =  (tareas: TareaResponse[],nombreCatalogo:string) => {
        setGrupoSeleccionado(tareas);
        setTareaSeleccionada(nombreCatalogo);
        const planificadas = document.getElementById("planificadas");
        const finalizadas = document.getElementById("progreso");
        const contenedor = document.getElementById("contenedor-tareas");
        if (planificadas) planificadas.style.display = "none";
        if (finalizadas) finalizadas.style.display = "none";
        if (contenedor) contenedor.style.display = "block";
    }




    const volverALista = () => {
        setGrupoSeleccionado(null);
        setTareaSeleccionada(null);
        const planificadas = document.getElementById("planificadas");
        const finalizadas = document.getElementById("finalizadas");
        const progreso = document.getElementById("progreso");
        const contenedor = document.getElementById("contenedor-tareas");
        if (planificadas && planificadas.style.display === "none") planificadas.style.display = "block";
        if (finalizadas && finalizadas.style.display === "none") finalizadas.style.display = "block";
        if (progreso && progreso.style.display === "none") progreso.style.display = "block";
        if (contenedor) contenedor.style.display = "none";
    };




    const toggleExpandir = async (idAsignacion: number) => {
        if (!expandidos.has(idAsignacion)) {
            if (!tareasPorTratamiento.has(idAsignacion)) {
                await cargarTareas(idAsignacion);
            }
        }
        setExpandidos(prev => {
            const nuevo = new Set(prev);
            if (nuevo.has(idAsignacion)) nuevo.delete(idAsignacion);
            else nuevo.add(idAsignacion);
            return nuevo;
        });
    };

    async function cargarTareas(idAsignacion: number) {
        try {
            const data = await getTareasByAsignacion(idAsignacion);
            setTareasPorTratamiento(prev => new Map(prev).set(idAsignacion, data));
        } catch (err) {
            console.error(err);
        }
    }

    const getEstadoClass = (estado?: string) => {
        if (estado === null || estado === undefined) return '';
        if (estado == 'Finalizada') return 'finalizada';
        if (estado == 'En proceso') return 'enproceso';
        return '';
    };

    return (
        <>
            <div className="container">
                <div id="planificadas">
                    <div className="asignaciones-titulo">
                        <h2>Asignaciones Planificadas</h2>
                    </div>


                    {asignacionesPlanificadas.length === 0 ? (
                        <p className="mensaje-vacio" id="">No hay asignaciones planificadas para esta parcela.</p>
                    ) : (
                        asignacionesPlanificadas.map((asigP) => (
                            <div className="asignacion-cards" >
                                <div className="asignacion-card-header">
                                    <h3 className="asignacion-card-title">{asigP.nombreTratamiento}</h3>
                                </div>
                                <div className="asignacion-card-body">
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Creacion</span>
                                        <span className="asignacion-card-value">{asigP.fechaAsignacion}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Inicio</span>
                                        <span className="asignacion-card-value">{asigP.fechaInicioEstimada}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Fin</span>
                                        <span className="asignacion-card-value">{asigP.fechaFinEstimada}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Observaciones</span>
                                    </div>
                                    <div>
                                        <span className="asignacion-card-value">{asigP.observaciones || "Sin Observaciones"}</span>
                                    </div>

                                </div>


                            </div>
                        ))
                    )}
                </div>
                <div id="progreso">
                    <div className="asignaciones-titulo">
                        <h2>Asignaciones en progreso</h2>
                    </div>

                    {asignacionesEnProgreso.length === 0 ? (
                        <p className="mensaje-vacio">No hay asignaciones en progreso para esta parcela.</p>
                    ) : (
                        asignacionesEnProgreso.map((asigEP) => (
                            <div className="asignacion-cards" >
                                <div className="asignacion-card-header">
                                    <h3 className="asignacion-card-title">{asigEP.nombreTratamiento}</h3>
                                </div>
                                <div className="asignacion-card-body">
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Creacion</span>
                                        <span className="asignacion-card-value">{asigEP.fechaAsignacion}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Inicio</span>
                                        <span className="asignacion-card-value">{asigEP.fechaInicioEstimada}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Fin</span>
                                        <span className="asignacion-card-value">{asigEP.fechaFinEstimada}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Observaciones</span>
                                    </div>
                                    <div>
                                        <span className="asignacion-card-value">{asigEP.observaciones || "Sin observaciones"}</span>
                                    </div>
                                    <div className='expandir'>
                                        <button
                                            onClick={() => toggleExpandir(asigEP.idAsignacion)}
                                        >
                                            <p>Tareas</p>
                                            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm5.247 8l-5.247 6.44-5.263-6.44-.737.678 6 7.322 6-7.335-.753-.665z" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {expandidos.has(asigEP.idAsignacion) && (
                                    <>
                                        {(() => {
                                            const tareas = tareasPorTratamiento.get(asigEP.idAsignacion);
                                            if (!tareas || tareas.length === 0) {
                                                return (
                                                    <div className="asignacion-card-body">
                                                        <div className="asignacion-card-field">
                                                            <span className='asignacion-card-value'>No hay tareas asignadas</span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            const grupos = new Map<string, TareaResponse[]>();
                                            tareas.forEach(tar => {
                                                const key = tar.nombreTareaCatalogo;
                                                if (!grupos.has(key)) {
                                                    grupos.set(key, []);
                                                }
                                                grupos.get(key)!.push(tar);
                                            });

                                            return Array.from(grupos.entries()).map(([nombreCatalogo, tareasGrupo]) => (
                                                <div key={nombreCatalogo} className={`grupo-tareas ${tareaSeleccionada === nombreCatalogo ? 'selected' : '' }`} >
                                                    <div
                                                        className="grupo-tareas-header"
                                                        onClick={() => seleccionarGrupo(tareasGrupo,nombreCatalogo)}
                                                    >
                                                        <div className="grupo-tareas-info">
                                                            <span className="grupo-tareas-nombre">{nombreCatalogo}</span>
                                                            <span className="grupo-tareas-badge">{tareasGrupo.length}</span>
                                                        </div>
                                                        <span className="grupo-tareas-arrow">›</span>
                                                    </div>
                
                                                </div>
                                            ));
                                        })()}
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <div id="finalizadas">
                    <div className="asignaciones-titulo">
                        <h2>Asignaciones Finalizadas</h2>
                    </div>
                    {asignacionesFinalizadas.length === 0 ? (
                        <p className="mensaje-vacio">No hay asignaciones finalizadas para esta parcela.</p>
                    ) : (
                        asignacionesFinalizadas.map((asigF) => (

                            <div className="asignacion-cards" >
                                <div className="asignacion-card-header">
                                    <h3 className="asignacion-card-title">{asigF.nombreTratamiento}</h3>
                                </div>
                                <div className="asignacion-card-body">
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Creacion</span>
                                        <span className="asignacion-card-value">{asigF.fechaAsignacion}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Inicio</span>
                                        <span className="asignacion-card-value">{asigF.fechaInicioEstimada}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Fin</span>
                                        <span className="asignacion-card-value">{asigF.fechaFinEstimada}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Observaciones</span>
                                    </div>
                                    <div>
                                        <span className="asignacion-card-value">{asigF.observaciones || "Sin Observaciones"}</span>
                                    </div>
                                    <div className='expandir'>
                                        <button
                                            onClick={() => toggleExpandir(asigF.idAsignacion)}
                                        >
                                            <p>Tareas</p>
                                            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm5.247 8l-5.247 6.44-5.263-6.44-.737.678 6 7.322 6-7.335-.753-.665z" /></svg>
                                        </button>
                                    </div>
                                    {expandidos.has(asigF.idAsignacion) && (
                                    <>
                                        {(() => {
                                            const tareas = tareasPorTratamiento.get(asigF.idAsignacion);
                                            if (!tareas || tareas.length === 0) {
                                                return (
                                                    <div className="asignacion-card-body">
                                                        <div className="asignacion-card-field">
                                                            <span className='asignacion-card-value'>No hay tareas asignadas</span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            const grupos = new Map<string, TareaResponse[]>();
                                            tareas.forEach(tar => {
                                                const key = tar.nombreTareaCatalogo;
                                                if (!grupos.has(key)) {
                                                    grupos.set(key, []);
                                                }
                                                grupos.get(key)!.push(tar);
                                            });

                                            return Array.from(grupos.entries()).map(([nombreCatalogo, tareasGrupo]) => (
                                                <div key={nombreCatalogo} className={`grupo-tareas ${tareaSeleccionada === nombreCatalogo ? 'selected' : '' }`} >
                                                    <div
                                                        className="grupo-tareas-header"
                                                        onClick={() => seleccionarGrupo2(tareasGrupo,nombreCatalogo)}
                                                    >
                                                        <div className="grupo-tareas-info">
                                                            <span className="grupo-tareas-nombre">{nombreCatalogo}</span>
                                                            <span className="grupo-tareas-badge">{tareasGrupo.length}</span>
                                                        </div>
                                                        <span className="grupo-tareas-arrow">›</span>
                                                    </div>
                
                                                </div>
                                            ));
                                        })()}
                                    </>
                                )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div id="contenedor-tareas" style={{ display: "none" }}>
                    <div className="titulo-tareas">
                        <h2>Tareas</h2>
                        <Button variant="primary" size="medium" onClick={volverALista}>← Volver a la lista</Button>
                    </div>
                    {grupoSeleccionado && (
                        <div className="tarea-detalle-completo">
                            {grupoSeleccionado.map(tar => (
                                <div key={tar.idTarea} className="tarea-item" style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Empleado</span>
                                        <span className="asignacion-card-value">{tar.nombreEmpleado}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Cuadrilla</span>
                                        <span className="asignacion-card-value">{tar.nombreCuadrilla}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Descripción</span>
                                        <span className="asignacion-card-value">{tar.descripcion || "Sin Descripción"}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Estado</span>
                                        <span className="asignacion-card-value">{tar.nombreEstado}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </>
    );


}

export default AsignacionList;