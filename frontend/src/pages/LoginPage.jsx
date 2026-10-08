import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: 'student@college.com', password: 'Student@123' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      if (data.user.role === 'STUDENT') navigate('/student/dashboard');
      else if (data.user.role === 'CLUB_ADMIN') navigate('/club-admin/dashboard');
      else navigate('/system-admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>
      <p style={{ margin: '10px 0 22px' }}>Welcome back to the campus club system.</p>
      {error && <div className="error-box">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="primary" type="submit">Login</button>
      </form>
      <p style={{ marginTop: 18 }}>Need an account? <Link to="/register">Register as Student</Link></p>
      <p style={{ marginTop: 10 }}>Demo accounts: student@college.com / Student@123</p>
    </div>
  );
}
