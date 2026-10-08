import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function SystemAdminClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [clubAdmins, setClubAdmins] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    facultyCoordinator: '',
    logo: '',
    clubAdminId: '',
  });

  const loadData = async () => {
    try {
      const [clubResponse, userResponse] = await Promise.all([
        api.get('/admin/clubs'),
        api.get('/admin/users'),
      ]);
      setClubs(clubResponse.data);
      setClubAdmins(userResponse.data.filter((user) => user.role === 'CLUB_ADMIN'));
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load clubs');
    }
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', description: '', category: '', facultyCoordinator: '', logo: '', clubAdminId: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.clubAdminId) {
      setError('Select a club admin for this club.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    const payload = { ...form, clubAdminId: Number(form.clubAdminId) };
    try {
      if (editingId) {
        await api.put(`/admin/clubs/${editingId}`, payload);
        setNotice('Club updated.');
      } else {
        await api.post('/admin/clubs', payload);
        setNotice('Club created.');
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to save club');
    } finally {
      setSaving(false);
    }
  };

  const editClub = (club) => {
    setEditingId(club.id);
    setForm({
      name: club.name || '',
      description: club.description || '',
      category: club.category || '',
      facultyCoordinator: club.facultyCoordinator || '',
      logo: club.logo || '',
      clubAdminId: String(club.clubAdmin?.id || ''),
    });
    setError('');
    setNotice('');
  };

  return (
    <Layout title="Clubs">
      {error && <p className="error-box" role="alert">{error}</p>}
      {notice && <p className="success-box" role="status">{notice}</p>}
      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit Club' : 'Create Club'}</h2>
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
        <label>Faculty Coordinator<input value={form.facultyCoordinator} onChange={(e) => setForm({ ...form, facultyCoordinator: e.target.value })} /></label>
        <label>Club Admin
          <select required value={form.clubAdminId} onChange={(e) => setForm({ ...form, clubAdminId: e.target.value })} disabled={clubAdmins.length === 0}>
            <option value="">Select a club admin</option>
            {clubAdmins.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}
          </select>
        </label>
        {clubAdmins.length === 0 && <p>Create or promote a club-admin account before creating a club.</p>}
        <div className="row">
          <button className="primary" type="submit" disabled={saving || clubAdmins.length === 0}>{saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Club'}</button>
          {editingId && <button className="secondary" type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>
      <div className="list">
        {clubs.map((club) => (
          <div className="list-item" key={club.id}>
            <div className="row"><strong>{club.name}</strong><span className="badge">{club.category}</span></div>
            <p>{club.description}</p>
            <p>Managed by: {club.clubAdmin?.name || 'Unassigned'}</p>
            <button className="secondary" type="button" onClick={() => editClub(club)}>Edit</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
