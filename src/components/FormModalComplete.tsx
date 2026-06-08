import { useState, useMemo } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';
import Button from './Button';
import './FormModal.css';

export interface FieldConfigComplete {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'checkbox' | 'date' | 'image';
  required?: boolean;
  step?: string;
  disabled?: boolean;
  // Solo para type="select"
  options?: Array<{ value: string | number; label: string }>;
}

interface FormModalProps {
  title: string;
  fields: FieldConfigComplete[];
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, string | number>) => Promise<void>;
  onClose: () => void;
}

function computeDefaults(fields: FieldConfigComplete[], initialValues?: Record<string, unknown>) {
  const defaults: Record<string, string | number> = {};
  for (const field of fields) {
    const raw = initialValues?.[field.name];

    if (field.type === 'checkbox') {
      // Convertir el valor inicial a 'true'/'false'
      if (raw !== undefined && raw !== null) {
        defaults[field.name] = raw ? 'true' : 'false';
      } else {
        defaults[field.name] = 'false';
      }
    } else {
      defaults[field.name] = raw !== undefined && raw !== null ? String(raw) : '';
    }
  }
  return defaults;
}

function FormModalComplete({ title, fields, initialValues, onSubmit, onClose }: FormModalProps) {
  const modalRef = useModalA11y(true, onClose);
  const initialDefaults = useMemo(() => computeDefaults(fields, initialValues), [fields, initialValues]);
  const [values, setValues] = useState<Record<string, string | number>>(initialDefaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      // Validación required para todos los tipos
      if (field.required) {
        if (field.type === 'checkbox') {
          if (val !== 'true') {
            newErrors[field.name] = `${field.label} es requerido`;
          }
        } else {
          if (val === '' || val === undefined || val === null) {
            newErrors[field.name] = `${field.label} es requerido`;
          }
        }
      }

      // Validación numérica
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
      await onSubmit(processed);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" ref={modalRef} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {submitError && <div className="modal-error">{submitError}</div>}

          {fields.map((field) => (
            <div key={field.name} className="form-field">
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="required"> *</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  id={field.name}
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={field.disabled || submitting}
                  className={errors[field.name] ? 'error' : ''}
                >
                  <option value="" disabled>Seleccione una opción</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  id={field.name}
                  checked={values[field.name] === 'true'}
                  onChange={(e) => handleChange(field.name, e.target.checked ? 'true' : 'false')}
                  disabled={field.disabled || submitting}
                  className={errors[field.name] ? 'error' : ''}
                />
              ) : field.type === 'image' ? (
                <input 
                id={field.name}
                type="image"
                value={values[field.name] ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={field.disabled || submitting}
                className={errors[field.name] ? 'error' : ''} />
              ) : (
                <input
                  id={field.name}
                  type={field.type === 'date' ? 'date' : (field.type === 'number' ? 'number' : 'text')}
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={field.disabled || submitting}
                  step={field.type === 'number' ? field.step : undefined}
                  className={errors[field.name] ? 'error' : ''}
                />
              )}

              {errors[field.name] && (
                <span className="field-error">{errors[field.name]}</span>
              )}
            </div>
          ))}

          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormModalComplete;