import { useState } from 'react';
import React from 'react';
import type { EmpleadoDTO, EmpleadoResponse } from "../types/empleado";
import Button from "./Button";
import './CategoriaList.css';
import { obtenerHabilitacionesDeEmpleado } from '../services/empleadoHabilitacionService';
import type { EmpleadoHabilitacionResponse, EmpleadoHabilitacionDTO } from '../types/empleado-habilitacion';




interface EmpleadoListProps {
  empleados: EmpleadoResponse[];
  onEdit: (empleado: EmpleadoDTO) => void;
  onDelete: (empleado: EmpleadoDTO) => void;
  onEditHab: (habilitacion: EmpleadoHabilitacionDTO) => void;
  onDeleteHab: (habilitacion: EmpleadoHabilitacionDTO) => void;
  onCreateHab: (idEmpleado: number) => void;
}

const getDiasRestantesClass = (dias?: number | null) => {
  if (dias === null || dias === undefined) return '';
  if (dias < 0) return 'vencida';
  if (dias <= 15) return 'proximo-vencer';
  return '';
};


function EmpleadoList({ empleados, onEdit, onDelete, onEditHab, onDeleteHab, onCreateHab }: EmpleadoListProps) {

  const [habilitacionesPorEmpleado, setHabilitacionesPorEmpleado] = useState<Map<number, EmpleadoHabilitacionResponse[]>>(new Map());

  const [expandidos, setExpandidos] = useState(new Set());

  const [modalHabilitacionesOpen, setModalHabilitacionesOpen] = useState(false);
  const [empleadoSeleccionado] = useState<EmpleadoResponse | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;

  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const empleadosPagina = empleados.slice(indicePrimerItem, indiceUltimoItem);

  const totalPaginas = Math.ceil(empleados.length / itemsPorPagina);

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  }

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  }



  const toggleExpandir = async (idEmpleado: number) => {
    if (!expandidos.has(idEmpleado)) {
      if (!habilitacionesPorEmpleado.has(idEmpleado)) {
        await cargarHabilitaciones(idEmpleado);
      }
    }
    setExpandidos(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(idEmpleado)) nuevo.delete(idEmpleado);
      else nuevo.add(idEmpleado);
      return nuevo;
    });
  };



  if (empleados.length === 0) {
    return (
      <div className="categoria-status">
        <p>No hay empleados registrados.</p>
      </div>
    );
  }


  async function cargarHabilitaciones(idEmpleado: number) {
    try {
      const data = await obtenerHabilitacionesDeEmpleado(idEmpleado);
      setHabilitacionesPorEmpleado(prev => new Map(prev).set(idEmpleado, data));
    } catch (err) {
      console.error(err);
    }
  }



  return (
    <>
      {/* Desktop: tabla */}
      <div className="categoria-table-container">
        <table className="table" id="tablaEmpleados">
          <thead>
            <tr>
              <th><span className='visually-hidden'> Toggle </span></th>
              <th>Cedula</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Categoria</th>
              <th>Activo ?</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <React.Fragment>


                <tr key={emp.idEmpleado} className={getDiasRestantesClass(emp.diasRestantes)} id={String(emp.idEmpleado)} >
                  <td className='td-button' id='{emp.idEmpleado}'>
                    <button className='botonHab'
                      onClick={() => toggleExpandir(emp.idEmpleado)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 12c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm-18.005-1.568l1.415-1.414 4.59 4.574 4.579-4.574 1.416 1.414-5.995 5.988-6.005-5.988z" /></svg>
                    </button>
                  </td>
                  <td>{emp.cedula}</td>
                  <td>{emp.nombre}</td>
                  <td>{emp.email}</td>
                  <td>{emp.telefono}</td>
                  <td>{emp.nombreCategoria}</td>
                  {emp.activo == true ? (
                    <td>Si</td>
                  ) : (
                    <td>No</td>
                  )}
                  <td className="categoria-actions">
                    <Button variant="secondary" size="small" onClick={() => onEdit(emp)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" /></svg>
                      Editar
                    </Button>
                    <Button variant='secondary' size='small' onClick={() => onCreateHab(emp.idEmpleado)}>
                      Asignar Habilitaciones</Button>
                    <Button variant="danger" size="small" onClick={() => onDelete(emp)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2, verticalAlign: 'middle' }}>
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Eliminar
                    </Button>
                  </td>
                </tr>
                {expandidos.has(emp.idEmpleado) && (
                  <>
                    <tr>
                      <th colSpan={8}>Habilitaciones</th>
                    </tr>
                    <tr>
                      <th colSpan={2}>Nombre</th>
                      <th colSpan={2}>Emisión</th>
                      <th colSpan={2}>Vencimiento</th>
                      <th colSpan={2}>Acciones</th>
                    </tr>
                    {(() => {
                      const habs = habilitacionesPorEmpleado.get(emp.idEmpleado);
                      if (!habs || habs.length === 0) {
                        return (
                          <tr>
                            <td colSpan={8} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                              No hay habilitaciones registradas para este empleado
                            </td>
                          </tr>
                        );
                      }
                      return habs.map((hab) => (
                        <tr key={hab.idHabilitacion}>
                          <td colSpan={2}>{hab.nombreHabilitacion}</td>
                          <td colSpan={2}>{hab.fechaEmision}</td>
                          <td colSpan={2}>{hab.fechaVencimiento}</td>
                          <td colSpan={2}>
                            <Button size="small" variant="secondary" onClick={() => onEditHab(hab)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" /></svg>
                              Editar</Button>
                            <Button size='small' variant='danger' onClick={() => onDeleteHab(hab)}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2, verticalAlign: 'middle' }}>
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </>
                )}

              </React.Fragment>
            ))}

          </tbody>
        </table>

      </div>



      {/* Mobile: cards */}
      <div className="categoria-cards">
        {empleados.map((cat) => (
          <div key={cat.idEmpleado} className="categoria-card">
            <div className="categoria-card-header">
              <h3 className="categoria-card-title">{cat.nombre}</h3>
              <span className="categoria-card-id">#{cat.idEmpleado}</span>
            </div>
            <div className="categoria-card-body">
              <div className="categoria-card-field">
                <span className="categoria-card-label">Email</span>
                <span className="categoria-card-value">{cat.email}</span>
              </div>
              <div className="categoria-card-field">
                <span className="categoria-card-label">Cedula</span>
                <span className="categoria-card-value">{cat.cedula}</span>
              </div>
              <div className="categoria-card-field">
                <span className="categoria-card-label">Telefono</span>
                <span className="categoria-card-value">{cat.telefono}</span>
              </div>
              <div className="categoria-card-field">
                <span className="categoria-card-label">Categoría</span>
                <span className="categoria-card-value">{cat.nombreCategoria}</span>
              </div>
            </div>
            <div className="categoria-card-actions">
              <Button variant="secondary" size="small" onClick={() => onEdit(cat)}>Editar</Button>
              <Button variant='secondary' size='small'>Habilitaciones</Button>
              <Button variant="danger" size="small" onClick={() => onDelete(cat)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

    </>
  );
}

export default EmpleadoList;