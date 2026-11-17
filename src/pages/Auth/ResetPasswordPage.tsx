import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient, getApiErrorMessage } from '../../services/api';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const { data } = await apiClient.post<{ message: string }>('/auth/reset-password', {
        token,
        new_password: password
      });
      setMessage(data.message);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF3E7] px-4 py-8">
      <div className="w-full max-w-lg rounded-[32px] border border-[#F0D5C8] bg-white p-6 shadow-[0_28px_70px_rgba(74,41,34,0.08)] sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#963F2B]">Account recovery</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-[#4A2922]">Set a new password</h1>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#4A2922]">Reset token</span>
            <input required minLength={32} value={token} onChange={(event) => setToken(event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#4A2922]">New password (at least 12 characters)</span>
            <input required type="password" autoComplete="new-password" minLength={12} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
          </label>
          {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
          {message ? <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-900">{message} <Link to="/login" className="font-semibold underline">Log in</Link></p> : null}
          <button disabled={isSubmitting} className="w-full rounded-full bg-[#963F2B] px-5 py-3.5 font-semibold text-white transition hover:bg-[#7F3424] disabled:opacity-60">
            {isSubmitting ? 'Updating…' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}
