import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import TopBar from './TopBar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar with language switcher + notifications */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBar />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 pt-4">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pb-20 lg:pb-4 pt-24 lg:pt-20">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation - Only visible on mobile (small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
