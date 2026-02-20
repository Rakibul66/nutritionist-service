import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  MessageSquareQuote,
  Settings2,
  CircleUserRound,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type NavLinkItem = {
  label: string;
  to: string;
  end?: boolean;
  icon: React.ComponentType<{ className?: string }>;
};

const adminNavLinks: NavLinkItem[] = [
  { label: 'ড্যাশবোর্ড', to: '/admin', end: true, icon: LayoutDashboard },
  { label: 'অর্ডার', to: '/admin/orders', icon: ClipboardList },
  { label: 'ফিডব্যাক', to: '/admin/feedback', icon: MessageSquareQuote },
  { label: 'ইবুক', to: '/admin/ebooks', icon: BookOpen },
  { label: 'সার্ভিস', to: '/admin/services', icon: Settings2 },
  { label: 'প্রোফাইল', to: '/admin/profile', icon: CircleUserRound },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { adminIdentity, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-slate-950 text-white flex flex-col justify-between px-6 py-8 shadow-2xl">
          <div>
            <div className="text-2xl font-bold tracking-tight">Nutritionist</div>
            <div className="text-sm text-emerald-400">প্রো ড্যাশবোর্ড</div>
            <div className="mt-6 space-y-1 text-sm">
              {adminNavLinks.map((link) => (
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
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div />
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between bg-white shadow border-b border-slate-200 px-6 py-4">
            <div>
              <p className="text-xs tracking-[0.2em] text-slate-500">Nutritionistprobal</p>
              <p className="text-xl font-semibold text-slate-900">অ্যাডমিন কন্ট্রোল সেন্টার</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">{adminIdentity ?? 'অ্যাডমিন'}</span>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                লগআউট
              </button>
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
