import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { label: 'Dashboard', to: '/admin', end: true },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Reviews', to: '/admin/reviews' },
  { label: 'Ebooks', to: '/admin/ebooks' },
  { label: 'Services', to: '/admin/services' },
];

const AdminLayout: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-slate-950 text-white flex flex-col justify-between px-6 py-8 shadow-2xl">
          <div>
            <div className="text-2xl font-bold tracking-tight">Nutritionist</div>
            <div className="text-sm text-emerald-400">Pro Dashboard</div>
            <div className="mt-6 space-y-1 text-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-2xl transition ${
                      isActive ? 'bg-emerald-500 bg-opacity-20 text-white' : 'text-slate-300 hover:bg-white/10'
                    }`
                  }
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-2xl bg-white/10 p-4 text-xs">
              <p>Unlock pro features</p>
              <p className="text-emerald-300">Unlimited orders + analytics</p>
            </div>
            <button className="w-full rounded-2xl bg-emerald-500 px-3 py-2 text-sm font-semibold">
              Upgrade plan
            </button>
          </div>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between bg-white shadow border-b border-slate-200 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Nutritionistprobal</p>
              <p className="text-xl font-semibold text-slate-900">Admin Control Center</p>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <> 
                  <span className="text-sm text-slate-600">{user.email}</span>
                  <button
                    onClick={logout}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={login}
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest"
                >
                  Login
                </button>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
