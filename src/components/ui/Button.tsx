import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  loadingText,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button
      className={`${base} flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
