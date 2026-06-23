import type { AsignacionTratamientoResponse } from "../types"
import { useState } from "react";
import Button from "./Button";
import type { TareaResponse } from "../types";
import './AsignacionList.css';
import { getTareasByAsignacion } from "../services/tareaService";
import TareasAsignacion from "./TareasAsignacion";

interface AsignacionesListProps {
    asignaciones: AsignacionTratamientoResponse[];
}

function AsignacionList({ asignaciones }: AsignacionesListProps) {

    const asignacionesPlanificadas = asignaciones.filter(asig => asig.estado === 'PLANIFICADO');
    const asignacionesEnProgreso = asignaciones.filter(asig => asig.estado === 'EN_EJECUCION');
    const asignacionesFinalizadas = asignaciones.filter(asig => asig.estado === 'COMPLETADO');

    function formatearFecha(fecha: string | undefined | null): string {
        if (!fecha) return 'Sin fecha';
        const partes = fecha.split('-');
        if (partes.length !== 3) return fecha;
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    const [tareasPorTratamiento, setTareasPorTratamiento] = useState<Map<number, TareaResponse[]>>(new Map());

    const [expandidos, setExpandidos] = useState(new Set());

    const [grupoSeleccionado, setGrupoSeleccionado] = useState<TareaResponse[] | null>(null);

    const [tareaSeleccionada, setTareaSeleccionada] = useState<string | null>(null);

    const [expandedTareasId, setExpandedTareasId] = useState<number | null>(null);


    const seleccionarGrupo = (tareas: TareaResponse[], nombreCatalogo: string) => {
        setGrupoSeleccionado(tareas);
        setTareaSeleccionada(nombreCatalogo);
        const planificadas = document.getElementById("planificadas");
        const finalizadas = document.getElementById("finalizadas");
        const contenedor = document.getElementById("contenedor-tareas");
        if (planificadas) planificadas.style.display = "none";
        if (finalizadas) finalizadas.style.display = "none";
        if (contenedor) contenedor.style.display = "block";
    };

    const seleccionarGrupo2 = (tareas: TareaResponse[], nombreCatalogo: string) => {
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
        if (expandedTareasId === idAsignacion) { setExpandedTareasId(null); } else {
            setExpandedTareasId(idAsignacion);
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
                                        <span className="asignacion-card-value">{formatearFecha(asigP.fechaAsignacion)}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Inicio</span>
                                        <span className="asignacion-card-value">{formatearFecha(asigP.fechaInicioEstimada)}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Fin</span>
                                        <span className="asignacion-card-value">{formatearFecha(asigP.fechaFinEstimada)}</span>
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
                                        <span className="asignacion-card-value">{formatearFecha(asigEP.fechaAsignacion)}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Inicio</span>
                                        <span className="asignacion-card-value">{formatearFecha(asigEP.fechaInicioEstimada)}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Fin</span>
                                        <span className="asignacion-card-value">{formatearFecha(asigEP.fechaFinEstimada)}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Observaciones</span>
                                    </div>
                                    <div>
                                        <span className="asignacion-card-value">{asigEP.observaciones || "Sin observaciones"}</span>
                                    </div>
                                    <div className={`expandir ${asigEP.idAsignacion === expandedTareasId ? "true" : ''}`}>
                                        <button
                                            onClick={() => toggleExpandir(asigEP.idAsignacion)}
                                        >
                                            <p>Tareas</p>
                                            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-3 5.753l6.44 5.247-6.44 5.263.678.737 7.322-6-7.335-6-.665.753z" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {expandidos.has(asigEP.idAsignacion) && (
                                    <TareasAsignacion
                                        idAsignacion={asigEP.idAsignacion}
                                        onSeleccionarGrupo={seleccionarGrupo}
                                        tareaSeleccionada={tareaSeleccionada}
                                        grupoSeleccionado={grupoSeleccionado}
                                    />
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
                                        <span className="asignacion-card-value">{formatearFecha(asigF.fechaAsignacion)}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Inicio</span>
                                        <span className="asignacion-card-value">{formatearFecha(asigF.fechaInicioEstimada)}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Fin</span>
                                        <span className="asignacion-card-value">{formatearFecha(asigF.fechaFinEstimada)}</span>
                                    </div>
                                    <div className="asignacion-card-field">
                                        <span className="asignacion-card-label">Observaciones</span>
                                    </div>
                                    <div>
                                        <span className="asignacion-card-value">{asigF.observaciones || "Sin Observaciones"}</span>
                                    </div>
                                    <div className={`expandir ${asigF.idAsignacion === expandedTareasId ? "true" : ""}`}>
                                        <button
                                            onClick={() => toggleExpandir(asigF.idAsignacion)}
                                        >
                                            <p>Tareas</p>
                                            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-3 5.753l6.44 5.247-6.44 5.263.678.737 7.322-6-7.335-6-.665.753z" /></svg>
                                        </button>
                                    </div>
                                    {expandidos.has(asigF.idAsignacion) && (
                                        <TareasAsignacion
                                            idAsignacion={asigF.idAsignacion}
                                            onSeleccionarGrupo={seleccionarGrupo2}
                                            tareaSeleccionada={tareaSeleccionada}
                                            grupoSeleccionado={grupoSeleccionado}
                                        />
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
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Empleado</th>
                                        <th>Cuadrilla</th>
                                        <th>Descripcion</th>
                                        <th>Estado</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {grupoSeleccionado.map(tar => (
                                        <tr key={tar.idTarea}>
                                            <td>{tar.nombreEmpleado}</td>
                                            <td>{tar.nombreCuadrilla}</td>
                                            <td>{tar.descripcion || "Sin descripción"}</td>
                                            <td>{tar.nombreEstado}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </>
    );


}

export default AsignacionList;