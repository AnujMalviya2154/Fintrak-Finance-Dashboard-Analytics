/**
 * Select — styled wrapper around a native <select>.
 */
export default function Select({
  label,
  id,
  error,
  options = [],
  placeholder,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 transition-colors
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          disabled:bg-slate-50 disabled:cursor-not-allowed
          ${error ? 'border-rose-400' : 'border-slate-300'}
          ${className}
        `}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
