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
      <div className="card-grid">
        <div className="card"><h3>Total Users</h3><div className="metric">{stats.totalUsers ?? 0}</div></div>
        <div className="card"><h3>Students</h3><div className="metric">{stats.totalStudents ?? 0}</div></div>
        <div className="card"><h3>Club Admins</h3><div className="metric">{stats.totalClubAdmins ?? 0}</div></div>
        <div className="card"><h3>Clubs</h3><div className="metric">{stats.totalClubs ?? 0}</div></div>
        <div className="card"><h3>Events</h3><div className="metric">{stats.totalEvents ?? 0}</div></div>
        <div className="card"><h3>Memberships</h3><div className="metric">{stats.totalMemberships ?? 0}</div></div>
      </div>
    </Layout>
  );
}
