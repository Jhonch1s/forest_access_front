import type { AsignacionTratamientoResponse } from "../types"
import './AsignacionList.css';

interface AsignacionesListProps {
    asignaciones: AsignacionTratamientoResponse[];
}

function AsignacionList({ asignaciones }: AsignacionesListProps) {

    const asignacionesPlanificadas = asignaciones.filter(asig => asig.estado === 'PLANIFICADO');
    const asignacionesEnProgreso = asignaciones.filter(asig => asig.estado === 'EN_EJECUCION');
    const asignacionesFinalizadas = asignaciones.filter(asig => asig.estado === 'COMPLETADO');

    return (
        <>
            <div className="container">
                <div>
                    <h2>Asignaciones Planificadas</h2>
                    {asignacionesPlanificadas.map((asigP) => (
                        <div className="asignacion-cards">
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
                                    <span className="asignacion-card-value">{asigP.observaciones}</span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
                <div>
                    <h2>Asignaciones En progreso</h2>
                    {asignacionesEnProgreso.map((asigEP) => (
                        <div className="asignacion-cards">
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
                                    <span className="asignacion-card-value">{asigEP.observaciones}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <h2>Asignaciones Finalizadas</h2>
                    {asignacionesFinalizadas.map((asigF) => (

                        <div className="asignacion-cards">
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
                                    <span className="asignacion-card-value">{asigF.observaciones}</span>
                                </div>
                            </div>
                        </div>
                        
                    ))}
                </div>
            </div>
        </>
    )


}

export default AsignacionList;