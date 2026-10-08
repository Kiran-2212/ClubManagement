import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api.get('/student/announcements').then(({ data }) => setAnnouncements(data)).catch(() => {});
  }, []);

  return (
    <Layout title="Announcements">
      <div className="list">
        {announcements.map((item) => (
          <div key={item.id} className="list-item">
            <div className="row"><strong>{item.title}</strong><span className="badge">{item.club?.name || 'Club'}</span></div>
            <p>{item.message}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
