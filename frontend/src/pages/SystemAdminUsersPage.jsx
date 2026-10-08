import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function SystemAdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [savingId, setSavingId] = useState(null);

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load users');
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const updateUser = async (user) => {
    setSavingId(user.id);
    setError('');
    setNotice('');
    try {
      const { data } = await api.put(`/admin/users/${user.id}`, {
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        enabled: user.enabled,
      });
      setUsers((current) => current.map((item) => item.id === data.id ? data : item));
      setNotice(`Updated ${data.name}.`);
    } catch (err) {
      setError(err.message || 'Unable to update user');
    } finally {
      setSavingId(null);
    }
  };

  const updateField = (id, field, value) => {
    setUsers((current) => current.map((user) => user.id === id ? { ...user, [field]: value } : user));
    setNotice('');
  };

  return (
    <Layout title="Users">
      {error && <p className="error-box" role="alert">{error}</p>}
      {notice && <p className="success-box" role="status">{notice}</p>}
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Year</th><th>Account</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><input aria-label={`${user.name} name`} value={user.name} onChange={(e) => updateField(user.id, 'name', e.target.value)} /></td>
              <td><input aria-label={`${user.name} email`} type="email" value={user.email} onChange={(e) => updateField(user.id, 'email', e.target.value)} /></td>
              <td>
                <select value={user.role} onChange={(e) => updateField(user.id, 'role', e.target.value)}>
                  <option value="STUDENT">Student</option>
                  <option value="CLUB_ADMIN">Club Admin</option>
                  <option value="SYSTEM_ADMIN">System Admin</option>
                </select>
              </td>
              <td><input aria-label={`${user.name} department`} value={user.department || ''} onChange={(e) => updateField(user.id, 'department', e.target.value)} /></td>
              <td><input aria-label={`${user.name} year`} type="number" value={user.year ?? ''} onChange={(e) => updateField(user.id, 'year', e.target.value === '' ? null : Number(e.target.value))} /></td>
              <td>
                <select value={String(user.enabled)} onChange={(e) => updateField(user.id, 'enabled', e.target.value === 'true')}>
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </td>
              <td><button className="primary" type="button" disabled={savingId === user.id} onClick={() => updateUser(user)}>
                {savingId === user.id ? 'Saving…' : 'Save'}
              </button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && !error && <p>No users found.</p>}
    </Layout>
  );
}
