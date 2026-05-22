import { useModalA11y } from '../hooks/useModalA11y';
import './ConfirmModal.css';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isLoading = false }: ConfirmModalProps) {
  const modalRef = useModalA11y(isOpen, onCancel);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-content" ref={modalRef} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-modal-actions">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
