import { useState, useEffect, useRef } from 'react';
import type { CuadrillaUI, MiembroUI } from '../hooks/useCuadrillas';
import { getEmpleados } from '../services/empleadoService';
import type { EmpleadoDTO, EmpleadoResponse } from '../types/empleado';
import { sincronizarEmpleados, getUltimosMiembros } from '../services/cuadrillaService';
import { getEmpleadosCuadrillas, obtenerEmpleadosPaginadosPorCuadrilla } from '../services/empleadoCuadrillaService';
import './CuadrillaDetails.css';
import Button from './Button';
import AsignarTareasCuadrillaModal from './AsignarTareasCuadrillaModal';

interface CuadrillaDetailsProps {
  cuadrilla: CuadrillaUI | null;
  onRefetch: () => void;
  onClose: () => void;
}

export default function CuadrillaDetails({ cuadrilla, onRefetch, onClose }: CuadrillaDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMembers, setEditMembers] = useState<MiembroUI[]>([]);
  const [serverMembers, setServerMembers] = useState<MiembroUI[]>([]);
  const [serverTotalPaginas, setServerTotalPaginas] = useState(1);
  const [serverTotalMembers, setServerTotalMembers] = useState(0);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [currentPuntero, setCurrentPuntero] = useState<MiembroUI | undefined>(undefined);

  const [isSaving, setIsSaving] = useState(false);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  
  const [todosLosEmpleados, setTodosLosEmpleados] = useState<EmpleadoResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeAssignments, setActiveAssignments] = useState<Map<number, string>>(new Map());
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;

  useEffect(() => {
    setIsEditing(false);
    setSearchTerm('');
    setShowDropdown(false);
    setPaginaActual(1);
  }, [cuadrilla]);

  useEffect(() => {
    setPaginaActual(1);
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar asignaciones activas de empleados de otras cuadrillas
  useEffect(() => {
    async function loadAssignments() {
      try {
        const assignments = await getEmpleadosCuadrillas();
        // Filtrar asignaciones activas de otras cuadrillas
        const activeOtherAssignments = assignments.filter(
          a => (a.esActivo || !a.fechaFin) && a.idCuadrilla !== cuadrilla?.idCuadrilla
        );
        const map = new Map<number, string>();
        activeOtherAssignments.forEach(a => {
          map.set(a.idEmpleado, a.nombreCuadrilla);
        });
        setActiveAssignments(map);
      } catch (err) {
        console.error("Error loading employee assignments:", err);
      }
    }
    if (isEditing && cuadrilla) {
      loadAssignments();
    } else {
      setActiveAssignments(new Map());
    }
  }, [isEditing, cuadrilla]);

  // Cargar miembros paginados para la vista
  useEffect(() => {
    async function loadMembersPaginados() {
      if (!cuadrilla || isEditing) return;
      try {
        setIsLoadingMembers(true);
        if (!cuadrilla.activa) {
          const ultimos = await getUltimosMiembros(cuadrilla.idCuadrilla);
          const mapped = ultimos.map(emp => {
             const partes = emp.nombreEmpleado ? emp.nombreEmpleado.split(' ') : ['Usuario'];
             const iniciales = partes.length > 1 ? partes[0][0] + partes[1][0] : partes[0][0];
             return {
               id: emp.idEmpleado,
               nombre: emp.nombreEmpleado || 'Desconocido',
               iniciales: iniciales ? iniciales.toUpperCase() : 'U',
               rol: emp.rol || 'Sin rol'
             };
          });
          setServerMembers(mapped);
          setServerTotalPaginas(Math.ceil(mapped.length / itemsPorPagina) || 1);
          setServerTotalMembers(mapped.length);
          const p = mapped.find(m => m.rol.toLowerCase().includes('puntero') || m.rol.toLowerCase().includes('capataz'));
          if (p) setCurrentPuntero(p);
        } else {
          const offset = (paginaActual - 1) * itemsPorPagina;
          const res = await obtenerEmpleadosPaginadosPorCuadrilla(
             cuadrilla.idCuadrilla, 
             offset, 
             itemsPorPagina, 
             false
          );
          
          if (!res || !res.empleadosCuadrilla) {
              throw new Error("Respuesta inválida del servidor");
          }

          const mapped = res.empleadosCuadrilla.map(emp => {
             const partes = emp.nombreEmpleado ? emp.nombreEmpleado.split(' ') : ['Usuario'];
             const iniciales = partes.length > 1 ? partes[0][0] + partes[1][0] : partes[0][0];
             return {
               id: emp.idEmpleado,
               nombre: emp.nombreEmpleado || 'Desconocido',
               iniciales: iniciales ? iniciales.toUpperCase() : 'U',
               rol: emp.rol || 'Sin rol'
             };
          });
          
          setServerMembers(mapped);
          setServerTotalPaginas(Math.ceil(res.total / itemsPorPagina) || 1);
          setServerTotalMembers(res.total);
          
          const p = mapped.find(m => m.rol.toLowerCase().includes('puntero') || m.rol.toLowerCase().includes('capataz'));
          if (p) setCurrentPuntero(p);
        }

      } catch (err) {
        console.error("Error loading members paginated", err);
      } finally {
        setIsLoadingMembers(false);
      }
    }
    
    loadMembersPaginados();
  }, [cuadrilla, isEditing, paginaActual]);

  // Cargar todos los miembros para editar
  useEffect(() => {
    async function loadAllForEdit() {
       if (!cuadrilla || !isEditing) return;
       try {
           setIsLoadingMembers(true);
           if (!cuadrilla.activa) {
             const ultimos = await getUltimosMiembros(cuadrilla.idCuadrilla);
             const mapped = ultimos.map(emp => {
                 const partes = emp.nombreEmpleado ? emp.nombreEmpleado.split(' ') : ['Usuario'];
                 const iniciales = partes.length > 1 ? partes[0][0] + partes[1][0] : partes[0][0];
                 return {
                   id: emp.idEmpleado,
                   nombre: emp.nombreEmpleado || 'Desconocido',
                   iniciales: iniciales ? iniciales.toUpperCase() : 'U',
                   rol: emp.rol || 'Sin rol'
                 };
             });
             setEditMembers(mapped);
             const p = mapped.find(m => m.rol.toLowerCase().includes('puntero') || m.rol.toLowerCase().includes('capataz'));
             setCurrentPuntero(p);
           } else {
             const res = await obtenerEmpleadosPaginadosPorCuadrilla(cuadrilla.idCuadrilla, 0, 1000, false);
             
             if (!res || !res.empleadosCuadrilla) {
                 throw new Error("Respuesta inválida del servidor");
             }

             const mapped = res.empleadosCuadrilla.map(emp => {
                 const partes = emp.nombreEmpleado ? emp.nombreEmpleado.split(' ') : ['Usuario'];
                 const iniciales = partes.length > 1 ? partes[0][0] + partes[1][0] : partes[0][0];
                 return {
                   id: emp.idEmpleado,
                   nombre: emp.nombreEmpleado || 'Desconocido',
                   iniciales: iniciales ? iniciales.toUpperCase() : 'U',
                   rol: emp.rol || 'Sin rol'
                 };
             });
             setEditMembers(mapped);
             const p = mapped.find(m => m.rol.toLowerCase().includes('puntero') || m.rol.toLowerCase().includes('capataz'));
             setCurrentPuntero(p);
           }
       } catch (err) {
           console.error("Error loading members for edit", err);
       } finally {
           setIsLoadingMembers(false);
       }
    }
    
    loadAllForEdit();
  }, [isEditing, cuadrilla]);

  useEffect(() => {
    async function fetchTodosLosEmpleados() {
      if (isEditing && todosLosEmpleados.length === 0) {
        try {
          const emp = await getEmpleados();
          setTodosLosEmpleados(emp);
        } catch (error) {
          console.error("Error al cargar todos los empleados:", error);
        }
      }
    }
    fetchTodosLosEmpleados();
  }, [isEditing, todosLosEmpleados.length]);

  if (!cuadrilla) {
    return (
      <div className="cuadrilla-details-pane empty-state">
        <div className="cuadrilla-details-empty">
          <p>Selecciona una cuadrilla para ver detalles</p>
        </div>
      </div>
    );
  }

  const handleRemoveMember = (idEmpleado: number) => {
    setEditMembers(prev => prev.filter(m => m.id !== idEmpleado));
    if (currentPuntero?.id === idEmpleado) {
      setCurrentPuntero(undefined);
    }
  };

  const handleSetPuntero = (idEmpleado: number) => {
    setEditMembers(prev => prev.map(m => {
      //Si era puntero, pasa a peón. El seleccionado pasa a Puntero.
      if (m.id === idEmpleado) return { ...m, rol: 'Puntero' };
      if (m.rol.toLowerCase().includes('puntero') || m.rol.toLowerCase().includes('capataz')) return { ...m, rol: 'Peón forestal' };
      return m;
    }));
    setCurrentPuntero(editMembers.find(m => m.id === idEmpleado));
  };

  const handleAddMember = (emp: EmpleadoDTO) => {
    if (editMembers.some(m => m.id === emp.idEmpleado)) {
      alert("El empleado ya está en la cuadrilla");
      return;
    }
    
    const nameParts = emp.nombre.trim().split(' ');
    const iniciales = nameParts.length > 1 
      ? nameParts[0].charAt(0) + nameParts[1].charAt(0) 
      : nameParts[0].charAt(0) + (nameParts[0].charAt(1) || '');

    setEditMembers(prev => [...prev, {
      id: emp.idEmpleado,
      nombre: emp.nombre,
      iniciales: iniciales.toUpperCase(),
      rol: 'Peón forestal'
    }]);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleSave = async () => {
    const hasPuntero = editMembers.some(m => 
      m.rol.toLowerCase().includes('puntero') || m.rol.toLowerCase().includes('capataz')
    );
    if (!hasPuntero && editMembers.length > 0) {
      alert("Es obligatorio seleccionar un puntero/capataz para la cuadrilla.");
      return;
    }

    try {
      setIsSaving(true);
      const syncPayload = editMembers.map(m => ({
        idEmpleado: m.id,
        rol: m.rol
      }));
      await sincronizarEmpleados(cuadrilla.idCuadrilla, syncPayload);
      setIsEditing(false);
      onRefetch();
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios");
    } finally {
      setIsSaving(false);
    }
  };



  const handleCancel = () => {
    setIsEditing(false);
    setSearchTerm('');
  };

  // Filtrar empleados para el autocomplete (que no estén ya en editMembers)
  const availableEmpleados = todosLosEmpleados.filter(e => 
    !editMembers.some(m => m.id === e.idEmpleado) &&
    (e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
     e.cedula.includes(searchTerm))
  );

  // Determinar miembros a mostrar
  const displayMembers = isEditing ? editMembers : serverMembers;
  
  // Paginación local si estamos editando
  const totalPaginas = isEditing ? Math.ceil(displayMembers.length / itemsPorPagina) || 1 : serverTotalPaginas;
  const miembrosPaginados = isEditing ? 
    displayMembers.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina) : 
    displayMembers;
  
  const totalCount = isEditing ? displayMembers.length : serverTotalMembers;

  const paginaAnterior = () => setPaginaActual(prev => Math.max(1, prev - 1));
  const paginaSiguiente = () => setPaginaActual(prev => Math.min(totalPaginas, prev + 1));

  return (
    <div className="cuadrilla-details-pane">
         <div className="details-header">
     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
       <button 
         className="mobile-back-btn" 
         onClick={onClose}
         style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: 0 }}
       >
         ←
       </button>
       <h2>{cuadrilla.nombre}</h2>
     </div>
     <span className={`status-badge ${cuadrilla.activa ? 'active' : 'inactive'}`}>
         {cuadrilla.activa ? 'Activa' : 'Inactiva'}
     </span>

      </div>

      <div className="details-section">
        <label>Puntero / Capataz</label>
        {isEditing ? (
          <div className="puntero-edit-selector">
            <select 
              value={currentPuntero?.id || ""} 
              onChange={(e) => handleSetPuntero(Number(e.target.value))}
              className={`puntero-select ${!currentPuntero && editMembers.length > 0 ? 'input-error' : ''}`}
            >
              <option value="" disabled>Selecciona un puntero de la lista...</option>
              {editMembers.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            {!currentPuntero && editMembers.length > 0 && (
              <span className="puntero-warning-text">
                * Es obligatorio seleccionar un puntero.
              </span>
            )}
          </div>
        ) : (
          <p className="detail-value">{currentPuntero ? currentPuntero.nombre : (isLoadingMembers ? 'Cargando...' : 'Ver en lista de miembros')}</p>
        )}
      </div>

      <div className="details-section">
        <label>Miembros ({totalCount})</label>
        
        {isLoadingMembers && !isEditing ? (
          <p style={{ color: 'var(--text-secondary)' }}>Cargando miembros...</p>
        ) : (
          <div className="miembros-list">
            {miembrosPaginados.map((miembro) => (
              <div key={miembro.id} className="miembro-item">
                <div className="miembro-avatar">{miembro.iniciales}</div>
                <div className="miembro-info">
                  <span className="miembro-nombre">{miembro.nombre}</span>
                  <span className="miembro-rol">{miembro.rol}</span>
                </div>
                
                {isEditing && (
                  <button 
                    className="icon-button danger-hover remove-member-btn"
                    onClick={() => handleRemoveMember(miembro.id)}
                    title="Quitar empleado"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            ))}

            {displayMembers.length === 0 && (
              <p className="empty-members">No hay miembros asignados.</p>
            )}

            {totalPaginas > 1 && (
              <div className="cuadrilla-pagination" style={{ marginTop: '16px', justifyContent: 'center', borderTop: 'none', paddingTop: 0 }}>
                <Button 
                  variant="secondary" 
                  size="small" 
                  onClick={paginaAnterior} 
                  disabled={paginaActual === 1}
                >
                  Anterior
                </Button>
                <span className="pagination-info" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Pág. {paginaActual} de {totalPaginas}
                </span>
                <Button 
                  variant="secondary" 
                  size="small" 
                  onClick={paginaSiguiente} 
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente
                </Button>
              </div>
            )}

            {isEditing && (
              cuadrilla.activa ? (
                <div className="add-member-row" ref={dropdownRef}>
                  <div className="miembro-avatar add-avatar">+</div>
                  <input 
                    type="text" 
                    className="add-member-input"
                    placeholder="Escribe para añadir empleado..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                  />
                  
                  {showDropdown && searchTerm && (
                    <div className="autocomplete-dropdown">
                      {availableEmpleados.length > 0 ? (
                        availableEmpleados.map(emp => {
                          const assignedSquadName = activeAssignments.get(emp.idEmpleado);
                          return (
                            <div 
                              key={emp.idEmpleado} 
                              className={`autocomplete-item ${assignedSquadName ? 'disabled' : ''}`}
                              onClick={() => {
                                if (assignedSquadName) return;
                                handleAddMember(emp);
                              }}
                            >
                              <div className="emp-search-info">
                                <span className="emp-name">{emp.nombre}</span>
                                {assignedSquadName && (
                                  <span className="assigned-squad-badge">
                                    En: {assignedSquadName}
                                  </span>
                                )}
                              </div>
                              <span className="emp-cedula">CI: {emp.cedula}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="autocomplete-empty">No se encontraron empleados.</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="inactive-edit-warning" style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center' }}>
                  No se pueden añadir nuevos empleados a una cuadrilla inactiva. Recupérala primero.
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div className="details-actions">
        {isEditing ? (
          <>
            <Button variant="secondary" size="medium" onClick={handleCancel} disabled={isSaving}>Cancelar</Button>
            <Button variant="primary" size="medium" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button 
                variant="secondary" 
                size="medium" 
                onClick={() => setIsEditing(true)}
              >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'text-bottom' }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Editar Cuadrilla
            </Button>
            <Button 
              variant="primary" 
              size="medium" 
              onClick={() => setShowAsignarModal(true)}
              disabled={!cuadrilla.activa}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'text-bottom' }}>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              Asignar Tarea
            </Button>
          </div>
        )}
      </div>

      {showAsignarModal && (
        <AsignarTareasCuadrillaModal
          idCuadrilla={cuadrilla.idCuadrilla}
          onClose={() => setShowAsignarModal(false)}
          onSuccess={() => {
            setShowAsignarModal(false);
            alert("Tareas asignadas correctamente.");
          }}
        />
      )}
    </div>
  );
}
