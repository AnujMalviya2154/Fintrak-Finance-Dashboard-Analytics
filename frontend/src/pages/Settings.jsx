import { useState, useEffect } from 'react';
import { Sun, Moon, Bell } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('notifications', notifications);
  }, [notifications]);

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your preferences" />

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Appearance</h3>
        <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={16} className="text-slate-500" /> : <Sun size={16} className="text-slate-500" />}
            <div>
              <p className="text-sm font-medium text-slate-700">Dark Mode</p>
              <p className="text-xs text-slate-500">Switch between light and dark theme</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              darkMode ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Notifications</h3>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Bell size={16} className="text-slate-500" />
            <div>
              <p className="text-sm font-medium text-slate-700">In-app Notifications</p>
              <p className="text-xs text-slate-500">Show toast notifications for actions</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(n => !n)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              notifications ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                notifications ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">About</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Application</span>
            <span className="text-slate-700 font-medium">Fintrak v1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Backend</span>
            <span className="text-slate-700 font-medium">Node.js + Express + MongoDB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Frontend</span>
            <span className="text-slate-700 font-medium">React 19 + Vite + Tailwind v4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
