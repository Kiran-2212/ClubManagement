import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubAdminMembershipRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const [requestResponse, clubResponse] = await Promise.all([
        api.get('/club-admin/memberships'),
        api.get('/club-admin/clubs'),
      ]);
      setRequests(requestResponse.data);
      setClubs(clubResponse.data);
    } catch {
      // The shared API handler displays the request error in the page header.
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, action) => {
    try {
      await api.put(`/club-admin/memberships/${id}/${action}`);
      setRequests((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  useEffect(() => { loadRequests(); }, []);

  return (
    <Layout title="Membership Requests">
      <div className="club-admin-request-heading">
        <p>Requests from students for clubs assigned to your account appear here.</p>
        <button className="secondary" type="button" onClick={loadRequests} disabled={loading}>
          {loading ? 'Checking…' : 'Refresh'}
        </button>
      </div>
      {!loadFailed && clubs.length > 0 && (
        <p className="club-admin-managed-clubs"><strong>Your clubs:</strong> {clubs.map((club) => club.name).join(' · ')}</p>
      )}
      {loading && <p className="club-admin-muted">Loading membership requests…</p>}
      {!loading && loadFailed && <p className="club-admin-empty">Could not load membership requests. Use Refresh to try again.</p>}
      {!loading && !loadFailed && clubs.length === 0 && (
        <div className="club-admin-empty-panel">
          <strong>No club is assigned to this account</strong>
          <p>A system admin must assign a club to this Club Admin account. Student requests are sent to the admin assigned to each club.</p>
        </div>
      )}
      {!loading && !loadFailed && clubs.length > 0 && requests.length === 0 && (
        <div className="club-admin-empty-panel">
          <strong>No pending requests</strong>
          <p>Only new requests for your assigned clubs appear here. If a student is already an approved member, their request is complete and won’t appear in this list.</p>
        </div>
      )}
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
