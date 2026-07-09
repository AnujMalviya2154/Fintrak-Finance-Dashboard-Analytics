import { Link } from 'react-router-dom';
import { BarChart2, TrendingUp, TrendingDown, PieChart, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Track Income',
    description: 'Log and categorize all your income sources in one place.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: TrendingDown,
    title: 'Monitor Expenses',
    description: 'Keep tabs on every expense with categories and filters.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: PieChart,
    title: 'Visual Analytics',
    description: 'Beautiful charts to understand your spending patterns.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    description: 'JWT authentication with owner-scoped data access.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <BarChart2 size={18} className="text-white" />
            </div>
            <span className="text-lg">Fintrak</span>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <BarChart2 size={12} />
          Finance Dashboard & Analytics Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-5 leading-tight">
          Know exactly where your<br className="hidden md:block" /> money goes
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">
          Fintrak helps you track income, control expenses, and understand your finances — all in one clean dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm"
          >
            Create Free Account
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-300 transition-colors text-sm"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
            <div key={title} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
