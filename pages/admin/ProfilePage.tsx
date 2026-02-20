import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, adminAuthenticated, adminIdentity } = useAuth();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Profile</p>
        <h1 className="text-2xl font-semibold text-slate-900">প্রোফাইল</h1>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <p className="text-sm text-slate-500">রোল</p>
        <p className="text-lg font-semibold text-slate-900">{adminAuthenticated ? 'Admin' : 'User'}</p>

        {adminAuthenticated ? (
          <p className="text-sm text-slate-700">আইডেন্টিটি: {adminIdentity ?? 'Admin'}</p>
        ) : (
          <>
            <p className="text-sm text-slate-700">নাম: {user?.displayName ?? 'N/A'}</p>
            <p className="text-sm text-slate-700">ইমেইল: {user?.email ?? 'N/A'}</p>
          </>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
