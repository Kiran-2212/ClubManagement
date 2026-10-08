import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubAdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    api.get('/club-admin/feedback').then(({ data }) => setFeedback(data)).catch(() => {});
  }, []);

  return (
    <Layout title="Student Feedback">
      <div className="list">
        {feedback.map((item) => (
          <div key={item.id} className="list-item">
            <div className="row"><strong>{item.student?.name || 'Student'}</strong><span className="badge">{item.rating}/5</span></div>
            <p>{item.comment || 'No comment provided'}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
