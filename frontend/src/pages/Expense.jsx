import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
  TrendingDown, Plus, Pencil, Trash2, Download,
  Search, ChevronLeft, ChevronRight, IndianRupee, Hash,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { expenseService } from '../services/expenseService';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, getErrorMessage } from '../utils/formatters';
import { EXPENSE_CATEGORIES, DATE_RANGES } from '../constants/categories';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import Skeleton from '../components/ui/Skeleton';

const PAGE_LIMIT = 10;

const PIE_COLORS = [
  '#6366f1', '#f43f5e', '#10b981', '#f59e0b',
  '#3b82f6', '#8b5cf6', '#06b6d4', '#84cc16',
];

// ─── Add / Edit Form ──────────────────────────────────────────────────────
function ExpenseForm({ onSubmit, loading, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  useEffect(() => { reset(defaultValues); }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="description"
        label="Description"
        placeholder="e.g. Grocery shopping"
        error={errors.description?.message}
        {...register('description', {
          required: 'Description is required',
          maxLength: { value: 300, message: 'Description cannot exceed 300 characters' },
        })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="amount"
          label="Amount (₹)"
          type="number"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Must be positive' },
          })}
        />
        <Input
          id="date"
          label="Date"
          type="date"
          error={errors.date?.message}
          {...register('date', { required: 'Date is required' })}
        />
      </div>
      <Select
        id="category"
        label="Category"
        options={EXPENSE_CATEGORIES}
        placeholder="Select a category"
        error={errors.category?.message}
        {...register('category', { required: 'Category is required' })}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" variant="danger" loading={loading}>
          {defaultValues?._id ? 'Save Changes' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
}

// ─── Overview section ─────────────────────────────────────────────────────
function OverviewSection({ range, setRange, onRefresh }) {
  const { addToast } = useToast();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const res = await expenseService.getOverview(range);
      setOverview(res.data);
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [range, addToast]);

  useEffect(() => { fetchOverview(); }, [fetchOverview]);
  // Allow parent to trigger a refresh
  useEffect(() => { if (onRefresh) fetchOverview(); }, [onRefresh]); // eslint-disable-line

  // Category breakdown for pie chart
  const categoryMap = {};
  (overview?.recentTransactions || []).forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-4">
      {/* Range selector */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {DATE_RANGES.map(r => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              range === r.value
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Expenses"
              value={formatCurrency(overview?.totalExpense)}
              icon={IndianRupee}
              iconBg="bg-rose-50"
              iconColor="text-rose-600"
            />
            <StatCard
              title="Transactions"
              value={overview?.numberOfTransactions ?? 0}
              icon={Hash}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
            />
            <StatCard
              title="Average Expense"
              value={formatCurrency(overview?.averageExpense)}
              icon={TrendingDown}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
            />
          </>
        )}
      </div>

      {/* Charts */}
      {!loading && pieData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bar chart - recent */}
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Recent Expenses</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={(overview?.recentTransactions || []).slice(0, 6).map(t => ({
                  name: t.description?.slice(0, 10) || 'Expense',
                  amount: t.amount,
                }))}
                barCategoryGap="35%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ borderRadius: '10px', fontSize: '12px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="amount" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart - by category */}
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">By Category</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ borderRadius: '10px', fontSize: '12px', border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Expense Page ────────────────────────────────────────────────────
export default function Expense() {
  const { addToast } = useToast();

  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [listLoading, setListLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [range, setRange] = useState('monthly');
  const [refreshOverview, setRefreshOverview] = useState(0);

  const fetchExpenses = useCallback(async (pg = page) => {
    setListLoading(true);
    try {
      const res = await expenseService.getAll(pg, PAGE_LIMIT);
      setExpenses(res.data);
      setPagination(res.pagination);
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setListLoading(false);
    }
  }, [page, addToast]);

  useEffect(() => { fetchExpenses(page); }, [page]); // eslint-disable-line

  const triggerOverviewRefresh = () => setRefreshOverview(n => n + 1);

  const handleAdd = async (formData) => {
    setFormLoading(true);
    try {
      await expenseService.add(formData);
      addToast('Expense added successfully', 'success');
      setModalOpen(false);
      setEditTarget(null);
      fetchExpenses(1);
      setPage(1);
      triggerOverviewRefresh();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    setFormLoading(true);
    try {
      await expenseService.update(editTarget._id, formData);
      addToast('Expense updated successfully', 'success');
      setModalOpen(false);
      setEditTarget(null);
      fetchExpenses(page);
      triggerOverviewRefresh();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await expenseService.delete(deleteTarget._id);
      addToast('Expense deleted', 'success');
      setDeleteTarget(null);
      fetchExpenses(page);
      triggerOverviewRefresh();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await expenseService.downloadExcel();
      const url = URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expense_details.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    }
  };

  const openEdit = (expense) => {
    setEditTarget(expense);
    setModalOpen(true);
  };

  const filtered = expenses.filter(exp => {
    const matchSearch = !search ||
      exp.description.toLowerCase().includes(search.toLowerCase()) ||
      exp.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCategory || exp.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        subtitle="Monitor and manage your spending"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleDownload}>
              <Download size={14} />
              Export
            </Button>
            <Button variant="danger" size="sm" onClick={() => { setEditTarget(null); setModalOpen(true); }}>
              <Plus size={14} />
              Add Expense
            </Button>
          </div>
        }
      />

      <OverviewSection range={range} setRange={setRange} onRefresh={refreshOverview} />

      {/* Transaction list */}
      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 border-b border-slate-100">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="text-xs text-slate-500 shrink-0">
            {pagination.total} total records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Description</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Category</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Date</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">Amount</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={TrendingDown}
                      title="No expense records"
                      description="Add your first expense to start tracking."
                      action={
                        <Button variant="danger" size="sm" onClick={() => { setEditTarget(null); setModalOpen(true); }}>
                          <Plus size={14} /> Add Expense
                        </Button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map(exp => (
                  <tr key={exp._id} className="border-b border-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 ease-out">
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px] truncate">
                      {exp.description}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 text-xs font-medium rounded-full">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(exp.date)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-rose-600">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => openEdit(exp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 ease-out"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(exp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-200 ease-out"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 text-slate-600"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 text-slate-600"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        title={editTarget ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          loading={formLoading}
          onSubmit={editTarget ? handleUpdate : handleAdd}
          defaultValues={
            editTarget
              ? {
                  description: editTarget.description,
                  amount: editTarget.amount,
                  category: editTarget.category,
                  date: editTarget.date?.slice(0, 10),
                  _id: editTarget._id,
                }
              : {}
          }
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete expense?"
        message={`Are you sure you want to delete "${deleteTarget?.description}"? This cannot be undone.`}
      />
    </div>
  );
}
