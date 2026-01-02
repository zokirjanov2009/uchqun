import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { 
  User, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Camera, 
  Mail, 
  Phone, 
  Save,
  KeyRound,
  Trash2
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Ota-ona',
    lastName: user?.lastName || 'Ismi',
    email: user?.email || 'parent@example.com',
    phone: user?.phone || '+998 90 123 45 67',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Sozlamalar saqlandi!');
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* --- Page Header --- */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Sozlamalar</h1>
        <p className="text-gray-500 font-medium">Hisobingiz va bildirishnomalarni boshqaring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- Left Navigation (Mobile Horizontal, Desktop Vertical) --- */}
        <div className="lg:col-span-1 space-y-2">
          <SettingsNavButton icon={User} label="Profil" active />
          <SettingsNavButton icon={Lock} label="Xavfsizlik" />
          <SettingsNavButton icon={Bell} label="Bildirishnomalar" />
          <SettingsNavButton icon={ShieldCheck} label="Maxfiylik" />
          <div className="pt-6">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors">
              <Trash2 className="w-5 h-5" /> Hisobni o'chirish
            </button>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Profile Section */}
          <Card className="overflow-hidden border-none shadow-xl shadow-gray-100/50">
            <div className="p-1 border-b border-gray-50 mb-8">
               <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                 <User className="text-orange-500" /> Shaxsiy ma'lumotlar
               </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-orange-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {user?.photo ? (
                      <img src={user.photo} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <User className="w-12 h-12 text-orange-400" />
                    )}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-2xl shadow-xl text-orange-600 hover:scale-110 transition-transform border border-gray-100">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">
                  Profil rasmini <br/> o'zgartirish
                </p>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup 
                    label="Ism" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    icon={User} 
                  />
                  <InputGroup 
                    label="Familiya" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    icon={User} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-[1.25rem] text-gray-400 font-bold cursor-not-allowed shadow-inner"
                      />
                    </div>
                  </div>
                  <InputGroup 
                    label="Telefon" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    icon={Phone} 
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3.5 bg-orange-600 text-white font-black rounded-[1.25rem] hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
                  >
                    <Save className="w-5 h-5" /> Saqlash
                  </button>
                </div>
              </form>
            </div>
          </Card>

          {/* Security & Password */}
          <Card className="border-none shadow-xl shadow-gray-100/50">
            <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
               <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                 <KeyRound className="text-orange-500" /> Maxfiylik va Xavfsizlik
               </h2>
               <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">Himoyalangan</span>
            </div>
            
            <div className="space-y-6 max-w-2xl">
              <InputGroup label="Hozirgi parol" type="password" placeholder="••••••••" icon={Lock} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Yangi parol" type="password" placeholder="••••••••" icon={Lock} />
                <InputGroup label="Parolni tasdiqlash" type="password" placeholder="••••••••" icon={Lock} />
              </div>
              <button className="text-orange-600 font-bold text-sm hover:underline">Parolni unutdingizmi?</button>
            </div>
          </Card>

          {/* Preferences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg">
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" /> Bildirishnomalar
              </h3>
              <div className="space-y-4">
                <ToggleItem label="Email orqali xabarlar" active />
                <ToggleItem label="Mashg'ulotlar yangilanishi" active />
                <ToggleItem label="Ovqatlanish hisoboti" />
              </div>
            </Card>

            <Card className="border-none shadow-lg bg-gray-900 text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldCheck className="w-24 h-24" />
               </div>
               <h3 className="font-black mb-6 flex items-center gap-2 relative z-10">
                Hisob holati
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-bold">Roli:</span>
                  <span className="font-black text-orange-400 uppercase tracking-tighter">{user?.role || 'Parent'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-bold">A'zolik:</span>
                  <span className="font-black">{new Date().toLocaleDateString('uz-UZ')}</span>
                </div>
                <div className="pt-4 border-t border-white/10 text-[10px] text-gray-500 font-medium">
                  Oxirgi marta 2 soat avval kirilgan (Toshkent, UZ)
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Yordamchi Komponentlar ---

const SettingsNavButton = ({ icon: Icon, label, active = false }) => (
  <button className={`flex items-center gap-3 px-5 py-3.5 w-full rounded-2xl font-bold transition-all ${
    active 
    ? 'bg-white text-orange-600 shadow-md scale-105 z-10' 
    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
  }`}>
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const InputGroup = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2 group">
    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-orange-500 transition-colors">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-orange-400 transition-colors" />
      <input
        {...props}
        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] text-gray-900 font-bold focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none"
      />
    </div>
  </div>
);

const ToggleItem = ({ label, active = false }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
    <span className="text-sm font-bold text-gray-700">{label}</span>
    <button className={`w-11 h-6 rounded-full relative transition-colors ${active ? 'bg-orange-500' : 'bg-gray-200'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);

export default Settings;