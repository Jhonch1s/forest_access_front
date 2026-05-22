import { useState } from 'react';
import type { EmpleadoDTO,EmpleadoResponse } from "../types/empleado";
import Button from "./Button";
import './CategoriaList.css';

interface EmpleadoListProps {
  empleados: EmpleadoResponse[];
  onEdit: (empleado: EmpleadoDTO) => void;
  onDelete: (empleado: EmpleadoDTO) => void;
}

function EmpleadoList({ empleados,onEdit, onDelete }: EmpleadoListProps){
    

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
            {empleadosPagina.map((emp) => (
              <tr key={emp.idEmpleado}>
                <td>{emp.cedula}</td>
                <td>{emp.nombre}</td>
                <td>{emp.email}</td>
                <td>{emp.telefono}</td>
                <td>{emp.nombreCategoria}</td>
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
            <Button
            onClick={paginaAnterior}
            disabled={paginaActual === 1}
            variant="primary"
            size="medium"
            >
                 Anterior
            </Button>
            <Button
            onClick={paginaSiguiente}
            disabled={paginaActual == totalPaginas}
            variant="primary"
            size="medium"
            >
                Siguiente
            </Button>
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
        <div className='botones'>
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