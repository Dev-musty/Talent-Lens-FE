interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export default function Select({ label, options, error, className = '', id, ...props }: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-300">
        {label}
        {props.required && <span className="text-brand-400 ml-1">*</span>}
      </label>
      <select
        id={selectId}
        className="input-field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-400 animate-fade-in">{error}</p>}
    </div>
  );
}
