import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, {
  month: 'long', day: 'numeric', year: 'numeric',
}) : 'Recently posted';

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/student/announcements')
      .then(({ data }) => setAnnouncements(data))
      .catch((err) => setError(err.message || 'Unable to load announcements'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Announcements">
      <section className="student-page-intro">
        <div><p className="student-kicker">NOTES FROM YOUR CLUBS</p><h2>Announcements</h2></div>
        <p>Updates and messages from the communities you’re part of.</p>
      </section>

      <div className="student-list-toolbar">
        <span>{loading ? 'Loading updates…' : `${announcements.length} ${announcements.length === 1 ? 'update' : 'updates'}`}</span>
        <span className="student-muted">Most recent first</span>
      </div>
      {error && <p className="student-feedback-message" role="alert">{error}</p>}
      {loading && <p className="student-muted">Fetching club announcements…</p>}
      {!loading && !error && announcements.length === 0 && (
        <div className="student-empty student-empty-panel"><strong>No announcements yet</strong><span>Updates from clubs you’ve joined will show here.</span></div>
      )}

      <div className="student-announcement-list">
        {announcements.map((item) => (
          <article className="student-announcement-card" key={item.id}>
            <div className="student-announcement-rail" aria-hidden="true" />
            <div className="student-announcement-body">
              <div className="student-announcement-meta"><span className="student-tag">{item.club?.name || 'Club update'}</span><time>{formatDate(item.createdAt)}</time></div>
              <h3>{item.title}</h3>
              <p>{item.message}</p>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
}
