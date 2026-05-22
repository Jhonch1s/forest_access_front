import { useState, useMemo } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';
import Button from './Button';
import './FormModal.css';

export interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'number';
  required?: boolean;
  step?: string;
  disabled?: boolean;
}

interface FormModalProps {
  title: string;
  fields: FieldConfig[];
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, string | number>) => Promise<void>;
  onClose: () => void;
}

function computeDefaults(fields: FieldConfig[], initialValues?: Record<string, unknown>) {
  const defaults: Record<string, string | number> = {};
  for (const field of fields) {
    const raw = initialValues?.[field.name];
    defaults[field.name] = raw !== undefined && raw !== null ? String(raw) : '';
  }
  return defaults;
}

function FormModal({ title, fields, initialValues, onSubmit, onClose }: FormModalProps) {
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

export default FormModal;
