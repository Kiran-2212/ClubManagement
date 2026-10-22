import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, {
  month: 'short', day: 'numeric', year: 'numeric',
}) : '—';

export default function StudentMembershipsPage() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/student/memberships')
      .then(({ data }) => setMemberships(data))
      .catch((err) => setError(err.message || 'Unable to load memberships'))
      .finally(() => setLoading(false));
  }, []);

  const approved = memberships.filter((item) => item.status === 'APPROVED').length;
  const pending = memberships.filter((item) => item.status === 'PENDING').length;

  return (
    <Layout title="Memberships">
      <section className="student-page-intro">
        <div><p className="student-kicker">YOUR COMMUNITIES</p><h2>Memberships</h2></div>
        <p>Track the clubs you’ve joined and the requests you’ve sent.</p>
      </section>

      <section className="student-stats student-membership-stats" aria-label="Membership summary">
        <article className="student-stat-card"><span>Total requests</span><strong>{loading ? '…' : memberships.length}</strong><small>Membership activity</small></article>
        <article className="student-stat-card"><span>Active memberships</span><strong>{loading ? '…' : approved}</strong><small>Approved by club admins</small></article>
        <article className="student-stat-card"><span>Awaiting review</span><strong>{loading ? '…' : pending}</strong><small>Requests still in progress</small></article>
      </section>

      {error && <p className="student-feedback-message" role="alert">{error}</p>}
      {loading && <p className="student-muted">Loading your memberships…</p>}
      {!loading && !error && memberships.length === 0 && (
        <div className="student-empty student-empty-panel"><strong>You haven’t joined a club yet</strong><span>Explore campus clubs and send your first membership request.</span><Link className="student-button" to="/student/clubs">Explore clubs</Link></div>
      )}

      <div className="student-membership-list">
        {memberships.map((item) => (
          <article className="student-membership-card" key={item.id}>
            <div className="student-membership-main">
              <span className="student-monogram" aria-hidden="true">{item.club?.name?.trim().charAt(0)?.toUpperCase() || 'C'}</span>
              <div><h3>{item.club?.name || 'Club'}</h3><p>{item.club?.category || 'Campus community'}</p></div>
            </div>
            <div className="student-membership-detail"><span className="student-detail-label">Status</span><span className={`student-status status-${(item.status || 'pending').toLowerCase()}`}>{item.status || 'PENDING'}</span></div>
            <div className="student-membership-detail"><span className="student-detail-label">{item.status === 'APPROVED' ? 'Joined' : 'Requested'}</span><time>{formatDate(item.joinedAt || item.createdAt)}</time></div>
          </article>
        ))}
      </div>
    </Layout>
  );
}
