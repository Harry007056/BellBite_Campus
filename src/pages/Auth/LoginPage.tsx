import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login({ email, password });
      const requestedPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(requestedPath ?? (user.role === 'canteen_admin' ? '/admin' : '/orders'), { replace: true });
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF3E7] px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#F0D5C8] bg-white shadow-[0_28px_70px_rgba(74,41,34,0.08)] lg:grid-cols-2">
        <div className="hidden bg-[#4A2922] p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#963F2B] text-2xl">🐾</div>
              <div>
                <p className="font-display text-2xl font-semibold">BellBite</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[#F5C2A8]">Campus</p>
              </div>
            </div>

            <h1 className="font-display text-4xl font-semibold leading-tight">Welcome back to campus dining.</h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-[#F0D7CE]">
              Log in to browse the menu, track orders and skip the queue without missing a lecture.
            </p>
          </div>

          <div className="rounded-[28px] bg-white/8 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[#F5C2A8]">Your campus, at your pace</p>
            <p className="mt-3 text-sm leading-6 text-[#F9EAE5]">
              Sign in to manage your details and get back to the good part: fresh food between classes.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#963F2B]">Login</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-[#4A2922]">Access your account</h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#4A2922]">Email address</span>
              <div className="flex items-center gap-3 rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3">
                <Mail size={18} className="text-[#963F2B]" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border-0 bg-transparent text-base text-[#4A2922] outline-none placeholder:text-[#8A655E]"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#4A2922]">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3">
                <LockKeyhole size={18} className="text-[#963F2B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border-0 bg-transparent text-base text-[#4A2922] outline-none placeholder:text-[#8A655E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-[#963F2B]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex justify-end text-sm text-[#6A4942]">
              <Link to="/forgot-password" className="font-semibold text-[#963F2B] hover:underline">
                Forgot password?
              </Link>
            </div>

            {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#963F2B] px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#963F2B]/20 transition hover:bg-[#7F3424] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Login to BellBite'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#674946]">
            New to BellBite? <Link to="/register" className="font-semibold text-[#963F2B] hover:underline">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
