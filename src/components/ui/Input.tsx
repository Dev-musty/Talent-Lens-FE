import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  charCount?: { current: number; max: number };
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, multiline = false, rows = 4, charCount, className = '', id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-300">
            {label}
            {props.required && <span className="text-brand-400 ml-1">*</span>}
          </label>
          {charCount && (
            <span className={`text-xs ${charCount.current > charCount.max ? 'text-red-400' : 'text-gray-500'}`}>
              {charCount.current}/{charCount.max}
            </span>
          )}
        </div>

        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            rows={rows}
            className="input-field resize-none"
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={inputId}
            className="input-field"
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {error && (
          <p className="text-sm text-red-400 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
