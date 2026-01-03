import { useEffect, useState } from 'react';
import { dataStore } from '../../shared/services/dataStore';
import Card from '../../shared/components/Card';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import { 
  Utensils, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Info, 
  CalendarDays, 
  Coffee, 
  Sun, 
  Apple, 
  Moon
} from 'lucide-react';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = () => {
    try {
      const mealsData = dataStore.getMeals();
      setMeals(Array.isArray(mealsData) ? mealsData : []);
    } catch (error) {
      console.error('Error loading meals:', error);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeals = meals.filter((meal) => meal.date === selectedDate);
  const dates = [...new Set(meals.map((meal) => meal.date))].sort().reverse();

  const mealConfigs = {
    Breakfast: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Coffee, border: 'border-amber-100' },
    Lunch: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Sun, border: 'border-blue-100' },
    Snack: { color: 'text-green-600', bg: 'bg-green-50', icon: Apple, border: 'border-green-100' },
    Dinner: { color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Moon, border: 'border-indigo-100' },
  };

  if (loading) return <div className="flex justify-center items-center h-96"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meals & Nutrition</h1>
          <p className="text-gray-500 font-medium">Kunlik taomnoma va iste'mol nazorati</p>
        </div>
        
        <div className="relative">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            <CalendarDays className="w-3.5 h-3.5" /> Kunni tanlang
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="appearance-none bg-gray-50 border-none text-gray-900 font-bold rounded-2xl px-6 py-3 pr-12 focus:ring-2 focus:ring-orange-500 shadow-inner cursor-pointer"
          >
            {dates.length > 0 ? (
              dates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('uz-UZ', { weekday: 'short', day: 'numeric', month: 'long' })}
                </option>
              ))
            ) : (
              <option value={selectedDate}>
                {new Date(selectedDate).toLocaleDateString('uz-UZ', { weekday: 'short', day: 'numeric', month: 'long' })}
              </option>
            )}
          </select>
          <div className="absolute bottom-3.5 right-4 pointer-events-none text-gray-400">
            <Utensils className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredMeals.length > 0 ? (
          filteredMeals.map((meal) => {
            const config = mealConfigs[meal.mealType] || mealConfigs.Lunch;
            return (
              <Card key={meal.id} className={`group hover:shadow-xl transition-all duration-300 border-2 ${meal.eaten ? 'border-transparent' : 'border-dashed border-gray-200'}`}>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className={`flex items-center justify-center w-20 h-20 rounded-3xl ${config.bg} ${config.color} shrink-0 shadow-sm`}>
                    <config.icon className="w-10 h-10" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black text-gray-900">{meal.mealName}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}>
                        {meal.mealType}
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs ml-auto">
                        <Clock className="w-3.5 h-3.5" /> {meal.time}
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed font-medium">
                      {meal.description}
                    </p>

                    <div className="flex items-center gap-6 pt-2">
                      <div className={`flex items-center gap-1.5 text-sm font-bold ${meal.eaten ? 'text-green-600' : 'text-red-500'}`}>
                        {meal.eaten ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {meal.eaten ? 'Iste\'mol qilindi' : 'Iste\'mol qilinmadi'}
                      </div>
                    </div>

                    {meal.specialNotes && (
                      <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-4 group-hover:bg-white transition-colors">
                        <Info className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                          <span className="text-gray-900 font-bold">Eslatma:</span> {meal.specialNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-12 text-center">
            <Utensils className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium text-lg">Ushbu kunda ovqatlar qayd etilmagan</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Meals;
