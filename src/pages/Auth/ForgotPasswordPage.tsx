import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, getApiErrorMessage } from '../../services/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const { data } = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
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
        <h1 className="mt-3 font-display text-3xl font-semibold text-[#4A2922]">Forgot your password?</h1>
        <p className="mt-3 text-sm leading-6 text-[#674946]">Enter your registered email. If it matches an account, we’ll send a secure reset link.</p>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#4A2922]">Email address</span>
            <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
          </label>
          {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
          {message ? <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-900">{message}</p> : null}
          <button disabled={isSubmitting} className="w-full rounded-full bg-[#963F2B] px-5 py-3.5 font-semibold text-white transition hover:bg-[#7F3424] disabled:opacity-60">
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm"><Link to="/login" className="font-semibold text-[#963F2B] hover:underline">Back to login</Link></p>
      </div>
    </div>
  );
}
