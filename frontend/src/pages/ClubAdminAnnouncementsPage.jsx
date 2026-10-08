import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubAdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', message: '' });

  const loadData = async () => {
    try {
      const [clubResponse, announcementResponse] = await Promise.all([
        api.get('/club-admin/clubs'),
        api.get('/club-admin/announcements'),
      ]);
      setClubs(clubResponse.data);
      setAnnouncements(announcementResponse.data);
      setClubId((current) => current || String(clubResponse.data[0]?.id || ''));
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load announcements');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clubId) {
      setError('You need an assigned club before publishing announcements.');
      return;
    }
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      if (editingId) {
        await api.put(`/club-admin/announcements/${editingId}`, form);
        setNotice('Announcement updated.');
      } else {
        await api.post('/club-admin/announcements', form, { params: { clubId } });
        setNotice('Announcement published.');
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: '', message: '' });
  };

  const startEditing = (announcement) => {
    setEditingId(announcement.id);
    setClubId(String(announcement.club?.id || ''));
    setForm({ title: announcement.title || '', message: announcement.message || '' });
    setError('');
    setNotice('');
  };

  const deleteAnnouncement = async (announcement) => {
    if (!window.confirm(`Delete "${announcement.title}"?`)) return;
    setError('');
    setNotice('');
    try {
      await api.delete(`/club-admin/announcements/${announcement.id}`);
      setAnnouncements((current) => current.filter((item) => item.id !== announcement.id));
      if (editingId === announcement.id) resetForm();
      setNotice('Announcement deleted.');
    } catch (err) {
      setError(err.message || 'Unable to delete announcement');
    }
  };

  return (
    <Layout title="Announcements">
      {error && <p className="error-box" role="alert">{error}</p>}
      {notice && <p className="success-box" role="status">{notice}</p>}
      <form onSubmit={handleSubmit}>
        {!editingId && <label>Club
          <select value={clubId} onChange={(e) => setClubId(e.target.value)} required disabled={clubs.length === 0}>
            {clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}
          </select>
        </label>}
        <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
        <label>Message<textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></label>
        <button className="primary" type="submit" disabled={submitting || (!editingId && clubs.length === 0)}>{submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Publish'}</button>
        {editingId && <button className="secondary" type="button" onClick={resetForm}>Cancel Editing</button>}
      </form>

      <div className="list">
        {announcements.map((item) => (
          <div className="list-item" key={item.id}>
            <div className="row"><h3>{item.title}</h3><span className="badge">{item.club?.name}</span></div>
            <p>{item.message}</p>
            <div className="row">
              <button className="secondary" type="button" onClick={() => startEditing(item)}>Edit</button>
              <button className="danger" type="button" onClick={() => deleteAnnouncement(item)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
