import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

const UserLoginPage: React.FC = () => {
  const { user, login, loginWithEmail, signupWithEmail, adminLogin } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const next = searchParams.get('next') || '/orders';

  useEffect(() => {
    if (user) {
      navigate(next, { replace: true });
    }
  }, [user, navigate, next]);

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      await login();
      navigate(next, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Google login সম্পন্ন হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setError('ইমেইল এবং পাসওয়ার্ড দিন।');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const isAdmin = await adminLogin(email, password);
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
        return;
      }

      if (isSignupMode) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate(next, { replace: true });
    } catch (err) {
      console.error(err);
      setError(isSignupMode ? 'Signup করা যায়নি।' : 'Login করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-5">
          <h1 className="text-3xl font-bold text-slate-900">User Login / Signup</h1>
          <p className="text-sm text-slate-600">
            ইমেইল-পাসওয়ার্ড বা Google দিয়ে login/signup করুন। login হলে আপনার অর্ডার dashboard দেখাবে।
          </p>

          <div className="grid gap-3">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="আপনার ইমেইল"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="পাসওয়ার্ড"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={handleEmailAuth}
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? 'অপেক্ষা করুন...' : isSignupMode ? 'Signup' : 'Login'}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              Sign in with Google
            </button>
            <button
              type="button"
              onClick={() => setIsSignupMode((prev) => !prev)}
              className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              {isSignupMode ? 'Already have account? Login' : "Don't have account? Signup"}
            </button>
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UserLoginPage;
