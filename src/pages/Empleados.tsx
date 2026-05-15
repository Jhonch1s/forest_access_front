import { useState, useEffect, useCallback, useMemo } from 'react';
import EmpleadoList from "../components/EmpleadoList";
import { useCategorias } from "../hooks/useCategorias";
import { useEmpleados } from '../hooks/useEmpleados';
import { createEmpleado, updateEmpleado, deleteEmpleado } from "../services/empleadoService";
import {  type EmpleadoDTO } from "../types";
import FormModalComplete from '../components/FormModalComplete';
import type { FieldConfigComplete } from '../components/FormModalComplete';
import Button from "../components/Button";
function Empleados() {

  const { categorias } = useCategorias();
  const { empleados, loading, error, refetch } = useEmpleados();

  const categoriaOptions = useMemo(() =>
    categorias.map(cat => ({
      value: cat.idCategoria,
      label: cat.nombre
    })),
    [categorias]
  );

  const empleadoFields: FieldConfigComplete[] = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'cedula', label: 'Cedula', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'text', required: true },
    { name: 'fechaIngreso', label: 'Fecha de ingreso', type: 'date' },
    { name: 'activo', label: 'Activo', type: 'checkbox' },
    {
      name: 'idCategoria',
      label: 'Categoría',
      type: 'select',
      options: categoriaOptions,
      required: true
    }
  ];


  const [modal, setModal] = useState<{ type: 'crear' } | { type: 'editar'; empleado: EmpleadoDTO } | null>(null);


  const getInitialValues = (empleado?: EmpleadoDTO) => {
    if (!empleado) return undefined;
    return {
      nombre: empleado.nombre,
      cedula: empleado.cedula,
      telefono: empleado.telefono,
      email: empleado.email,
      fechaIngreso: empleado.fechaIngreso || '',
      activo: empleado.activo,
      idCategoria: empleado.idCategoria,
    };
  };


  const handleCrearEmpleado = async (values: Record<string, any>) => {
    await createEmpleado({
      idEmpleado: 0,
      nombre: values.nombre as string,
      cedula: values.cedula as string,
      telefono: values.telefono as string,
      email: values.email as string,
      fechaIngreso: values.fechaIngreso as string,
      activo: values.activo as boolean,
      idCategoria: Number(values.idCategoria),
    });
    await refetch();
    setModal(null);
  }

   const handleEditar = async (values: Record<string, string | number>) => {
    if (!modal || modal.type !== 'editar') return;
    const { empleado } = modal;
    await updateEmpleado(empleado.idEmpleado, {
      idEmpleado: empleado.idEmpleado,
      nombre: values.nombre as string,
      cedula: values.cedula as string,
      telefono: values.telefono as string,
      email: values.email as string,
      fechaIngreso: values.fechaIngreso as string,
      activo: values.activo === 'true',
      idCategoria: Number(values.categoria),
    });
    await refetch();
    setModal(null);
  };

  const handleEliminar = async (empleado: EmpleadoDTO) => {
    if (!confirm(`¿Eliminar al empleado "${empleado.nombre}"?`)) return;
    await deleteEmpleado(empleado.idEmpleado);
    await refetch();
  };



  return (
    <div>
      <Button variant="primary" onClick={() => setModal({ type: 'crear' })}>
        + Registrar Empleado
      </Button>
      <div className="page-header">
        <h2>Empleados</h2>
      </div>
      <p>Gestión de empleados.</p>
      <EmpleadoList
      onEdit={(emp) => {
         setModal({ type: 'editar', empleado: emp })
          console.log(emp);
        }
        
      }
       
      onDelete={handleEliminar}
       />

      {modal?.type === 'crear' && (
        <FormModalComplete
          title="Nuevo Empleado"
          fields={empleadoFields}
          onSubmit={handleCrearEmpleado}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === 'editar' && (
        <FormModalComplete
          title="Editar Empleado"
          fields={empleadoFields}
          initialValues={getInitialValues(modal.empleado)}
          onSubmit={handleEditar}
          onClose={() => setModal(null)}
        />
      )}
    </div>


  );
}

export default Empleados;
