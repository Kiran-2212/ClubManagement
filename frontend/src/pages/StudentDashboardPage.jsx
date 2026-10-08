import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function StudentDashboardPage() {
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    api.get('/student/dashboard').then(({ data }) => setDashboard(data)).catch(() => {});
  }, []);

  return (
    <Layout title="Student Dashboard">
      <div className="card-grid">
        <div className="card"><h3>Joined Clubs</h3><div className="metric">{dashboard.joinedClubs ?? 0}</div></div>
        <div className="card"><h3>Upcoming Events</h3><div className="metric">{dashboard.upcomingEvents?.length ?? 0}</div></div>
        <div className="card"><h3>Registered Events</h3><div className="metric">{dashboard.registeredEvents ?? 0}</div></div>
        <div className="card"><h3>Announcements</h3><div className="metric">{dashboard.announcements?.length ?? 0}</div></div>
      </div>

      <h3>Recent Announcements</h3>
      <div className="list">
        {(dashboard.announcements || []).slice(0, 3).map((item) => (
          <div className="list-item" key={item.id}>
            <div className="row"><strong>{item.title}</strong><span className="badge">{item.club?.name || 'Club'}</span></div>
            <p>{item.message}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
