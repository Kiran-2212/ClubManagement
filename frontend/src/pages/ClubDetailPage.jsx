import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubDetailPage() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/clubs/${id}`).then(({ data }) => setClub(data)).catch(() => {});
  }, [id]);

  const requestMembership = async () => {
    try {
      const { data } = await api.post(`/clubs/${id}/membership`);
      setMessage(`Membership request submitted with status: ${data.status}`);
    } catch (err) {
      setMessage(err.message || 'Membership request failed');
    }
  };

  if (!club) return <Layout title="Club Details"><p>Loading...</p></Layout>;

  return (
    <Layout title={club.name}>
      {message && <div className="success-box">{message}</div>}
      <div className="card">
        <h3>{club.name}</h3>
        <p><strong>Category:</strong> {club.category}</p>
        <p><strong>Faculty Coordinator:</strong> {club.facultyCoordinator}</p>
        <p>{club.description}</p>
        <button className="primary" onClick={requestMembership}>Send Membership Request</button>
      </div>
    </Layout>
  );
}
