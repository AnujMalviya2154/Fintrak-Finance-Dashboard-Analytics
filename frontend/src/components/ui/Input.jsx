/**
 * Input — controlled input with label, error, and optional icon.
 */
export default function Input({
  label,
  id,
  error,
  icon: Icon,
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
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <Icon size={16} />
          </span>
        )}
        <input
          id={id}
          className={`
            w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800
            placeholder:text-slate-400 transition-colors
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            disabled:bg-slate-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-9' : ''}
            ${error ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
