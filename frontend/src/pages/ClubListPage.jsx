import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubListPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/clubs')
      .then(({ data }) => setClubs(data))
      .catch((err) => setError(err.message || 'Unable to load clubs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Clubs">
      <section className="student-page-intro">
        <div><p className="student-kicker">FIND YOUR PEOPLE</p><h2>Explore campus clubs</h2></div>
        <p>Discover a community, learn something new, and make your campus experience your own.</p>
      </section>

      <div className="student-list-toolbar">
        <span>{loading ? 'Loading clubs…' : `${clubs.length} ${clubs.length === 1 ? 'club' : 'clubs'} to explore`}</span>
        <span className="student-muted">Browse all communities</span>
      </div>
      {error && <p className="student-feedback-message" role="alert">{error}</p>}
      {!loading && !error && clubs.length === 0 && (
        <div className="student-empty student-empty-panel"><strong>No clubs are listed yet</strong><span>Check back later for campus communities.</span></div>
      )}

      <div className="student-card-grid">
        {clubs.map((club) => (
          <article className="student-club-card" key={club.id}>
            <div className="student-card-topline"><span className="student-monogram" aria-hidden="true">{club.name?.trim().charAt(0)?.toUpperCase() || 'C'}</span><span className="student-tag">{club.category || 'Campus club'}</span></div>
            <h3>{club.name}</h3>
            <p>{club.description || 'A place to meet people and take part in campus activities.'}</p>
            <div className="student-card-footer">
              <span>{club.facultyCoordinator ? `Coordinator · ${club.facultyCoordinator}` : 'Student community'}</span>
              <Link to={`/student/clubs/${club.id}`} aria-label={`View ${club.name} details`}>View details <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
}
