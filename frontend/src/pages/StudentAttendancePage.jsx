import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const formatDate = (value) => value ? new Date(value).toLocaleString(undefined, {
  month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
}) : 'Not marked';

export default function StudentAttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/student/attendance')
      .then(({ data }) => setRecords(data))
      .catch((err) => setError(err.message || 'Unable to load attendance'))
      .finally(() => setLoading(false));
  }, []);

  const present = records.filter((record) => record.status === 'PRESENT').length;
  const absent = records.filter((record) => record.status === 'ABSENT').length;
  const rate = records.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <Layout title="Attendance">
      <section className="student-page-intro">
        <div><p className="student-kicker">YOUR PARTICIPATION</p><h2>Attendance</h2></div>
        <p>A simple overview of the events you’ve attended.</p>
      </section>

      <section className="student-stats attendance-summary" aria-label="Attendance summary">
        <article className="student-stat-card"><span>Attendance rate</span><strong>{loading ? '…' : `${rate}%`}</strong><small>Based on marked events</small></article>
        <article className="student-stat-card"><span>Present</span><strong>{loading ? '…' : present}</strong><small>Events attended</small></article>
        <article className="student-stat-card"><span>Absent</span><strong>{loading ? '…' : absent}</strong><small>Events missed</small></article>
      </section>

      <section className="student-panel attendance-panel">
        <div className="student-section-heading">
          <div><p className="student-kicker">EVENT HISTORY</p><h2>Attendance records</h2></div>
          {!loading && <span className="student-muted">{records.length} {records.length === 1 ? 'record' : 'records'}</span>}
        </div>
        {error && <p className="student-feedback-message" role="alert">{error}</p>}
        {loading && <p className="student-muted">Loading your attendance…</p>}
        {!loading && !error && records.length === 0 && (
          <p className="student-empty">No attendance records yet. Records will appear here after a club admin marks an event.</p>
        )}
        <div className="student-attendance-list">
          {records.map((record) => (
            <article className="student-attendance-item" key={`${record.eventId}-${record.markedAt}`}>
              <div className="student-attendance-marker" aria-hidden="true">{record.status === 'PRESENT' ? '✓' : '—'}</div>
              <div className="student-item-copy"><h3>{record.eventTitle || 'Club event'}</h3><p>Marked {formatDate(record.markedAt)}</p></div>
              <span className={`student-status status-${(record.status || 'unknown').toLowerCase()}`}>{record.status || 'Unknown'}</span>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
