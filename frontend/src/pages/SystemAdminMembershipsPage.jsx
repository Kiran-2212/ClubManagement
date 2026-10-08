import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function SystemAdminMembershipsPage() {
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    api.get('/admin/memberships').then(({ data }) => setMemberships(data)).catch(() => {});
  }, []);

  return (
    <Layout title="Memberships">
      <table>
        <thead><tr><th>Student</th><th>Club</th><th>Status</th></tr></thead>
        <tbody>
          {memberships.map((membership) => (
            <tr key={membership.id}>
              <td>{membership.student?.name || 'Student'}</td>
              <td>{membership.club?.name || 'Club'}</td>
              <td>{membership.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
