/**
 * EmptyState — displayed when a list has no items.
 */
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="mb-4 p-4 bg-slate-100 rounded-full">
          <Icon size={28} className="text-slate-400" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-slate-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mb-4 max-w-xs">{description}</p>
      )}
      {action}
    </div>
  );
}
