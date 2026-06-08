import { useState } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';
import { createPunteroUsuario, updatePunteroUsuario, deletePunteroUsuario } from '../services/usuarioService';
import type { PunteroUsuarioResponse } from '../types/auth';
import type { PunteroDisponible } from '../hooks/useUsuariosPuntero';
import ConfirmModal from './ConfirmModal';
import Button from './Button';
import './PunteroUsersModal.css';

interface PunteroUsersModalProps {
  usuarios: PunteroUsuarioResponse[];
  punterosDisponibles: PunteroDisponible[];
  loading: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

function PunteroUsersModal({ usuarios, punterosDisponibles, loading, onClose, onRefresh }: PunteroUsersModalProps) {
  const modalRef = useModalA11y(true, onClose);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingUser, setEditingUser] = useState<PunteroUsuarioResponse | null>(null);

  const [idEmpleado, setIdEmpleado] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<PunteroUsuarioResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isEditing = editingUser !== null;

  const openCreate = () => {
    setEditingUser(null);
    setIdEmpleado('');
    setUsername('');
    setPassword('');
    setErrors({});
    setSubmitError(null);
    setView('form');
  };

  const openEdit = (user: PunteroUsuarioResponse) => {
    setEditingUser(user);
    setIdEmpleado(String(user.idEmpleado ?? ''));
    setUsername(user.nombreUsuario);
    setPassword('');
    setErrors({});
    setSubmitError(null);
    setView('form');
  };

  const backToList = () => {
    setView('list');
    setEditingUser(null);
    setSubmitError(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!isEditing && !idEmpleado) {
      newErrors.idEmpleado = 'Debe seleccionar un empleado';
    }
    if (!username.trim()) {
      newErrors.username = 'Nombre de usuario es requerido';
    }
    if (!isEditing && !password) {
      newErrors.password = 'Contraseña es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEditing && editingUser) {
        const payload: { nombreUsuario: string; password?: string } = { nombreUsuario: username.trim() };
        if (password) payload.password = password;
        await updatePunteroUsuario(editingUser.id, payload);
      } else {
        await createPunteroUsuario({
          nombreUsuario: username.trim(),
          password,
          idEmpleado: Number(idEmpleado),
        });
      }
      onRefresh();
      backToList();
    } catch (err: unknown) {
      let msg = 'Error al guardar';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
        msg = axiosErr.response?.data?.message ?? axiosErr.response?.data?.error ?? msg;
      }
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePunteroUsuario(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } catch (err: unknown) {
      let msg = 'Error al eliminar';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
        msg = axiosErr.response?.data?.message ?? axiosErr.response?.data?.error ?? msg;
      }
      setSubmitError(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="punterousers-modal" ref={modalRef} role="dialog" aria-modal="true" aria-label="Usuarios Punteros" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {view === 'form'
              ? isEditing
                ? 'Editar Usuario Puntero'
                : 'Nuevo Usuario Puntero'
              : 'Usuarios Punteros'}
          </h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">
            &times;
          </button>
        </div>

        {view === 'list' ? (
          <div className="punterousers-modal-body">
            <div className="punterousers-toolbar">
              <Button variant="primary" size="small" onClick={openCreate}>
                + Nuevo
              </Button>
            </div>

            {submitError && <div className="modal-error">{submitError}</div>}

            {loading ? (
              <div className="punterousers-status">
                <div className="punterousers-spinner" />
                <p>Cargando...</p>
              </div>
            ) : usuarios.length === 0 ? (
              <div className="punterousers-status">
                <p>No hay usuarios punteros registrados.</p>
              </div>
            ) : (
              <div className="punterousers-table-wrap">
                <table className="table punterousers-table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Empleado</th>
                      <th>Perfiles</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((user) => (
                      <tr key={user.id}>
                        <td>{user.nombreUsuario}</td>
                        <td>{user.nombreEmpleado}</td>
                        <td>
                          {user.perfiles?.map((p) => (
                            <span key={p.id} className="badge badge-success" style={{ marginRight: 4 }}>
                              {p.nombre}
                            </span>
                          ))}
                        </td>
                        <td className="punterousers-actions">
                          <Button variant="secondary" size="small" onClick={() => openEdit(user)}>
                            Editar
                          </Button>
                          <Button variant="danger" size="small" onClick={() => setDeleteTarget(user)}>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form punterousers-form">
            {submitError && <div className="modal-error">{submitError}</div>}

            {!isEditing && (
              <div className="form-field">
                <label htmlFor="idEmpleado">
                  Empleado Puntero <span className="required">*</span>
                </label>
                <select
                  id="idEmpleado"
                  value={idEmpleado}
                  onChange={(e) => setIdEmpleado(e.target.value)}
                  disabled={submitting}
                  className={errors.idEmpleado ? 'error' : ''}
                >
                  <option value="">Seleccionar empleado...</option>
                  {punterosDisponibles.map((p) => (
                    <option key={p.idEmpleado} value={p.idEmpleado}>
                      {p.nombreEmpleado}
                    </option>
                  ))}
                </select>
                {errors.idEmpleado && <span className="field-error">{errors.idEmpleado}</span>}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="username">
                Nombre de Usuario <span className="required">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
                className={errors.username ? 'error' : ''}
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="password">
                {isEditing ? 'Nueva Contraseña' : 'Contraseña'}
                {!isEditing && <span className="required"> *</span>}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                placeholder={isEditing ? 'Dejar vacío para mantener actual' : undefined}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
              {isEditing && (
                <span className="field-hint">Solo completar si desea cambiar la contraseña</span>
              )}
            </div>

            <div className="modal-actions">
              <Button variant="secondary" onClick={backToList} type="button">
                Cancelar
              </Button>
              <Button variant="primary" type="submit" loading={submitting}>
                {isEditing ? 'Guardar' : 'Crear'}
              </Button>
            </div>
          </form>
        )}

        {deleteTarget && (
          <ConfirmModal
            isOpen
            title="Eliminar Usuario"
            message={`¿Está seguro de eliminar el usuario "${deleteTarget.nombreUsuario}"? Se revocará el acceso al sistema del empleado ${deleteTarget.nombreEmpleado}.`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            isLoading={deleting}
          />
        )}
      </div>
    </div>
  );
}

export default PunteroUsersModal;
