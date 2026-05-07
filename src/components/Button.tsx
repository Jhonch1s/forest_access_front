import './Button.css';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({
  variant,
  size = 'medium',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
}: ButtonProps) {
  const className = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    loading ? 'button-loading' : '',
    disabled ? 'button-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
}

export default Button;
