import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function SystemAdminStatisticsPage() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get('/admin/statistics').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  return (
    <Layout title="Platform Statistics">
      <section className="system-admin-stat-grid" aria-label="Platform statistics">
        <article className="system-admin-stat-card"><span>Total users</span><strong>{stats.totalUsers ?? 0}</strong><small>All campus accounts</small></article>
        <article className="system-admin-stat-card"><span>Students</span><strong>{stats.totalStudents ?? 0}</strong><small>Registered students</small></article>
        <article className="system-admin-stat-card"><span>Club admins</span><strong>{stats.totalClubAdmins ?? 0}</strong><small>Club management accounts</small></article>
        <article className="system-admin-stat-card"><span>Clubs</span><strong>{stats.totalClubs ?? 0}</strong><small>Campus communities</small></article>
        <article className="system-admin-stat-card"><span>Events</span><strong>{stats.totalEvents ?? 0}</strong><small>Created across clubs</small></article>
        <article className="system-admin-stat-card"><span>Memberships</span><strong>{stats.totalMemberships ?? 0}</strong><small>Student club requests</small></article>
      </section>
    </Layout>
  );
}
