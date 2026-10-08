import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function StudentMembershipsPage() {
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    api.get('/student/memberships').then(({ data }) => setMemberships(data)).catch(() => {});
  }, []);

  return (
    <Layout title="Memberships">
      <table>
        <thead>
          <tr><th>Club</th><th>Status</th><th>Joined</th></tr>
        </thead>
        <tbody>
          {memberships.map((item) => (
            <tr key={item.id}>
              <td>{item.club?.name || 'Club'}</td>
              <td>{item.status}</td>
              <td>{item.joinedAt ? new Date(item.joinedAt).toLocaleDateString() : 'Pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
