import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from './components/Toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChildProfile from './pages/ChildProfile';
import Activities from './pages/Activities';
import Media from './pages/Media';
import Meals from './pages/Meals';
import Settings from './pages/Settings';
import Help from './pages/Help';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <ToastProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <ToastContainer />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="child" element={<ChildProfile />} />
                <Route path="activities" element={<Activities />} />
                <Route path="meals" element={<Meals />} />
                <Route path="media" element={<Media />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<Help />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ToastProvider>
  );
}

export default App;

