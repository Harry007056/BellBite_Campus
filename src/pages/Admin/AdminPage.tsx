import { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { apiClient, getApiErrorMessage } from '../../services/api';
import type { User } from '../../store/authStore';

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiClient.get<User[]>('/admin/users')
      .then(({ data }) => {
        if (active) setUsers(data);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#4A2922]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#963F2B]">Canteen admin</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Account directory</h1>
        <section className="mt-8 overflow-hidden rounded-[28px] border border-[#F0D5C8] bg-white shadow-sm">
          {isLoading ? <p className="p-6">Loading accounts…</p> : null}
          {error ? <p role="alert" className="p-6 text-red-800">{error}</p> : null}
          {!isLoading && !error ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-[#FFF7F5] text-[#674946]">
                  <tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">College ID</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Status</th></tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-[#F2D8CC]">
                      <td className="px-5 py-4 font-semibold">{user.full_name}</td>
                      <td className="px-5 py-4">{user.email}</td>
                      <td className="px-5 py-4">{user.college_id}</td>
                      <td className="px-5 py-4">{user.role.replace('_', ' ')}</td>
                      <td className="px-5 py-4">{user.is_active && user.is_approved ? 'Active' : 'Restricted'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
