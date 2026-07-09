import { StatCardSkeleton } from './Skeleton';

/**
 * StatCard — metric card with icon, value, label, and optional trend.
 */
export default function StatCard({
  title,
  value,
  icon: Icon,
  iconBg = 'bg-indigo-50',
  iconColor = 'text-indigo-600',
  trend,       // e.g. "+12.4%"
  trendUp,     // true = positive (green), false = negative (red)
  loading = false,
  footer,
}) {
  if (loading) return <StatCardSkeleton />;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        {Icon && (
          <div className={`p-2 rounded-lg ${iconBg}`}>
            <Icon size={18} className={iconColor} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {(trend || footer) && (
        <div className="mt-2">
          {trend && (
            <span
              className={`text-xs font-medium ${
                trendUp ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend}
            </span>
          )}
          {footer && <span className="text-xs text-slate-400 ml-1">{footer}</span>}
        </div>
      )}
    </div>
  );
}
