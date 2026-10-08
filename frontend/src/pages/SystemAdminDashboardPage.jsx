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
      <div className="card-grid">
        <div className="card"><h3>Total Users</h3><div className="metric">{dashboard.totalUsers ?? 0}</div></div>
        <div className="card"><h3>Students</h3><div className="metric">{dashboard.totalStudents ?? 0}</div></div>
        <div className="card"><h3>Club Admins</h3><div className="metric">{dashboard.totalClubAdmins ?? 0}</div></div>
        <div className="card"><h3>Clubs</h3><div className="metric">{dashboard.totalClubs ?? 0}</div></div>
        <div className="card"><h3>Events</h3><div className="metric">{dashboard.totalEvents ?? 0}</div></div>
        <div className="card"><h3>Registrations</h3><div className="metric">{dashboard.totalRegistrations ?? 0}</div></div>
      </div>
    </Layout>
  );
}
