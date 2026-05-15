import { useEmpleados } from "../hooks/useEmpleados";
import { useState } from 'react';
import type { EmpleadoDTO } from "../types/empleado";
import Button from "./Button";
import './CategoriaList.css';

interface EmpleadoListProps {
  onEdit: (empleado: EmpleadoDTO) => void;
  onDelete: (empleado: EmpleadoDTO) => void;
}

function EmpleadoList({ onEdit, onDelete }: EmpleadoListProps){
    const { empleados, loading, error} = useEmpleados();

    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 5; 

    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const empleadosPagina = empleados.slice(indicePrimerItem, indiceUltimoItem);
    
    const totalPaginas = Math.ceil(empleados.length / itemsPorPagina);

    const paginaAnterior = () =>{
        if(paginaActual > 1){
            setPaginaActual(paginaActual - 1);
        }
    }

    const paginaSiguiente = () =>{
        if(paginaActual < totalPaginas){
            setPaginaActual(paginaActual + 1);
        }
    }


    if (loading) {
    return (
      <div className="categoria-status">
        <div className="categoria-spinner" />
        <p>Cargando empleados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categoria-status categoria-error">
        <p>Error al cargar empleados: {error}</p>
      </div>
    );
  }

  if (empleados.length === 0) {
    return (
      <div className="categoria-status">
        <p>No hay empleados registradas.</p>
      </div>
    );
  }
  return (
    <>
      {/* Desktop: tabla */}
      <div className="categoria-table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cedula</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Fecha de ingreso</th>
              <th>Activo ?</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleadosPagina.map((emp) => (
              <tr key={emp.idEmpleado}>
                <td>{emp.idEmpleado}</td>
                <td>{emp.cedula}</td>
                <td>{emp.nombre}</td>
                <td>{emp.email}</td>
                <td>{emp.telefono}</td>
                <td>{emp.fechaIngreso}</td>
                {emp.activo == true ? (
                    <td>Si</td>
                ) : (
                    <td>No</td>
                ) } 
                <td className="categoria-actions">
                  <Button variant="secondary" size="small"  onClick={() => onEdit(emp)}>Editar</Button>
                  <Button variant="danger" size="small"  onClick={() => onDelete(emp)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
            <button
            onClick={paginaAnterior}
            disabled={paginaActual === 1}
            >
                 Anterior
            </button>
            <button
            onClick={paginaSiguiente}
            disabled={paginaActual == totalPaginas}
            >
                Siguiente
            </button>
        </div>

      </div>

      {/* Mobile: cards */}
      <div className="categoria-cards">
        {empleadosPagina.map((cat) => (
          <div key={cat.idEmpleado} className="categoria-card">
            <div className="categoria-card-header">
              <h3 className="categoria-card-title">{cat.nombre}</h3>
              <span className="categoria-card-id">#{cat.idEmpleado}</span>
            </div>
            <div className="categoria-card-body">
              <div className="categoria-card-field">
                <span className="categoria-card-label">Email</span>
                <span className="categoria-card-value">${cat.email}</span>
              </div>
              <div className="categoria-card-field">
                <span className="categoria-card-label">Activo ?</span>
                <span className="categoria-card-value">{cat.activo}</span>
              </div>
            </div>
            <div className="categoria-card-actions">
              <Button variant="secondary" size="small">Editar</Button>
              <Button variant="danger" size="small" >Eliminar</Button>
            </div>
          </div>
        ))}
        <div>
            <button
            onClick={paginaAnterior}
            disabled={paginaActual === 1}
            >
                 Anterior
            </button>
            <button
            onClick={paginaSiguiente}
            disabled={paginaActual == totalPaginas}
            >
                Siguiente
            </button>
        </div>
      </div>
    </>
  );
}

export default EmpleadoList;