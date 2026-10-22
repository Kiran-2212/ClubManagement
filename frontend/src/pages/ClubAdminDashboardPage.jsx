import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubAdminDashboardPage() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/club-admin/dashboard')
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Members', value: data.memberCount ?? 0, note: 'Approved club members' },
    { label: 'Pending requests', value: data.pendingRequests ?? 0, note: 'Memberships to review' },
    { label: 'Upcoming events', value: data.upcomingEvents?.length ?? 0, note: 'Events on the calendar' },
    { label: 'Clubs managed', value: data.clubs?.length ?? 0, note: 'Clubs assigned to you' },
  ];

  return (
    <Layout title="Club Admin Dashboard">
      <section className="club-admin-welcome">
        <p className="club-admin-kicker">CLUB MANAGEMENT</p>
        <h2>Your club at a glance</h2>
        <p>Review membership activity and keep upcoming events moving.</p>
      </section>
      <section className="club-admin-stat-grid" aria-label="Club summary">
        {stats.map((stat) => (
          <article className="club-admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{loading ? '…' : stat.value}</strong>
            <small>{stat.note}</small>
          </article>
        ))}
      </section>
    </Layout>
  );
}
