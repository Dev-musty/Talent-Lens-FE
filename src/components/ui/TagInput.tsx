import { useState, type KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

export default function TagInput({ tags, onChange, placeholder = 'Type and press Enter...', label, error, required }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-brand-400 ml-1">*</span>}
        </label>
      )}
      <div className="input-field flex flex-wrap gap-2 min-h-[48px] items-center cursor-text"
        onClick={(e) => {
          const input = (e.currentTarget as HTMLDivElement).querySelector('input');
          input?.focus();
        }}
      >
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-500/20 text-brand-300 rounded-lg text-sm font-medium min-h-[36px] animate-fade-in"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              className="ml-0.5 text-brand-400 hover:text-white transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addTag(input); }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-400 animate-fade-in">{error}</p>}
    </div>
  );
}
