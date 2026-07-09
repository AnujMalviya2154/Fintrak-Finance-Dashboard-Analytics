import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { getErrorMessage, getInitials, formatDate } from '../utils/formatters';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

// ─── Profile Info Form ─────────────────────────────────────────────────────
function ProfileForm({ user, onSuccess }) {
  const { addToast } = useToast();
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const onSubmit = async ({ name, email }) => {
    setLoading(true);
    try {
      const res = await authService.updateProfile(name, email);
      updateUser(res.user);
      addToast('Profile updated successfully', 'success');
      onSuccess?.();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="profile-name"
        label="Full Name"
        icon={User}
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
        })}
      />
      <Input
        id="profile-email"
        label="Email Address"
        type="email"
        icon={Mail}
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
        })}
      />
      <div className="flex justify-end">
        <Button type="submit" loading={loading} disabled={!isDirty || loading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}

// ─── Change Password Form ─────────────────────────────────────────────────
function PasswordForm() {
  const { addToast } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPwd = watch('newPassword');

  const onSubmit = async ({ currentPassword, newPassword }) => {
    setLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      addToast('Password changed successfully', 'success');
      reset();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Current password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">
          Current Password
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <Lock size={16} />
          </span>
          <input
            id="currentPassword"
            type={showCurrent ? 'text' : 'password'}
            placeholder="••••••••"
            className={`w-full rounded-lg border bg-white pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.currentPassword ? 'border-rose-400' : 'border-slate-300'
            }`}
            {...register('currentPassword', { required: 'Current password is required' })}
          />
          <button type="button" onClick={() => setShowCurrent(s => !s)} className="absolute inset-y-0 right-3 flex items-center text-slate-400">
            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.currentPassword && <p className="text-xs text-rose-600">{errors.currentPassword.message}</p>}
      </div>

      {/* New password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
          New Password
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <Lock size={16} />
          </span>
          <input
            id="newPassword"
            type={showNew ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            className={`w-full rounded-lg border bg-white pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.newPassword ? 'border-rose-400' : 'border-slate-300'
            }`}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Must be at least 8 characters' },
            })}
          />
          <button type="button" onClick={() => setShowNew(s => !s)} className="absolute inset-y-0 right-3 flex items-center text-slate-400">
            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.newPassword && <p className="text-xs text-rose-600">{errors.newPassword.message}</p>}
      </div>

      {/* Confirm password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="confirmNewPassword" className="text-sm font-medium text-slate-700">
          Confirm New Password
        </label>
        <input
          id="confirmNewPassword"
          type={showNew ? 'text' : 'password'}
          placeholder="Repeat new password"
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.confirmNewPassword ? 'border-rose-400' : 'border-slate-300'
          }`}
          {...register('confirmNewPassword', {
            required: 'Please confirm your new password',
            validate: v => v === newPwd || 'Passwords do not match',
          })}
        />
        {errors.confirmNewPassword && <p className="text-xs text-rose-600">{errors.confirmNewPassword.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={loading} disabled={loading}>
          Change Password
        </Button>
      </div>
    </form>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────
export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Profile" subtitle="Manage your account information" />

      {/* Avatar + info banner */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {getInitials(user?.name)}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{user?.name}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      {/* Edit profile */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <User size={16} className="text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700 tracking-tight">Personal Information</h3>
        </div>
        <ProfileForm user={user} />
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck size={16} className="text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700 tracking-tight">Change Password</h3>
        </div>
        <PasswordForm />
      </div>
    </div>
  );
}
