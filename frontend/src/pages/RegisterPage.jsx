import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    year: 2025,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.post('/auth/register', form);
      setSuccess('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-box">
      <h2>Student Registration</h2>
      {error && <div className="error-box" role="alert">{error}</div>}
      {success && <div className="success-box" role="status">{success}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required />
          <small>Password must be at least 6 characters.</small>
        </label>
        <label>
          Department
          <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
        </label>
        <label>
          Year
          <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} required />
        </label>
        <button className="primary" type="submit" disabled={submitting}>{submitting ? 'Registering…' : 'Register'}</button>
      </form>
      <p style={{ marginTop: 18 }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
