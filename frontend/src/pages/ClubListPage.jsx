import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

export default function ClubListPage() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    api.get('/clubs').then(({ data }) => setClubs(data)).catch(() => {});
  }, []);

  return (
    <Layout title="Browse Clubs">
      <div className="list">
        {clubs.map((club) => (
          <div className="list-item" key={club.id}>
            <div className="row">
              <div>
                <h3>{club.name}</h3>
                <p>{club.category}</p>
              </div>
              <Link to={`/student/clubs/${club.id}`} className="btn-primary">View Details</Link>
            </div>
            <p>{club.description}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
