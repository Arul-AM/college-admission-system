import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, User, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { login } from '../../services/api';
import { getErrorMessage } from '../../utils';

const DEMO_USERS = [
  
  { label: 'Stage 1',  icon: '🚪', un: 'staff1', pw: 'Staff@123',  color: 'from-blue-500 to-cyan-500' },
  { label: 'Stage 2',  icon: '📋', un: 'staff2', pw: 'Staff@123',  color: 'from-sky-500 to-blue-600' },
  { label: 'Stage 3',  icon: '🔍', un: 'staff3', pw: 'Staff@123',  color: 'from-indigo-400 to-blue-500' },
  { label: 'Stage 4',  icon: '📝', un: 'staff4', pw: 'Staff@123',  color: 'from-cyan-500 to-teal-500' },
  { label: 'Stage 5',  icon: '✅', un: 'staff5', pw: 'Staff@123',  color: 'from-emerald-500 to-teal-500' },
  { label: 'Help Desk',icon: '🎧', un: 'staff6', pw: 'Staff@123',  color: 'from-orange-400 to-rose-500' },
];

/* Floating dot component */
const Dot = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filled, setFilled] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login(form.username, form.password);
      setAuth(res.data.user, res.data.token);
      if (res.data.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/staff/queue');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (un: string, pw: string, label: string) => {
    setForm({ username: un, password: pw });
    setFilled(label);
    setTimeout(() => setFilled(null), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Decorative background geometry */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large soft circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-100 rounded-full opacity-60" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-100 rounded-full opacity-50" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-rose-50 rounded-full opacity-70" />

        {/* Animated floating dots */}
        {[
          { w: 10, h: 10, bg: '#a78bfa', top: '15%', left: '8%', animation: 'floatA 5s ease-in-out infinite' },
          { w: 7, h: 7, bg: '#60a5fa', top: '70%', left: '5%', animation: 'floatB 7s ease-in-out infinite 1s' },
          { w: 12, h: 12, bg: '#34d399', top: '25%', right: '7%', animation: 'floatA 6s ease-in-out infinite 0.5s' },
          { w: 8, h: 8, bg: '#fb7185', top: '80%', right: '10%', animation: 'floatB 5s ease-in-out infinite 2s' },
          { w: 6, h: 6, bg: '#fbbf24', top: '50%', right: '4%', animation: 'floatA 4s ease-in-out infinite 1.5s' },
          { w: 5, h: 5, bg: '#a78bfa', top: '90%', left: '20%', animation: 'floatB 8s ease-in-out infinite 0.8s' },
        ].map((d, i) => (
          <Dot key={i} style={{ width: d.w, height: d.h, background: d.bg, top: d.top, left: d.left, right: (d as any).right, animation: d.animation }} />
        ))}

        {/* Grid dots pattern top-right */}
        <div className="absolute top-8 right-8 opacity-20"
          style={{
            width: 120, height: 120,
            backgroundImage: 'radial-gradient(circle, #6366f1 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
          }}
        />
        {/* Grid dots pattern bottom-left */}
        <div className="absolute bottom-8 left-8 opacity-15"
          style={{
            width: 100, height: 100,
            backgroundImage: 'radial-gradient(circle, #6366f1 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
          }}
        />
      </div>

      {/* CSS keyframes via style tag */}
      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(8deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(14px) rotate(-6deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.2s both; }
        .fade-up-3 { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.3s both; }
        .fade-up-4 { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.4s both; }
        .scale-in { animation: scaleIn 0.5s cubic-bezier(.22,1,.36,1) 0.05s both; }
        .slide-right { animation: slideRight 0.4s cubic-bezier(.22,1,.36,1) both; }
        .spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          display: inline-block;
          animation: spin 0.7s linear infinite;
        }
        .input-field {
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .input-field:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
          background: #fafafe;
          outline: none;
        }
        .demo-chip {
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .demo-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }
        .demo-chip:active { transform: scale(0.97); }
        .sign-btn {
          transition: transform 0.18s, box-shadow 0.18s;
          position: relative; overflow: hidden;
        }
        .sign-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        .sign-btn:hover::after { transform: translateX(100%); }
        .sign-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(99,102,241,0.4);
        }
        .sign-btn:active:not(:disabled) { transform: scale(0.98); }
        .sign-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      {/* Main card */}
      <div
        className={`w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden relative z-10 ${mounted ? 'scale-in' : 'opacity-0'}`}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" />

        <div className="p-8 pt-7">

          {/* Header */}
          <div className={`flex items-center gap-4 mb-8 ${mounted ? 'fade-up' : 'opacity-0'}`}>
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                <span className="text-xs font-semibold text-violet-600 tracking-wider uppercase">CEG College</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">Admission Portal</h1>
              <p className="text-xs text-slate-400 mt-0.5">Management System · 2026</p>
            </div>
          </div>

          {/* Heading */}
          <div className={`mb-6 ${mounted ? 'fade-up-1' : 'opacity-0'}`}>
            <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to access your dashboard</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 mb-5 text-sm slide-right">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={`space-y-4 ${mounted ? 'fade-up-2' : 'opacity-0'}`}>
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter your username"
                  autoFocus
                  autoComplete="username"
                  className="input-field w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 bg-slate-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="input-field w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium select-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="sign-btn w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className={`flex items-center gap-3 my-6 ${mounted ? 'fade-up-3' : 'opacity-0'}`}>
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">Quick access</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Demo credentials */}
          <div className={`grid grid-cols-3 gap-2 ${mounted ? 'fade-up-4' : 'opacity-0'}`}>
            {DEMO_USERS.map(c => (
              <button
                key={c.un}
                onClick={() => quickFill(c.un, c.pw, c.label)}
                className={`demo-chip relative text-left p-3 rounded-xl border-2 overflow-hidden ${
                  filled === c.label
                    ? 'border-violet-400 bg-violet-50'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                {/* gradient bar on left */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${c.color} rounded-l-xl`} />
                <div className="pl-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-base leading-none">{c.icon}</span>
                    <span className="text-xs font-bold text-slate-700">{c.label}</span>
                    {filled === c.label && (
                      <span className="ml-auto text-xs text-violet-600 font-semibold">✓ Filled</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{c.un}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-6">
            © 2026 College Admission Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
