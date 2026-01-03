import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import { dataStore } from '../../shared/services/dataStore';
import Card from '../../shared/components/Card';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import {
  Activity,
  UtensilsCrossed,
  Camera,
  Calendar,
  Video,
  Trophy,
  Users,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const activities = dataStore.getActivities();
        const meals = dataStore.getMeals();
        const media = dataStore.getMedia();
        const parents = dataStore.getParents();

        const weeklyActivities = Array.isArray(activities) ? activities.length : 0;
        const weeklyGoal = 12;
        const progress = Math.min((weeklyActivities / weeklyGoal) * 100, 100);

        setStats({
          activities: Array.isArray(activities) ? activities.length : 0,
          meals: Array.isArray(meals) ? meals.length : 0,
          media: Array.isArray(media) ? media.length : 0,
          parents: Array.isArray(parents) ? parents.length : 0,
          weeklyActivities,
          weeklyProgress: progress,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const overviewCards = [
    {
      title: 'Parents',
      value: stats?.parents || 0,
      icon: Users,
    },
    {
      title: 'Activities',
      value: stats?.activities || 0,
      icon: Activity,
    },
    {
      title: 'Meals',
      value: stats?.meals || 0,
      icon: UtensilsCrossed,
    },
    {
      title: 'Media',
      value: stats?.media || 0,
      icon: Camera,
    },
  ];

  const quickActions = [
    { to: '/teacher/parents', title: 'Parents', icon: Users },
    { to: '/teacher/activities', title: 'Activities', icon: Calendar },
    { to: '/teacher/media', title: 'Media', icon: Video },
    { to: '/teacher/meals', title: 'Meals', icon: UtensilsCrossed },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-orange-500 rounded-2xl p-6 md:p-8 -mx-4 md:mx-0">
        <p className="text-white/90 text-sm mb-1">Welcome back</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {user?.firstName || 'Teacher'} Admin Panel
        </h1>
        <p className="text-white/80 text-sm mt-2">Manage all content, parents, and activities</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {overviewCards.map((card) => (
            <Card key={card.title} className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <card.icon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-600">{card.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all aspect-square"
            >
              <div className="p-3 bg-orange-50 rounded-xl mb-2">
                <action.icon className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <Card className="bg-orange-500 text-white p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">Weekly Achievement</h3>
            <p className="text-white/90 text-sm mb-4">
              Completed {stats?.weeklyActivities || 0} activities this week. Keep up the great work!
            </p>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats?.weeklyProgress || 0}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

