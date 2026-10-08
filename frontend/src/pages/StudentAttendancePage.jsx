import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function StudentAttendancePage() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/student/attendance')
      .then(({ data }) => setRecords(data))
      .catch((err) => setError(err.message || 'Unable to load attendance'));
  }, []);

  return (
    <Layout title="My Attendance">
      {error && <p className="error-box" role="alert">{error}</p>}
      {records.length === 0 && !error && <p>No attendance records yet.</p>}
      {records.length > 0 && (
        <table>
          <thead><tr><th>Event</th><th>Status</th><th>Marked</th></tr></thead>
          <tbody>
            {records.map((record) => (
              <tr key={`${record.eventId}-${record.markedAt}`}>
                <td>{record.eventTitle}</td>
                <td><span className="badge">{record.status}</span></td>
                <td>{record.markedAt ? new Date(record.markedAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
