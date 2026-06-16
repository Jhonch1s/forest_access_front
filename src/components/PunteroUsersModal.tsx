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
          <div className="modal-header-left">
          <h3>
            {view === 'form'
              ? isEditing
                ? 'Editar Usuario Puntero'
                : 'Nuevo Usuario Puntero'
              : 'Usuarios Punteros'}
          </h3>

          {view === 'list' && (
              <Button variant="primary" size="small" onClick={openCreate}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Nuevo</span>
              </Button>
            )}
          </div>

          <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">
            &times;
          </button>

        </div>

        {view === 'list' ? (
          <div className="punterousers-modal-body">

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
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            <span>Editar</span>
                          </Button>
                          <Button variant="danger" size="small" onClick={() => setDeleteTarget(user)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            <span>Eliminar</span>
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

            {!isEditing && (
              <div className="form-field">
                <label htmlFor="password">
                  Contraseña <span className="required">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
                <span className="field-hint">El puntero podrá cambiarla después</span>
              </div>
            )}

            <div className="modal-actions">
              <Button variant="secondary" onClick={backToList} type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                <span>Cancelar</span>
              </Button>
              <Button variant="primary" type="submit" loading={submitting}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
                <span>{isEditing ? 'Guardar' : 'Crear'}</span>
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
