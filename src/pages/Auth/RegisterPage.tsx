import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../../services/api';
import { useAuthStore, type UserRole } from '../../store/authStore';

const publicRoles: { value: Exclude<UserRole, 'canteen_admin'>; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'college_staff', label: 'College staff' },
  { value: 'faculty', label: 'Faculty' }
];

export function RegisterPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    college_id: '',
    phone_number: '',
    password: '',
    role: 'student' as Exclude<UserRole, 'canteen_admin'>
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await register(form);
      navigate(user.role === 'canteen_admin' ? '/admin' : '/orders', { replace: true });
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF3E7] px-4 py-8">
      <div className="w-full max-w-2xl rounded-[32px] border border-[#F0D5C8] bg-white p-6 shadow-[0_28px_70px_rgba(74,41,34,0.08)] sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#963F2B]">Join BellBite</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-[#4A2922]">Create your campus account</h1>
        <p className="mt-2 text-sm leading-6 text-[#674946]">Canteen admin accounts are created securely by an administrator.</p>

        <form className="mt-7 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-[#4A2922]">Full name</span>
            <input required minLength={2} maxLength={120} autoComplete="name" value={form.full_name} onChange={(event) => update('full_name', event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#4A2922]">College email</span>
            <input required type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#4A2922]">College ID</span>
            <input required maxLength={80} value={form.college_id} onChange={(event) => update('college_id', event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#4A2922]">Phone number</span>
            <input required type="tel" autoComplete="tel" minLength={7} maxLength={32} value={form.phone_number} onChange={(event) => update('phone_number', event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#4A2922]">I am a</span>
            <select value={form.role} onChange={(event) => update('role', event.target.value as typeof form.role)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]">
              {publicRoles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-[#4A2922]">Password (at least 12 characters)</span>
            <input required type="password" autoComplete="new-password" minLength={12} maxLength={128} value={form.password} onChange={(event) => update('password', event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
          </label>
          {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 sm:col-span-2">{error}</p> : null}
          <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#963F2B] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#963F2B]/20 transition hover:bg-[#7F3424] active:scale-[0.99] disabled:opacity-60 sm:col-span-2">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#674946]">Already registered? <Link to="/login" className="font-semibold text-[#963F2B] hover:underline">Log in</Link></p>
      </div>
    </div>
  );
}
