import type { EmpleadoDTO, EmpleadoResponse } from '../types/empleado';
import type { EmpleadoHabilitacionDTO } from '../types/empleado-habilitacion';
import EmpleadoCard from './EmpleadoCard';
import './EmpleadoList.css';

interface EmpleadoListProps {
  empleados: EmpleadoResponse[];
  onEdit: (empleado: EmpleadoDTO) => void;
  onDelete: (empleado: EmpleadoDTO) => void;
  onEditHab: (habilitacion: EmpleadoHabilitacionDTO) => void;
  onDeleteHab: (habilitacion: EmpleadoHabilitacionDTO) => void;
  onCreateHab: (idEmpleado: number) => void;
}

function EmpleadoList({ empleados, onEdit, onDelete, onEditHab, onDeleteHab, onCreateHab }: EmpleadoListProps) {
  if (empleados.length === 0) {
    return (
      <div className="empleado-list-empty">
        <p>No hay empleados registrados.</p>
      </div>
    );
  }

  return (
    <div className="empleado-list">
      {empleados.map((emp) => (
        <EmpleadoCard
          key={emp.idEmpleado}
          empleado={emp}
          onEdit={onEdit}
          onDelete={onDelete}
          onEditHab={onEditHab}
          onDeleteHab={onDeleteHab}
          onCreateHab={onCreateHab}
        />
      ))}
    </div>
  );
}

export default EmpleadoList;
