import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, {
  month: 'short', day: 'numeric', year: 'numeric',
}) : 'Date to be announced';

export default function StudentDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/student/dashboard')
      .then(({ data }) => setDashboard(data))
      .catch((err) => setError(err.message || 'Unable to load your dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Joined clubs', value: dashboard?.joinedClubs ?? '—', note: 'Your communities' },
    { label: 'Upcoming events', value: dashboard?.upcomingEvents?.length ?? '—', note: 'Across your campus' },
    { label: 'Event registrations', value: dashboard?.registeredEvents ?? '—', note: 'Events you signed up for' },
    { label: 'Announcements', value: dashboard?.announcements?.length ?? '—', note: 'From your clubs' },
  ];

  return (
    <Layout title="Dashboard">
      <section className="student-welcome">
        <p className="student-kicker">YOUR CAMPUS, YOUR COMMUNITY</p>
        <h2>Welcome back{dashboard?.welcome ? `, ${dashboard.welcome.replace(/^Welcome,\s*/, '')}` : ''}</h2>
        <p>Keep up with your clubs, events, and the people around you.</p>
      </section>

      {error && <p className="student-feedback-message" role="alert">{error}</p>}
      <section className="student-stats" aria-label="Your activity summary">
        {stats.map((stat) => (
          <article className="student-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{loading ? '…' : stat.value}</strong>
            <small>{stat.note}</small>
          </article>
        ))}
      </section>

      <div className="student-dashboard-columns">
        <section className="student-panel">
          <div className="student-section-heading">
            <div><p className="student-kicker">ON THE CALENDAR</p><h2>Upcoming events</h2></div>
            <Link className="student-text-link" to="/student/events">All events <span aria-hidden="true">→</span></Link>
          </div>
          {loading && <p className="student-muted">Loading events…</p>}
          {!loading && !error && !dashboard?.upcomingEvents?.length && (
            <p className="student-empty">No upcoming events to show yet.</p>
          )}
          <div className="student-compact-list">
            {(dashboard?.upcomingEvents || []).slice(0, 4).map((event) => (
              <article className="student-compact-item" key={event.id}>
                <div className="student-date-tile"><strong>{new Date(event.date).toLocaleDateString(undefined, { day: '2-digit' })}</strong><span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span></div>
                <div className="student-item-copy"><h3>{event.title}</h3><p>{event.club?.name || 'Campus event'} · {event.time || 'Time to be announced'}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="student-panel">
          <div className="student-section-heading">
            <div><p className="student-kicker">LATEST UPDATES</p><h2>Announcements</h2></div>
            <Link className="student-text-link" to="/student/announcements">View all <span aria-hidden="true">→</span></Link>
          </div>
          {loading && <p className="student-muted">Loading announcements…</p>}
          {!loading && !error && !dashboard?.announcements?.length && (
            <p className="student-empty">Announcements from your clubs will appear here.</p>
          )}
          <div className="student-compact-list">
            {(dashboard?.announcements || []).slice(0, 3).map((item) => (
              <article className="student-announcement-preview" key={item.id}>
                <div className="student-announcement-meta"><span>{item.club?.name || 'Club update'}</span><time>{formatDate(item.createdAt)}</time></div>
                <h3>{item.title}</h3>
                <p>{item.message}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="student-quick-links" aria-label="Quick links">
        <Link to="/student/clubs"><span>Explore clubs</span><span aria-hidden="true">↗</span></Link>
        <Link to="/student/memberships"><span>Membership requests</span><span aria-hidden="true">↗</span></Link>
        <Link to="/student/attendance"><span>Check attendance</span><span aria-hidden="true">↗</span></Link>
      </section>
    </Layout>
  );
}
