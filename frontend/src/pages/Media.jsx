import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Image as ImageIcon, 
  Play, 
  X, 
  Calendar, 
  LayoutGrid, 
  Film, 
  Maximize2,
  ChevronLeft
} from 'lucide-react';

const Media = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const response = await api.get('/media');
        const mediaData = response.data?.media || response.data || [];
        setMedia(Array.isArray(mediaData) ? mediaData : []);
      } catch (error) {
        console.error('Error loading media:', error);
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };
    loadMedia();
  }, []);

  const filteredMedia = filter === 'all' ? media : media.filter((item) => item.type === filter);

  if (loading) return <div className="flex justify-center items-center h-96"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* --- Dynamic Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Media Gallery</h1>
          <p className="text-gray-500 font-medium mt-1">Maktab hayotidan eng sara lahzalar</p>
        </div>

        {/* --- Glassmorphism Filters --- */}
        <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
          {[
            { id: 'all', label: 'Hammasi', icon: LayoutGrid },
            { id: 'photo', label: 'Rasmlar', icon: ImageIcon },
            { id: 'video', label: 'Videolar', icon: Film },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                filter === t.id 
                ? 'bg-white text-orange-600 shadow-md scale-105' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- Media Grid --- */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">
                        {item.type}
                    </p>
                    <h3 className="text-lg font-bold leading-tight">{item.title}</h3>
                </div>

                {/* Video Play Icon */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                )}

                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Bottom Info (Always visible or not, depending on preference) */}
              <div className="p-5">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-bold text-lg">Hozircha media fayllar yo'q</p>
        </div>
      )}

      {/* --- Premium Media Modal --- */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl"
            onClick={() => setSelectedMedia(null)}
          />
          
          <div className="relative w-full max-w-6xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]">
            
            {/* Close Button Mobile */}
            <button 
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md lg:hidden"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Media Content Area */}
            <div className="flex-[2] bg-black flex items-center justify-center overflow-hidden">
              {selectedMedia.type === 'video' ? (
                <div className="relative group w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                  <Play className="w-20 h-20 text-white opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                  <p className="absolute bottom-8 text-white/60 text-sm font-medium">Video pleyer ulanmoqda...</p>
                </div>
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Sidebar Info Area */}
            <div className="flex-1 p-8 lg:p-12 overflow-y-auto bg-white">
              <button 
                onClick={() => setSelectedMedia(null)}
                className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-orange-600 font-bold text-sm mb-10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Orqaga qaytish
              </button>

              <div className="space-y-6">
                <div>
                  <span className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {selectedMedia.type}
                  </span>
                  <h3 className="text-3xl font-black text-gray-900 mt-4 leading-tight">
                    {selectedMedia.title}
                  </h3>
                </div>

                <p className="text-gray-600 leading-relaxed text-lg">
                  {selectedMedia.description}
                </p>

                <div className="pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-3 rounded-2xl">
                        <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sana</p>
                        <p className="text-gray-900 font-bold">
                            {new Date(selectedMedia.date).toLocaleDateString('uz-UZ', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;