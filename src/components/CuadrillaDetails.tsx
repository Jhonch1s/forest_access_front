import { useState, useEffect, useRef } from 'react';
import type { CuadrillaUI } from '../hooks/useCuadrillas';
import { useEmpleados } from '../hooks/useEmpleados';
import { sincronizarEmpleados } from '../services/cuadrillaService';
import { getEmpleadosCuadrillas } from '../services/empleadoCuadrillaService';
import './CuadrillaDetails.css';
import Button from './Button';

interface CuadrillaDetailsProps {
  cuadrilla: CuadrillaUI | null;
  onRefetch: () => void;
  onClose: () => void;
}

export default function CuadrillaDetails({ cuadrilla, onRefetch, onClose }: CuadrillaDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMembers, setEditMembers] = useState<CuadrillaUI['miembros']>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const { empleados } = useEmpleados();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeAssignments, setActiveAssignments] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (cuadrilla) {
      setEditMembers([...cuadrilla.miembros]);
    }
    setIsEditing(false);
    setSearchTerm('');
    setShowDropdown(false);
  }, [cuadrilla]);

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
  };

  const handleSetPuntero = (idEmpleado: number) => {
    setEditMembers(prev => prev.map(m => {
      //Si era puntero, pasa a peón. El seleccionado pasa a Puntero.
      if (m.id === idEmpleado) return { ...m, rol: 'Puntero' };
      if (m.rol.toLowerCase().includes('puntero') || m.rol.toLowerCase().includes('capataz')) return { ...m, rol: 'Peón forestal' };
      return m;
    }));
  };

  const handleAddMember = (emp: any) => {
    if (editMembers.some(m => m.id === emp.idEmpleado)) {
      alert("El empleado ya está en la cuadrilla");
      return;
    }
    
    // Calcular iniciales para la UI local
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
    if (!hasPuntero) {
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
    setEditMembers([...cuadrilla.miembros]);
    setIsEditing(false);
    setSearchTerm('');
  };

  // Filtrar empleados para el autocomplete (que no estén ya en editMembers)
  const availableEmpleados = empleados.filter(e => 
    !editMembers.some(m => m.id === e.idEmpleado) &&
    (e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
     e.cedula.includes(searchTerm))
  );

  const displayMembers = isEditing ? editMembers : cuadrilla.miembros;
  const currentPuntero = displayMembers.find(m => m.rol.toLowerCase().includes('puntero') || m.rol.toLowerCase().includes('capataz'));

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
              className={`puntero-select ${!currentPuntero ? 'input-error' : ''}`}
            >
              <option value="" disabled>Selecciona un puntero de la lista...</option>
              {editMembers.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            {!currentPuntero && (
              <span className="puntero-warning-text">
                * Es obligatorio seleccionar un puntero.
              </span>
            )}
          </div>
        ) : (
          <p className="detail-value">{currentPuntero ? currentPuntero.nombre : 'Sin asignar'}</p>
        )}
      </div>

      <div className="details-section">
        <label>Miembros ({displayMembers.length})</label>
        
        <div className="miembros-list">
          {displayMembers.map((miembro) => (
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

          {displayMembers.length === 0 && !isEditing && (
             <p className="empty-members">No hay miembros asignados.</p>
          )}

          {isEditing && (
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
          )}
        </div>
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
          <Button 
            variant="secondary" 
            size="medium" 
            onClick={() => setIsEditing(true)}
            disabled={!cuadrilla.activa}
          >
            Editar Cuadrilla
          </Button>
        )}
      </div>
    </div>
  );
}
