import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  User, 
  Calendar, 
  School, 
  Heart, 
  Phone, 
  ShieldAlert, 
  Baby, 
  Award,
  ChevronRight
} from 'lucide-react';

const ChildProfile = () => {
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChild = async () => {
      try {
        const response = await api.get('/child');
        setChild(response.data);
      } catch (error) {
        console.error('Error loading child data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadChild();
  }, []);

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) return <div className="flex justify-center items-center h-96"><LoadingSpinner size="lg" /></div>;
  if (!child) return <div className="text-center py-20 text-gray-500 font-medium">Ma'lumot topilmadi</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- Top Profile Hero --- */}
      <div className="relative overflow-hidden bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-50" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <img
              src={child.photo}
              alt={child.firstName}
              className="w-40 h-40 rounded-3xl object-cover shadow-2xl border-4 border-white"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm" title="Active" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-gray-900 leading-tight">
                  {child.firstName} {child.lastName}
                </h1>
                <span className="px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  {child.gender}
                </span>
              </div>
              <p className="text-lg text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <Baby className="w-5 h-5 text-orange-400" />
                {calculateAge(child.dateOfBirth)} yosh • {new Date(child.dateOfBirth).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                <School className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-gray-700">{child.school}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-bold text-gray-700">{child.class}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Left Column: Details --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed Info Grid */}
          <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-orange-600" /> Asosiy ma'lumotlar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem label="To'liq ismi" value={`${child.firstName} ${child.lastName}`} icon={User} />
              <InfoItem label="Tug'ilgan sana" value={new Date(child.dateOfBirth).toLocaleDateString()} icon={Calendar} />
              <InfoItem label="Imkoniyat turi" value={child.disabilityType} icon={ShieldAlert} color="text-red-500" />
              <InfoItem label="O'qituvchi" value={child.teacher} icon={Award} color="text-blue-500" />
            </div>
          </section>

          {/* Special Needs Section */}
          <section className="bg-gradient-to-br from-red-50 to-orange-50 rounded-[2rem] p-8 border border-red-100 shadow-inner">
            <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-600 animate-pulse" /> Maxsus ehtiyojlar va allergiyalar
            </h3>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-red-800 font-medium leading-relaxed border border-white/50">
              {child.specialNeeds}
            </div>
          </section>
        </div>

        {/* --- Right Column: Sidebar --- */}
        <div className="space-y-8">
          
          {/* Emergency Contact */}
          <section className="bg-white rounded-[2rem] p-8 shadow-md border-t-4 border-t-orange-500">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-600" /> Favqulodda bog'lanish
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="text-xs text-orange-600 font-bold uppercase mb-1">{child.emergencyContact.relationship}</p>
                <p className="text-lg font-black text-gray-900 mb-2">{child.emergencyContact.name}</p>
                <a 
                  href={`tel:${child.emergencyContact.phone}`}
                  className="inline-flex items-center gap-2 text-orange-700 font-bold hover:underline"
                >
                  <div className="bg-orange-600 p-2 rounded-lg text-white">
                    <Phone className="w-4 h-4" />
                  </div>
                  {child.emergencyContact.phone}
                </a>
              </div>
            </div>
          </section>

          {/* Activity Summary */}
          <section className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 opacity-10">
              <Award className="w-32 h-32" />
            </div>
            <h3 className="text-lg font-bold mb-6">Haftalik natijalar</h3>
            <div className="space-y-6 relative z-10">
              <StatRow label="Mashg'ulotlar" value="5" color="bg-blue-500" />
              <StatRow label="Ovqatlanish" value="15" color="bg-orange-500" />
              <StatRow label="Media" value="8" color="bg-purple-500" />
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

// --- Yordamchi Komponentlar (Reusable Components) ---

const InfoItem = ({ label, value, icon: Icon, color = "text-orange-500" }) => (
  <div className="group">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">{label}</label>
    <div className="flex items-center gap-3">
      <div className={`p-2.5 rounded-xl bg-gray-50 group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-gray-900 font-bold text-lg">{value}</p>
    </div>
  </div>
);

const StatRow = ({ label, value, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-gray-400 text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl font-black">{value}</span>
      <ChevronRight className="w-4 h-4 text-gray-600" />
    </div>
  </div>
);

export default ChildProfile;