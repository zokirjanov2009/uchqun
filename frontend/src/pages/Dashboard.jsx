import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataStore } from '../services/dataStore';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Activity,
  UtensilsCrossed,
  Camera,
  Calendar,
  Video,
  Music,
  Trophy,
  TrendingUp,
  Users,
} from 'lucide-react';

const Dashboard = () => {
  const { user, isTeacher } = useAuth();
  const [child, setChild] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const activities = dataStore.getActivities();
        const meals = dataStore.getMeals();
        const media = dataStore.getMedia();
        const parents = isTeacher ? dataStore.getParents() : [];
        const children = dataStore.getChildren();

        // Calculate weekly activities
        const weeklyActivities = Array.isArray(activities) ? activities.length : 0;
        const weeklyGoal = 12;
        const progress = Math.min((weeklyActivities / weeklyGoal) * 100, 100);

        if (!isTeacher && children.length > 0) {
          setChild(children[0]);
        }

        setStats({
          activities: Array.isArray(activities) ? activities.length : 0,
          meals: Array.isArray(meals) ? meals.length : 0,
          media: Array.isArray(media) ? media.length : 0,
          parents: Array.isArray(parents) ? parents.length : 0,
          children: Array.isArray(children) ? children.length : 0,
          recentActivity: Array.isArray(activities) && activities.length > 0 ? activities[0] : null,
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
  }, [isTeacher]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const overviewCards = isTeacher
    ? [
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
      ]
    : [
        {
          title: 'Activities',
          value: stats?.activities || 0,
          icon: Activity,
        },
        {
          title: 'Meals Tracked',
          value: stats?.meals || 0,
          icon: UtensilsCrossed,
        },
        {
          title: 'Photos',
          value: stats?.media || 0,
          icon: Camera,
        },
      ];

  const quickActions = isTeacher
    ? [
        { to: '/parents', title: 'Parents', icon: Users },
        { to: '/activities', title: 'Activities', icon: Calendar },
        { to: '/media', title: 'Media', icon: Video },
        { to: '/meals', title: 'Meals', icon: UtensilsCrossed },
      ]
    : [
        { to: '/activities', title: 'Schedule', icon: Calendar },
        { to: '/media', title: 'Media', icon: Video },
        { to: '/activities', title: 'Music', icon: Music },
        { to: '/child', title: 'Progress', icon: TrendingUp },
      ];

  return (
    <div className="space-y-6">
      {/* Orange Header Section */}
      <div className="bg-orange-500 rounded-2xl p-6 md:p-8 -mx-4 md:mx-0">
        <p className="text-white/90 text-sm mb-1">Welcome back</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {isTeacher ? `${user?.firstName || 'Teacher'} Admin Panel` : (child?.firstName || user?.firstName || 'Parent')}
        </h1>
        {isTeacher && (
          <p className="text-white/80 text-sm mt-2">Manage all content, parents, and activities</p>
        )}
      </div>

      {/* Overview Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isTeacher ? 'Admin Overview' : 'Overview'}
        </h2>
        <div className={`grid grid-cols-2 ${isTeacher ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
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

      {/* Quick Actions */}
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

      {/* Weekly Achievement Card */}
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
            {/* Progress Bar */}
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
