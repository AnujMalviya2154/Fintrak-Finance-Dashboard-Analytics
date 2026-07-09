import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown, PiggyBank, Percent,
  RefreshCw, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getErrorMessage } from '../utils/formatters';
import StatCard from '../components/ui/StatCard';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

// Chart color palette
const PIE_COLORS = [
  '#6366f1', '#f43f5e', '#10b981', '#f59e0b',
  '#3b82f6', '#8b5cf6', '#06b6d4', '#84cc16',
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-md px-4 py-3 text-sm">
      {label && <p className="font-semibold text-slate-700 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-3">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getOverview();
      setData(res.data);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Build a simple area chart dataset from income vs expense (current month placeholder)
  const areaData = data
    ? [
        { name: 'Income', value: data.monthlyIncome },
        { name: 'Expenses', value: data.monthlyExpense },
        { name: 'Savings', value: data.savings },
      ]
    : [];

  const pieData = data?.expenseDistribution?.map(d => ({
    name: d.category,
    value: d.amount,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Good {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Here's your financial summary for this month
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchData} className="text-rose-600 font-medium hover:underline ml-4">
            Retry
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Monthly Income"
              value={formatCurrency(data?.monthlyIncome)}
              icon={TrendingUp}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
              footer="This month"
            />
            <StatCard
              title="Monthly Expenses"
              value={formatCurrency(data?.monthlyExpense)}
              icon={TrendingDown}
              iconBg="bg-rose-50"
              iconColor="text-rose-600"
              footer="This month"
            />
            <StatCard
              title="Net Savings"
              value={formatCurrency(data?.savings)}
              icon={PiggyBank}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
              footer="Income – Expenses"
            />
            <StatCard
              title="Savings Rate"
              value={`${data?.savingsRate ?? 0}%`}
              icon={Percent}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              footer="Of monthly income"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Income vs Expense bar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5">
          {loading ? (
            <><Skeleton className="h-5 w-40 mb-4" /><Skeleton className="h-48 w-full" /></>
          ) : (
            <>
              <h2 className="text-sm font-semibold text-slate-700 mb-4">Monthly Overview</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={areaData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {areaData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.name === 'Income' ? '#10b981' : entry.name === 'Expenses' ? '#f43f5e' : '#6366f1'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>

        {/* Expense distribution pie */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          {loading ? (
            <><Skeleton className="h-5 w-36 mb-4" /><Skeleton className="h-48 w-full rounded-full" /></>
          ) : pieData.length === 0 ? (
            <EmptyState
              icon={TrendingDown}
              title="No expense data"
              description="Add some expenses to see the distribution."
            />
          ) : (
            <>
              <h2 className="text-sm font-semibold text-slate-700 mb-4">Expense Breakdown</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Recent Transactions</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : !data?.recentTransactions?.length ? (
          <EmptyState
            icon={PiggyBank}
            title="No transactions yet"
            description="Add income or expenses to see them here."
          />
        ) : (
          <div className="space-y-2">
            {data.recentTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx._id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isIncome ? 'bg-emerald-50' : 'bg-rose-50'
                    }`}
                  >
                    {isIncome
                      ? <ArrowUpRight size={16} className="text-emerald-600" />
                      : <ArrowDownRight size={16} className="text-rose-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{tx.description}</p>
                    <p className="text-xs text-slate-500">
                      {tx.category} · {formatDate(tx.date)}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold shrink-0 ${
                      isIncome ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}