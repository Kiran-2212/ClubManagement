import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function SystemAdminEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/admin/events').then(({ data }) => setEvents(data)).catch(() => {});
  }, []);

  return (
    <Layout title="All Events">
      <div className="list">
        {events.map((event) => (
          <div key={event.id} className="list-item">
            <div className="row"><strong>{event.title}</strong><span className="badge">{event.status}</span></div>
            <p>{event.date} | {event.venue}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
