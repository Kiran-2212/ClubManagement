import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ title, children }) {
  const { user, logout, isStudent, isClubAdmin, isSystemAdmin } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const handleApiError = (event) => setApiError(event.detail || 'The request could not be completed.');
    window.addEventListener('club-management-api-error', handleApiError);
    return () => window.removeEventListener('club-management-api-error', handleApiError);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/clubs', label: 'Clubs' },
    { to: '/student/memberships', label: 'Memberships' },
    { to: '/student/events', label: 'Events' },
    { to: '/student/announcements', label: 'Announcements' },
    { to: '/student/attendance', label: 'Attendance' },
  ];

  const clubAdminLinks = [
    { to: '/club-admin/dashboard', label: 'Dashboard' },
    { to: '/club-admin/membership-requests', label: 'Requests' },
    { to: '/club-admin/events', label: 'Events' },
    { to: '/club-admin/announcements', label: 'Announcements' },
    { to: '/club-admin/feedback', label: 'Feedback' },
    { to: '/club-admin/statistics', label: 'Statistics' },
  ];

  const adminLinks = [
    { to: '/system-admin/dashboard', label: 'Dashboard' },
    { to: '/system-admin/users', label: 'Users' },
    { to: '/system-admin/clubs', label: 'Clubs' },
    { to: '/system-admin/events', label: 'Events' },
    { to: '/system-admin/memberships', label: 'Memberships' },
    { to: '/system-admin/statistics', label: 'Statistics' },
  ];

  const links = isStudent ? studentLinks : isClubAdmin ? clubAdminLinks : adminLinks;

  return (
    <>
      <nav className={`navbar${isStudent ? ' student-navbar' : isClubAdmin ? ' club-admin-navbar' : isSystemAdmin ? ' system-admin-navbar' : ''}`}>
        <div>
          <strong>College Club Management</strong>
          <span style={{ marginLeft: 12, opacity: 0.8 }}>{user?.role}</span>
        </div>
        <div className="nav-links">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'is-active' : ''}>{link.label}</NavLink>
          ))}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className={`page${isStudent ? ' student-page' : isClubAdmin ? ' club-admin-page' : isSystemAdmin ? ' system-admin-page' : ''}`}>
        <div className="dashboard-header">
          <h1>{title}</h1>
          <span className="badge">{user?.name || 'User'}</span>
        </div>
        {apiError && <div className="error-box" role="alert">
          <div className="row">
            <span>{apiError}</span>
            <button className="secondary" type="button" onClick={() => setApiError('')}>Dismiss</button>
          </div>
        </div>}
        {children}
      </div>
    </>
  );
}
