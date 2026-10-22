import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubDetailPage() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setLoading(true);
    setClub(null);
    setError('');
    Promise.all([
      api.get(`/clubs/${id}`),
      api.get('/student/memberships'),
    ])
      .then(([clubResponse, membershipResponse]) => {
        setClub(clubResponse.data);
        const existingMembership = membershipResponse.data.find(
          (item) => String(item.club?.id) === String(id)
        );
        setMembership(existingMembership || null);
      })
      .catch((err) => setError(err.message || 'Unable to load club details'))
      .finally(() => setLoading(false));
  }, [id]);

  const requestMembership = async () => {
    setRequesting(true);
    setError('');
    setNotice('');
    try {
      const { data } = await api.post(`/clubs/${id}/membership`);
      setMembership(data);
      setNotice(`Your membership request is ${data.status.toLowerCase()}.`);
    } catch (err) {
      setError(err.message || 'Membership request failed');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <Layout title="Club details">
      <main className="student-club-detail">
        <Link className="student-back-link" to="/student/clubs"><span aria-hidden="true">←</span> All clubs</Link>

        {loading && <p className="student-muted">Loading club details…</p>}
        {error && <p className="student-feedback-message" role="alert">{error}</p>}

        {club && !loading && (
          <>
            <header className="student-club-detail-heading">
              <span className="student-detail-monogram" aria-hidden="true">{club.name?.trim().charAt(0)?.toUpperCase() || 'C'}</span>
              <div>
                <p className="student-kicker">{club.category || 'CAMPUS CLUB'}</p>
                <h2>{club.name}</h2>
              </div>
            </header>

            <p className="student-club-description">{club.description || 'A campus community to meet people and take part in activities.'}</p>

            <dl className="student-club-facts">
              <div><dt>Faculty coordinator</dt><dd>{club.facultyCoordinator || 'Not listed'}</dd></div>
              <div><dt>Club category</dt><dd>{club.category || 'General'}</dd></div>
            </dl>

            <section className="student-join-section">
              <div>
                <h3>Interested in joining?</h3>
                <p>{membership
                  ? membership.status === 'APPROVED'
                    ? 'You are already a member of this club.'
                    : membership.status === 'PENDING'
                      ? 'Your request has been sent and is waiting for a club admin to review it.'
                      : 'Your previous request was declined. Contact the club admin for help.'
                  : 'Send a membership request to the club admins for review.'}</p>
              </div>
              {membership ? (
                <span className={`student-status status-${membership.status.toLowerCase()}`}>
                  {membership.status === 'APPROVED' ? 'Member' : membership.status === 'PENDING' ? 'Request pending' : 'Request declined'}
                </span>
              ) : (
                <button className="student-button" type="button" onClick={requestMembership} disabled={requesting}>
                  {requesting ? 'Sending request…' : 'Request membership'}
                </button>
              )}
            </section>

            {notice && <p className="student-feedback-message" role="status">{notice}</p>}
          </>
        )}
      </main>
    </Layout>
  );
}
