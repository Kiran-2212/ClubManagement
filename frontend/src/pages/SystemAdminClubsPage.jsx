import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function SystemAdminClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [clubAdmins, setClubAdmins] = useState([]);
  const [adminMode, setAdminMode] = useState('existing');
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
    newAdminName: '',
    newAdminEmail: '',
    newAdminPassword: '',
  });

  const loadData = async () => {
    try {
      const [clubResponse, userResponse] = await Promise.all([
        api.get('/admin/clubs'),
        api.get('/admin/users'),
      ]);
      setClubs(clubResponse.data);
      const availableClubAdmins = userResponse.data.filter((user) => user.role === 'CLUB_ADMIN');
      setClubAdmins(availableClubAdmins);
      if (availableClubAdmins.length === 0) setAdminMode('new');
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load clubs');
    }
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setAdminMode(clubAdmins.length === 0 ? 'new' : 'existing');
    setForm({
      name: '', description: '', category: '', facultyCoordinator: '', logo: '', clubAdminId: '',
      newAdminName: '', newAdminEmail: '', newAdminPassword: '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if ((editingId || adminMode === 'existing') && !form.clubAdminId) {
      setError('Select a club admin for this club.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      facultyCoordinator: form.facultyCoordinator,
      logo: form.logo,
    };
    try {
      if (editingId) {
        await api.put(`/admin/clubs/${editingId}`, { ...payload, clubAdminId: Number(form.clubAdminId) });
        setNotice('Club updated.');
      } else {
        const createdAdminEmail = form.newAdminEmail.trim();
        const createPayload = adminMode === 'new'
          ? {
              ...payload,
              newClubAdmin: {
                name: form.newAdminName,
                email: createdAdminEmail,
                password: form.newAdminPassword,
              },
            }
          : { ...payload, clubAdminId: Number(form.clubAdminId) };
        await api.post('/admin/clubs', createPayload);
        const assignedAdminEmail = adminMode === 'new'
          ? createdAdminEmail
          : clubAdmins.find((user) => String(user.id) === String(form.clubAdminId))?.email;
        setNotice(assignedAdminEmail
          ? `Club created and assigned to ${assignedAdminEmail}.${adminMode === 'new' ? ' The admin can sign in using the password you set.' : ''}`
          : 'Club created.');
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
      newAdminName: '',
      newAdminEmail: '',
      newAdminPassword: '',
    });
    setAdminMode('existing');
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
        {!editingId && (
          <fieldset className="club-admin-mode">
            <legend>Club admin account</legend>
            <label className="club-admin-mode-option">
              <input
                type="radio"
                name="clubAdminMode"
                value="existing"
                checked={adminMode === 'existing'}
                disabled={clubAdmins.length === 0}
                onChange={() => setAdminMode('existing')}
              />
              Use an existing club admin
            </label>
            <label className="club-admin-mode-option">
              <input
                type="radio"
                name="clubAdminMode"
                value="new"
                checked={adminMode === 'new'}
                onChange={() => setAdminMode('new')}
              />
              Create a new club admin login
            </label>
          </fieldset>
        )}
        {(editingId || adminMode === 'existing') ? (
          <label>Club Admin
            <select required value={form.clubAdminId} onChange={(e) => setForm({ ...form, clubAdminId: e.target.value })}>
              <option value="">Select a club admin</option>
              {clubAdmins.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}
            </select>
          </label>
        ) : (
          <div className="new-club-admin-fields">
            <p>The new account will be assigned to this club and can sign in with the email and password entered here.</p>
            <label>Admin name
              <input required autoComplete="name" value={form.newAdminName} onChange={(e) => setForm({ ...form, newAdminName: e.target.value })} />
            </label>
            <label>Login email
              <input required type="email" autoComplete="email" value={form.newAdminEmail} onChange={(e) => setForm({ ...form, newAdminEmail: e.target.value })} />
            </label>
            <label>Temporary password
              <input required type="password" autoComplete="new-password" minLength={8} maxLength={72} value={form.newAdminPassword} onChange={(e) => setForm({ ...form, newAdminPassword: e.target.value })} />
            </label>
            <small>The password must be at least 8 characters and is stored securely as a hash.</small>
          </div>
        )}
        <div className="row">
          <button className="primary" type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Club'}</button>
          {editingId && <button className="secondary" type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>
      <div className="list">
        {clubs.map((club) => (
          <div className="list-item" key={club.id}>
            <div className="row"><strong>{club.name}</strong><span className="badge">{club.category}</span></div>
            <p>{club.description}</p>
            <p>Managed by: {club.clubAdmin?.name || 'Unassigned'}{club.clubAdmin?.email ? ` (${club.clubAdmin.email})` : ''}</p>
            <button className="secondary" type="button" onClick={() => editClub(club)}>Edit</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
