import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubAdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [attendanceEventId, setAttendanceEventId] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '09:00', venue: '', capacity: 50, status: 'UPCOMING' });

  const loadData = async () => {
    try {
      const [clubResponse, eventResponse] = await Promise.all([
        api.get('/club-admin/clubs'),
        api.get('/club-admin/events'),
      ]);
      setClubs(clubResponse.data);
      setEvents(eventResponse.data);
      setClubId((current) => current || String(clubResponse.data[0]?.id || ''));
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load club events');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!clubId) {
      setError('You need an assigned club before creating events.');
      return;
    }
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      if (editingId) {
        await api.put(`/club-admin/events/${editingId}`, form);
        setNotice('Event updated.');
      } else {
        await api.post('/club-admin/events', form, { params: { clubId } });
        setNotice('Event created.');
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: '', description: '', date: '', time: '09:00', venue: '', capacity: 50, status: 'UPCOMING' });
  };

  const startEditing = (event) => {
    setEditingId(event.id);
    setClubId(String(event.club?.id || ''));
    setForm({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      time: (event.time || '09:00').slice(0, 5),
      venue: event.venue || '',
      capacity: event.capacity || 1,
      status: event.status || 'UPCOMING',
    });
    setError('');
    setNotice('');
  };

  const deleteEvent = async (event) => {
    if (!window.confirm(`Delete "${event.title}"?`)) return;
    setError('');
    setNotice('');
    try {
      await api.delete(`/club-admin/events/${event.id}`);
      setEvents((current) => current.filter((item) => item.id !== event.id));
      if (editingId === event.id) resetForm();
      setNotice('Event deleted.');
    } catch (err) {
      setError(err.message || 'Unable to delete event');
    }
  };

  const toggleAttendance = async (eventId) => {
    if (attendanceEventId === eventId) {
      setAttendanceEventId(null);
      return;
    }
    setError('');
    try {
      const [registrationResponse, attendanceResponse] = await Promise.all([
        api.get(`/club-admin/events/${eventId}/registrations`),
        api.get(`/club-admin/events/${eventId}/attendance`),
      ]);
      const statuses = Object.fromEntries(attendanceResponse.data.map((item) => [item.student.id, item.status]));
      setAttendanceRecords(registrationResponse.data);
      setAttendanceStatuses(statuses);
      setAttendanceEventId(eventId);
    } catch (err) {
      setError(err.message || 'Unable to load event attendance');
    }
  };

  const saveAttendance = async (eventId) => {
    setSavingAttendance(true);
    setError('');
    setNotice('');
    try {
      const requests = attendanceRecords.map((registration) => ({
        studentId: registration.student.id,
        status: attendanceStatuses[registration.student.id] || 'ABSENT',
      }));
      await api.post(`/club-admin/events/${eventId}/attendance`, requests);
      setNotice('Attendance saved.');
    } catch (err) {
      setError(err.message || 'Unable to save attendance');
    } finally {
      setSavingAttendance(false);
    }
  };

  return (
    <Layout title="Manage Events">
      {error && <p className="error-box" role="alert">{error}</p>}
      {notice && <p className="success-box" role="status">{notice}</p>}
      <form onSubmit={handleCreate}>
        <label>Club
          <select value={clubId} onChange={(e) => setClubId(e.target.value)} required disabled={clubs.length === 0}>
            {clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}
          </select>
        </label>
        <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
        <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label>Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
        <label>Time<input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required /></label>
        <label>Venue<input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required /></label>
        <label>Capacity<input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} required /></label>
        <label>Status
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
        <button className="primary" type="submit" disabled={submitting || clubs.length === 0}>{submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Create Event'}</button>
        {editingId && <button className="secondary" type="button" onClick={resetForm}>Cancel Editing</button>}
      </form>

      <div className="list">
        {events.map((event) => (
          <div className="list-item" key={event.id}>
            <div className="row"><strong>{event.title}</strong><span className="badge">{event.status}</span></div>
            <p>{event.club?.name} · {event.date} at {event.time} · {event.venue}</p>
            <div className="row">
              <button className="secondary" type="button" onClick={() => startEditing(event)}>Edit</button>
              <button className="secondary" type="button" onClick={() => toggleAttendance(event.id)}>
                {attendanceEventId === event.id ? 'Hide Attendance' : 'Attendance'}
              </button>
              <button className="danger" type="button" onClick={() => deleteEvent(event)}>Delete</button>
            </div>
            {attendanceEventId === event.id && (
              <div className="list">
                {attendanceRecords.map((registration) => (
                  <div className="row" key={registration.id}>
                    <span>{registration.student?.name || registration.student?.email}</span>
                    <select
                      aria-label={`Attendance for ${registration.student?.name || registration.student?.email}`}
                      value={attendanceStatuses[registration.student.id] || 'ABSENT'}
                      onChange={(e) => setAttendanceStatuses((current) => ({ ...current, [registration.student.id]: e.target.value }))}
                    >
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                    </select>
                  </div>
                ))}
                {attendanceRecords.length === 0
                  ? <p>No students are registered for this event.</p>
                  : <button className="primary" type="button" disabled={savingAttendance} onClick={() => saveAttendance(event.id)}>
                      {savingAttendance ? 'Saving…' : 'Save Attendance'}
                    </button>}
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
