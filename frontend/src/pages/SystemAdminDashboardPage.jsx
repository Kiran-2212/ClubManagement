import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function SystemAdminDashboardPage() {
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setDashboard(data)).catch(() => {});
  }, []);

  return (
    <Layout title="System Admin Dashboard">
      <section className="system-admin-stat-grid" aria-label="Campus summary">
        <article className="system-admin-stat-card"><span>Total users</span><strong>{dashboard.totalUsers ?? 0}</strong><small>All campus accounts</small></article>
        <article className="system-admin-stat-card"><span>Students</span><strong>{dashboard.totalStudents ?? 0}</strong><small>Registered students</small></article>
        <article className="system-admin-stat-card"><span>Club admins</span><strong>{dashboard.totalClubAdmins ?? 0}</strong><small>Club management accounts</small></article>
        <article className="system-admin-stat-card"><span>Clubs</span><strong>{dashboard.totalClubs ?? 0}</strong><small>Campus communities</small></article>
        <article className="system-admin-stat-card"><span>Events</span><strong>{dashboard.totalEvents ?? 0}</strong><small>Created across clubs</small></article>
        <article className="system-admin-stat-card"><span>Registrations</span><strong>{dashboard.totalRegistrations ?? 0}</strong><small>Student event sign-ups</small></article>
      </section>
    </Layout>
  );
}
