import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubAdminMembershipRequestsPage() {
  const [requests, setRequests] = useState([]);

  const handleDecision = async (id, action) => {
    try {
      await api.put(`/club-admin/memberships/${id}/${action}`);
      setRequests((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  useEffect(() => {
    api.get('/club-admin/memberships').then(({ data }) => setRequests(data)).catch(() => {});
  }, []);

  return (
    <Layout title="Membership Requests">
      <div className="list">
        {requests.map((request) => (
          <div className="list-item" key={request.id}>
            <div className="row">
              <div>
                <strong>{request.student?.name}</strong>
                <p>{request.club?.name}</p>
              </div>
              <div>
                <button className="secondary" onClick={() => handleDecision(request.id, 'approve')}>Approve</button>
                <button className="danger" style={{ marginLeft: 8 }} onClick={() => handleDecision(request.id, 'reject')}>Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
