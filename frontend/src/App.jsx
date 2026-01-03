import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import { ToastProvider } from './shared/context/ToastContext';
import { NotificationProvider } from './shared/context/NotificationContext';
import { ToastContainer } from './shared/components/Toast';
import ProtectedRoute from './shared/components/ProtectedRoute';
import Login from './shared/Login';

// Teacher Panel
import TeacherLayout from './teacher/components/Layout';
import TeacherDashboard from './teacher/pages/Dashboard';
import ParentManagement from './teacher/pages/ParentManagement';
import TeacherActivities from './teacher/pages/Activities';
import TeacherMedia from './teacher/pages/Media';
import TeacherMeals from './teacher/pages/Meals';

// Parent Panel
import ParentLayout from './parent/components/Layout';
import ParentDashboard from './parent/pages/Dashboard';
import ChildProfile from './parent/pages/ChildProfile';
import ParentActivities from './parent/pages/Activities';
import ParentMedia from './parent/pages/Media';
import ParentMeals from './parent/pages/Meals';
import Settings from './parent/pages/Settings';
import Help from './parent/pages/Help';

function App() {
  return (
    <ToastProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <ToastContainer />
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Teacher Routes */}
              <Route
                path="/teacher/*"
                element={
                  <ProtectedRoute>
                    <TeacherLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<TeacherDashboard />} />
                <Route path="parents" element={<ParentManagement />} />
                <Route path="activities" element={<TeacherActivities />} />
                <Route path="media" element={<TeacherMedia />} />
                <Route path="meals" element={<TeacherMeals />} />
              </Route>

              {/* Parent Routes */}
              <Route
                path="/parent/*"
                element={
                  <ProtectedRoute>
                    <ParentLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ParentDashboard />} />
                <Route path="child" element={<ChildProfile />} />
                <Route path="activities" element={<ParentActivities />} />
                <Route path="media" element={<ParentMedia />} />
                <Route path="meals" element={<ParentMeals />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<Help />} />
              </Route>

              {/* Root redirect based on role */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ToastProvider>
  );
}

export default App;
