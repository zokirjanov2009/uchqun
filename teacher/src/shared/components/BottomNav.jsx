import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Home, Image as ImageIcon, LogOut, Users, Utensils, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: t('nav.dashboard'), href: '/teacher', icon: Home },
    { name: t('nav.parents'), href: '/teacher/parents', icon: Users },
    { name: t('nav.activities'), href: '/teacher/activities', icon: Calendar },
    { name: t('nav.meals'), href: '/teacher/meals', icon: Utensils },
    { name: t('nav.media'), href: '/teacher/media', icon: ImageIcon },
    { name: t('nav.chat'), href: '/teacher/chat', icon: MessageCircle },
  ];

  const isActive = (path) => {
    if (path === '/teacher') {
      return location.pathname === '/teacher';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      <nav className="flex justify-around items-center h-16">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? 'text-orange-600' : 'text-gray-500'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${active ? 'text-orange-600' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${active ? 'text-orange-600' : 'text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
        {/* Exit Button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 h-full transition-colors text-red-600 hover:text-red-700"
          aria-label="Exit"
        >
          <LogOut className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">{t('nav.logout')}</span>
        </button>
      </nav>
    </div>
  );
};

export default BottomNav;

