import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'STUDENT', label: 'Student', short: 'S' },
    { value: 'CLUB_ADMIN', label: 'Club admin', short: 'C' },
    { value: 'SYSTEM_ADMIN', label: 'System admin', short: 'A' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.user.role !== selectedRole) {
        const accountRole = roles.find((role) => role.value === data.user.role)?.label || 'another role';
        setError(`This account is registered as ${accountRole}. Choose that role and try again.`);
        return;
      }
      login(data);
      if (data.user.role === 'STUDENT') navigate('/student/dashboard');
      else if (data.user.role === 'CLUB_ADMIN') navigate('/club-admin/dashboard');
      else navigate('/system-admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <main className="login-screen">
      <section className="login-card" aria-labelledby="login-heading">
        <header className="login-heading">
          <div className="login-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m3 9 9-5 9 5-9 5-9-5Z" />
              <path d="M6.5 11v5c3.3 2.7 7.7 2.7 11 0v-5M21 9v6" />
            </svg>
          </div>
          <div>
            <p className="login-eyebrow">CAMPUS COMMUNITY</p>
            <h1 id="login-heading">Welcome back</h1>
            <p className="login-intro">Sign in to pick up where your club life left off.</p>
          </div>
        </header>

        {error && <div className="error-box" role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <fieldset className="role-picker">
            <legend>Choose your role</legend>
            <div className="role-options">
              {roles.map((role) => (
                <label className={`role-option${selectedRole === role.value ? ' is-selected' : ''}`} key={role.value}>
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={() => setSelectedRole(role.value)}
                  />
                  <span className="role-avatar" aria-hidden="true">{role.short}</span>
                  <span>{role.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="login-field">
            Email address
            <input
              type="email"
              autoComplete="username"
              placeholder="you@college.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label className="login-field">
            Password
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          <button className="login-submit" type="submit">Sign in <span aria-hidden="true">→</span></button>
        </form>

        <p className="login-register">New to the community? <Link to="/register">Create a student account</Link></p>
        <p className="login-footer">College Club Management</p>
      </section>
    </main>
  );
}
