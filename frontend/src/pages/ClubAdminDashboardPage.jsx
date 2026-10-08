import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubAdminDashboardPage() {
  const [data, setData] = useState({});

  useEffect(() => {
    api.get('/club-admin/dashboard').then(({ data }) => setData(data)).catch(() => {});
  }, []);

  return (
    <Layout title="Club Admin Dashboard">
      <div className="card-grid">
        <div className="card"><h3>Members</h3><div className="metric">{data.memberCount ?? 0}</div></div>
        <div className="card"><h3>Pending Requests</h3><div className="metric">{data.pendingRequests ?? 0}</div></div>
        <div className="card"><h3>Upcoming Events</h3><div className="metric">{data.upcomingEvents?.length ?? 0}</div></div>
        <div className="card"><h3>Clubs Managed</h3><div className="metric">{data.clubs?.length ?? 0}</div></div>
      </div>
    </Layout>
  );
}
