import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Orders', to: '/orders' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Contact', to: '/#contact' }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  async function handleLogout() {
    setLogoutError('');
    try {
      await logout();
      navigate('/', { replace: true });
    } catch {
      setLogoutError('Could not revoke your server session. Please try signing out again.');
    } finally {
      setIsOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#F0D5C8] bg-[#FFF3E7]/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#963F2B] text-xl shadow-md shadow-[#963F2B]/20">
            🐾
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-[#4A2922]">BellBite</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C96C4B]">Campus</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="text-sm font-semibold text-[#4A2922] transition-colors hover:text-[#963F2B]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/profile" className="rounded-full border border-[#D99579] px-4 py-2 text-sm font-semibold text-[#4A2922] transition-colors hover:bg-[#FDE7DE]">My profile</Link>
              <button type="button" onClick={() => void handleLogout()} className="rounded-full border border-[#D99579] px-4 py-2 text-sm font-semibold text-[#4A2922] transition-colors hover:bg-[#FDE7DE]">Log out</button>
            </>
          ) : (
            <Link to="/login" className="rounded-full border border-[#D99579] px-4 py-2 text-sm font-semibold text-[#4A2922] transition-colors hover:bg-[#FDE7DE]">Log in</Link>
          )}
          <Link to="/menu" className="flex items-center gap-2 rounded-full bg-[#963F2B] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#963F2B]/20 transition-transform hover:scale-[1.02]">
            <ShoppingBag size={16} />
            View Menu
          </Link>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E8C9B4] bg-white text-[#4A2922] md:hidden"
          onClick={() => setIsOpen((state) => !state)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-[#F0D5C8] bg-[#FFF3E7] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to} className="text-base font-semibold text-[#4A2922]" onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex-1 rounded-full border border-[#D99579] px-4 py-2.5 text-center font-semibold text-[#4A2922]">
                    My profile
                  </Link>
                  <button type="button" onClick={() => void handleLogout()} className="flex-1 rounded-full border border-[#D99579] px-4 py-2.5 font-semibold text-[#4A2922]">
                    Log out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 rounded-full border border-[#D99579] px-4 py-2.5 text-center font-semibold text-[#4A2922]">
                  Log in
                </Link>
              )}
              <Link to="/menu" className="flex-1 rounded-full bg-[#963F2B] px-4 py-2.5 text-center font-semibold text-white">
                View Menu
              </Link>
            </div>
          </div>
        </div>
      ) : null}
      {logoutError ? <p role="alert" className="bg-red-50 px-4 py-2 text-center text-sm text-red-800">{logoutError}</p> : null}
    </header>
  );
}
