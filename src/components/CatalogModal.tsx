import { useState } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';
import type { FieldConfig } from './FormModal';
import Button from './Button';
import './CatalogModal.css';

interface CatalogColumn {
  key: string;
  label: string;
}

interface CatalogModalProps {
  title: string;
  columns: CatalogColumn[];
  fields: FieldConfig[];
  items: Record<string, unknown>[];
  loading: boolean;
  idField: string;
  displayField: string;
  onCreate: (values: Record<string, string | number>) => Promise<void>;
  onUpdate: (id: number, values: Record<string, string | number>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onClose: () => void;
  onRefresh: () => void;
}

function computeDefaults(fields: FieldConfig[]) {
  const defaults: Record<string, string | number> = {};
  for (const field of fields) {
    defaults[field.name] = '';
  }
  return defaults;
}

function CatalogModal({
  title,
  columns,
  fields,
  items,
  loading,
  idField,
  onCreate,
  onUpdate,
  onDelete,
  onClose,
  onRefresh,
}: CatalogModalProps) {
  const modalRef = useModalA11y(true, onClose);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);

  // Form state
  const [values, setValues] = useState<Record<string, string | number>>(() =>
    computeDefaults(fields)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isEditing = editingItem !== null;

  const openCreate = () => {
    setEditingItem(null);
    setValues(computeDefaults(fields));
    setErrors({});
    setSubmitError(null);
    setView('form');
  };

  const openEdit = (item: Record<string, unknown>) => {
    setEditingItem(item);
    const defaults: Record<string, string | number> = {};
    for (const field of fields) {
      const raw = item[field.name];
      defaults[field.name] = raw !== undefined && raw !== null ? String(raw) : '';
    }
    setValues(defaults);
    setErrors({});
    setSubmitError(null);
    setView('form');
  };

  const backToList = () => {
    setView('list');
    setEditingItem(null);
    setSubmitError(null);
  };

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.disabled) continue;
      const val = values[field.name];
      if (field.required && (val === '' || val === undefined || val === null)) {
        newErrors[field.name] = `${field.label} es requerido`;
      }
      if (field.type === 'number' && val !== '' && val !== undefined && val !== null) {
        if (isNaN(Number(val))) {
          newErrors[field.name] = `${field.label} debe ser un número`;
        }
      }
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
      const processed: Record<string, string | number> = {};
      for (const field of fields) {
        const val = values[field.name];
        if (field.type === 'number' && val !== '') {
          processed[field.name] = Number(val);
        } else {
          processed[field.name] = val;
        }
      }

      if (isEditing) {
        const id = Number(editingItem[idField]);
        await onUpdate(id, processed);
      } else {
        await onCreate(processed);
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

  const handleDelete = async (item: Record<string, unknown>) => {
    const id = Number(item[idField]);
    setDeletingId(id);
    setDeleteError(null);
    try {
      await onDelete(id);
      onRefresh();
    } catch (err: unknown) {
      let msg = 'Error al eliminar';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
        msg = axiosErr.response?.data?.message ?? axiosErr.response?.data?.error ?? msg;
      }
      setDeleteError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const formatValue = (item: Record<string, unknown>, key: string): string => {
    const val = item[key];
    if (val === null || val === undefined) return '—';
    return String(val);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="catalog-modal" ref={modalRef} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-header-left">
            <h3>
              {view === 'form'
                ? isEditing
                  ? `Editar ${title}`
                  : `Nuevo ${title}`
                : title}
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
          <div className="catalog-modal-body">

            {deleteError && <div className="modal-error">{deleteError}</div>}

            {loading ? (
              <div className="catalog-modal-status">
                <div className="catalog-modal-spinner" />
                <p>Cargando...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="catalog-modal-status">
                <p>No hay registros.</p>
              </div>
            ) : (
              <div className="catalog-modal-table-wrap">
                <table className="table catalog-modal-table">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const itemId = Number(item[idField]);
                      const isDeleting = deletingId === itemId;
                      return (
                        <tr key={itemId}>
                          {columns.map((col) => (
                            <td key={col.key}>{formatValue(item, col.key)}</td>
                          ))}
                          <td className="catalog-modal-actions">
                            <Button variant="secondary" size="small" onClick={() => openEdit(item)}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                              <span>Editar</span>
                            </Button>
                            <Button variant="danger" size="small" loading={isDeleting} onClick={() => handleDelete(item)}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              <span>Eliminar</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            {submitError && <div className="modal-error">{submitError}</div>}

            {fields.map((field) => (
              <div key={field.name} className="form-field">
                <label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="required"> *</span>}
                </label>
                <input
                  id={field.name}
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={field.disabled || submitting}
                  step={field.step}
                  className={errors[field.name] ? 'error' : ''}
                />
                {errors[field.name] && (
                  <span className="field-error">{errors[field.name]}</span>
                )}
              </div>
            ))}

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
      </div>
    </div>
  );
}

export default CatalogModal;
