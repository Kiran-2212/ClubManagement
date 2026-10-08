import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ClubListPage from './pages/ClubListPage';
import ClubDetailPage from './pages/ClubDetailPage';
import StudentMembershipsPage from './pages/StudentMembershipsPage';
import StudentEventsPage from './pages/StudentEventsPage';
import StudentAnnouncementsPage from './pages/StudentAnnouncementsPage';
import StudentAttendancePage from './pages/StudentAttendancePage';
import ClubAdminDashboardPage from './pages/ClubAdminDashboardPage';
import ClubAdminMembershipRequestsPage from './pages/ClubAdminMembershipRequestsPage';
import ClubAdminEventsPage from './pages/ClubAdminEventsPage';
import ClubAdminAnnouncementsPage from './pages/ClubAdminAnnouncementsPage';
import ClubAdminFeedbackPage from './pages/ClubAdminFeedbackPage';
import ClubAdminStatisticsPage from './pages/ClubAdminStatisticsPage';
import SystemAdminDashboardPage from './pages/SystemAdminDashboardPage';
import SystemAdminUsersPage from './pages/SystemAdminUsersPage';
import SystemAdminClubsPage from './pages/SystemAdminClubsPage';
import SystemAdminEventsPage from './pages/SystemAdminEventsPage';
import SystemAdminMembershipsPage from './pages/SystemAdminMembershipsPage';
import SystemAdminStatisticsPage from './pages/SystemAdminStatisticsPage';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (user?.role === 'CLUB_ADMIN') return <Navigate to="/club-admin/dashboard" replace />;
    if (user?.role === 'SYSTEM_ADMIN') return <Navigate to="/system-admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (user?.role === 'CLUB_ADMIN') return <Navigate to="/club-admin/dashboard" replace />;
    if (user?.role === 'SYSTEM_ADMIN') return <Navigate to="/system-admin/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboardPage /></ProtectedRoute>} />
        <Route path="/student/clubs" element={<ProtectedRoute allowedRoles={['STUDENT']}><ClubListPage /></ProtectedRoute>} />
        <Route path="/student/clubs/:id" element={<ProtectedRoute allowedRoles={['STUDENT']}><ClubDetailPage /></ProtectedRoute>} />
        <Route path="/student/memberships" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentMembershipsPage /></ProtectedRoute>} />
        <Route path="/student/events" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentEventsPage /></ProtectedRoute>} />
        <Route path="/student/announcements" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentAnnouncementsPage /></ProtectedRoute>} />
        <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentAttendancePage /></ProtectedRoute>} />

        <Route path="/club-admin/dashboard" element={<ProtectedRoute allowedRoles={['CLUB_ADMIN']}><ClubAdminDashboardPage /></ProtectedRoute>} />
        <Route path="/club-admin/membership-requests" element={<ProtectedRoute allowedRoles={['CLUB_ADMIN']}><ClubAdminMembershipRequestsPage /></ProtectedRoute>} />
        <Route path="/club-admin/events" element={<ProtectedRoute allowedRoles={['CLUB_ADMIN']}><ClubAdminEventsPage /></ProtectedRoute>} />
        <Route path="/club-admin/announcements" element={<ProtectedRoute allowedRoles={['CLUB_ADMIN']}><ClubAdminAnnouncementsPage /></ProtectedRoute>} />
        <Route path="/club-admin/feedback" element={<ProtectedRoute allowedRoles={['CLUB_ADMIN']}><ClubAdminFeedbackPage /></ProtectedRoute>} />
        <Route path="/club-admin/statistics" element={<ProtectedRoute allowedRoles={['CLUB_ADMIN']}><ClubAdminStatisticsPage /></ProtectedRoute>} />

        <Route path="/system-admin/dashboard" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><SystemAdminDashboardPage /></ProtectedRoute>} />
        <Route path="/system-admin/users" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><SystemAdminUsersPage /></ProtectedRoute>} />
        <Route path="/system-admin/club-admins" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><SystemAdminUsersPage /></ProtectedRoute>} />
        <Route path="/system-admin/clubs" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><SystemAdminClubsPage /></ProtectedRoute>} />
        <Route path="/system-admin/events" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><SystemAdminEventsPage /></ProtectedRoute>} />
        <Route path="/system-admin/memberships" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><SystemAdminMembershipsPage /></ProtectedRoute>} />
        <Route path="/system-admin/statistics" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><SystemAdminStatisticsPage /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
