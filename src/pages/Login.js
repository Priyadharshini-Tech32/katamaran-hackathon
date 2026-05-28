import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast('Welcome back! 🎉', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      showToast(msg, 'error');
      setErrors({ server: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card auth-card-with-avatar animate-fade-up">

        {/* Floating avatar */}
        <div className="auth-page-avatar">
          <span className="auth-page-avatar-icon">✂️</span>
          <div className="auth-page-avatar-ring" />
        </div>

        <div className="auth-header auth-header-center">
          <Link to="/" className="auth-logo grad-text">◆ SNIP</Link>
          <h1>Welcome back</h1>
          <p>Sign in to manage your short links</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                className={errors.password ? 'error' : ''}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPw(s => !s)} tabIndex={-1}>
                <EyeIcon open={showPw} />
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          {errors.server && <p className="field-error" style={{ marginBottom: 12 }}>{errors.server}</p>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <><span className="spinner" />Signing in…</> : '🚀 Sign in'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create one →</Link>
        </p>
      </div>
    </div>
  );
}
