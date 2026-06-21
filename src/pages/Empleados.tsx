import { useState, useMemo } from 'react';
import EmpleadoList from "../components/EmpleadoList";
import { useCategorias } from "../hooks/useCategorias";
import { useHabilitaciones } from '../hooks/useHabilitaciones';
import { useEmpleados } from '../hooks/useEmpleados';
import {
  createEmpleado,
  updateEmpleado,
  deleteEmpleado
} from "../services/empleadoService";
import type { EmpleadoHabilitacionDTO } from '../types/empleado-habilitacion';
import { type EmpleadoDTO } from "../types";
import FormModalComplete from '../components/FormModalComplete';
import type { FieldConfigComplete } from '../components/FormModalComplete';
import Button from "../components/Button";
import { createEmpleadoHabilitacion, updateEmpleadoHabilitacion, deleteEmpleadoHabilitacion } from '../services/empleadoHabilitacionService';
function Empleados() {

  const { categorias } = useCategorias();
  const { habilitaciones } = useHabilitaciones();
  const { empleados, loading, error, currentPage, totalPages, goToPage, filtrar, refetch } = useEmpleados();

  const categoriaOptions = useMemo(() =>
    categorias.map(cat => ({
      value: cat.idCategoria,
      label: cat.nombre
    })),
    [categorias]
  );

  const habilitacionesOptions = useMemo(() =>
    habilitaciones.map(hab => ({
      value: hab.idHabilitacion,
      label: hab.nombre
    })),
    [habilitaciones]
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

  const HabilitacionesFields: FieldConfigComplete[] = [
    { name: 'idHabilitacion', label: 'Habilitacion', type: 'select', options: habilitacionesOptions, required: true },
    { name: 'fechaEmision', label: 'Fecha De Emisión', type: 'date', required: true },
    { name: 'fechaVencimiento', label: 'Fecha De Vencimiento', type: 'date', required: true }
  ]


  const [modal, setModal] = useState<{ type: 'crear' } | { type: 'editar'; empleado: EmpleadoDTO } | null>(null);
  const [habModal, setHabModal] = useState<{ type: 'crear'; idEmpleado: number } | { type: 'editar'; habilitacion: EmpleadoHabilitacionDTO } | null>(null);


  const getInitialValues = (empleado?: EmpleadoDTO) => {
    if (!empleado) return undefined;
    return {
      nombre: empleado.nombre,
      cedula: empleado.cedula,
      telefono: empleado.telefono,
      email: empleado.email,
      fechaIngreso: empleado.fechaIngreso || '',
      activo: empleado.activo,
      idCategoria: String(empleado.idCategoria),
    };
  };

  const getInitialValuesHab = (habilitacion?: EmpleadoHabilitacionDTO) => {
    if (!habilitacion) return undefined;
    return {
      idHabilitacion: habilitacion.idHabilitacion,
      fechaEmision: habilitacion.fechaEmision,
      fechaVencimiento: habilitacion.fechaVencimiento
    };
  };




  const handleCrearEmpleado = async (values: Record<string, string | number>) => {
    await createEmpleado({
      idEmpleado: 0,
      nombre: values.nombre as string,
      cedula: values.cedula as string,
      telefono: values.telefono as string,
      email: values.email as string,
      fechaIngreso: values.fechaIngreso as string,
      activo: values.activo === 'true',
      idCategoria: Number(values.idCategoria),
    });
    await refetch();
    setModal(null);
  }

  const handleCrearHabilitacion = async (values: Record<string, string | number>) => {
    if (!habModal || habModal.type !== 'crear') return;
    const { idEmpleado } = habModal;

    await createEmpleadoHabilitacion({
      idEmpleado: idEmpleado as number,
      idHabilitacion: values.idHabilitacion as number,
      fechaEmision: values.fechaEmision as string,
      fechaVencimiento: values.fechaVencimiento as string
    });
    await refetch();
    setHabModal(null);
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
      idCategoria: Number(values.idCategoria),

    });


    await refetch();
    setModal(null);
  };

  const handleEditarHabilitacion = async (values: Record<string, string | number>) => {
    if (!habModal || habModal.type !== 'editar') return;
    const { habilitacion } = habModal;
    await updateEmpleadoHabilitacion(habilitacion.idEmpleado, habilitacion.idHabilitacion, {
      idEmpleado: habilitacion.idEmpleado,
      idHabilitacion: habilitacion.idHabilitacion,
      fechaEmision: values.fechaEmision as string,
      fechaVencimiento: values.fechaVencimiento as string
    });
    await refetch();
    setHabModal(null);
  }

  const handleEliminar = async (empleado: EmpleadoDTO) => {
    if (!confirm(`¿Eliminar al empleado "${empleado.nombre}"?`)) return;
    await deleteEmpleado(empleado.idEmpleado);
    await refetch();
  };

  const handleEliminarHabilitacion = async (habilitacion: EmpleadoHabilitacionDTO) => {
    if (!confirm(`¿Eliminar Habilitacion de empleado?`)) return;
    await deleteEmpleadoHabilitacion(habilitacion.idEmpleado, habilitacion.idHabilitacion);
    await refetch();
  }



  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className='empleado-title'  >
          <h2>Empleados</h2>
          <p>Gestión de empleados.</p>
        </div>
        <div>
          <Button variant="primary" 
          onClick={filtrar} >
            Filtrar por habilitaciones
          </Button>
        </div>
        <div>
          <Button variant="primary" onClick={() => setModal({ type: 'crear' })}>
            + Registrar Empleado
          </Button>
        </div>

      </div>

      {loading && (
        <div className="categoria-status">
          <div className="categoria-spinner" />
          <p>Cargando empleados...</p>
        </div>
      )}

      {error && !loading && (
        <div className="categoria-status">
          <p className="categoria-error">{error}</p>
          <Button variant="secondary" onClick={() => refetch()}>Reintentar</Button>
        </div>
      )}

      {!loading && !error && (
        <EmpleadoList

          empleados={empleados}
          onEdit={(emp) => {
            setModal({ type: 'editar', empleado: emp })
          }

          }
          onEditHab={(hab) => {
            setHabModal({ type: 'editar', habilitacion: hab })
          }}
          onCreateHab={(idEmpleado) => setHabModal({ type: 'crear', idEmpleado })}
          onDelete={handleEliminar}
          onDeleteHab={handleEliminarHabilitacion}

        />


      )}
      
      <div style={{display: 'flex', justifyContent: 'space-between',marginTop: 10}}>
        <Button variant='primary'
          onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </Button>
        <Button variant='primary'
          onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Siguiente
        </Button>
      </div>

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

      {habModal?.type === 'crear' && (
        <FormModalComplete
          title="Nueva Habilitación de empleado"
          fields={HabilitacionesFields}
          onSubmit={handleCrearHabilitacion}
          onClose={() => setHabModal(null)}
        />
      )}

      {habModal?.type == 'editar' && (
        <FormModalComplete
          title="Editar Habilitacion de Empleado"
          fields={HabilitacionesFields}
          initialValues={getInitialValuesHab(habModal.habilitacion)}
          onSubmit={handleEditarHabilitacion}
          onClose={() => setHabModal(null)}
        />
      )}
    </div>






  );
}

export default Empleados;
