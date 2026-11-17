import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { apiClient, getApiErrorMessage } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setProfileMessage('');
    setIsSaving(true);
    try {
      const { data } = await apiClient.put('/users/me', {
        full_name: fullName,
        phone_number: phoneNumber
      });
      useAuthStore.setState({ user: data });
      setProfileMessage('Your profile has been updated.');
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setPasswordMessage('');
    setIsSaving(true);
    try {
      const { data } = await apiClient.patch<{ message: string }>('/users/me/password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      setPasswordMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
      await logout();
      navigate('/login', { replace: true });
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#4A2922]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#963F2B]">Your account</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Profile settings</h1>
        {error ? <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

        <section className="mt-8 rounded-[28px] border border-[#F0D5C8] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Personal details</h2>
          <form className="mt-5 space-y-5" onSubmit={updateProfile}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Full name</span>
              <input required minLength={2} maxLength={120} value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Phone number</span>
              <input required type="tel" minLength={7} maxLength={32} value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><p className="text-sm font-medium">Registered email</p><p className="mt-1 break-all text-sm text-[#674946]">{user?.email}</p></div>
              <div><p className="text-sm font-medium">College ID</p><p className="mt-1 text-sm text-[#674946]">{user?.college_id}</p></div>
            </div>
            {profileMessage ? <p role="status" className="text-sm text-green-800">{profileMessage}</p> : null}
            <button disabled={isSaving} className="rounded-full bg-[#963F2B] px-5 py-3 font-semibold text-white transition hover:bg-[#7F3424] disabled:opacity-60">
              {isSaving ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-[28px] border border-[#F0D5C8] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Change password</h2>
          <p className="mt-2 text-sm leading-6 text-[#674946]">Changing your password signs out all active refresh sessions.</p>
          <form className="mt-5 space-y-5" onSubmit={changePassword}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Current password</span>
              <input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">New password (at least 12 characters)</span>
              <input required type="password" autoComplete="new-password" minLength={12} maxLength={128} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full rounded-2xl border border-[#E8CBB8] bg-[#FFF7F5] px-4 py-3 outline-none focus:border-[#963F2B]" />
            </label>
            {passwordMessage ? <p role="status" className="text-sm text-green-800">{passwordMessage}</p> : null}
            <button disabled={isSaving} className="rounded-full border border-[#D99579] px-5 py-3 font-semibold text-[#4A2922] transition hover:bg-[#FDE7DE] disabled:opacity-60">
              {isSaving ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
