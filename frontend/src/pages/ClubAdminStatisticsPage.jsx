import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubAdminStatisticsPage() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get('/club-admin/statistics').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  return (
    <Layout title="Club Statistics">
      <div className="card-grid">
        <div className="card"><h3>Members</h3><div className="metric">{stats.totalMembers ?? 0}</div></div>
        <div className="card"><h3>Registrations</h3><div className="metric">{stats.totalRegistrations ?? 0}</div></div>
        <div className="card"><h3>Attendance</h3><div className="metric">{stats.attendanceMarked ?? 0}</div></div>
        <div className="card"><h3>Clubs</h3><div className="metric">{stats.clubsManaged ?? 0}</div></div>
      </div>
    </Layout>
  );
}
