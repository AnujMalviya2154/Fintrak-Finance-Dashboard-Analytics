/**
 * Skeleton — shimmer placeholder blocks for loading states.
 * Usage: <Skeleton className="h-4 w-32" />
 */
export default function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

/**
 * StatCardSkeleton — skeleton for the summary stat cards.
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

/**
 * TableRowSkeleton — skeleton for a table row.
 */
export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
