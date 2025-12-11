import React, { useState } from 'react';
import { generateItinerary } from '../services/geminiService';
import { Itinerary, TripVibe } from '../types';
import { MapPin, Calendar, Loader2, Clock, Info, ArrowRight, Search, Sparkles } from 'lucide-react';

const TripPlanner: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  
  // Form State
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(3);
  const [vibe, setVibe] = useState<string>(TripVibe.RELAXED);
  const [interests, setInterests] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateItinerary(destination, duration, vibe, interests);
      setItinerary(result);
      setStep(2);
    } catch (error) {
      alert("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setItinerary(null);
  };

  if (step === 1) {
    return (
      <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] w-full bg-slate-900 overflow-hidden">
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-60 dark:opacity-40"
                style={{ 
                  backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop")',
                }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent dark:from-slate-950/90"></div>
             
             <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
                   Where to next?
                </h2>
                <p className="text-lg md:text-xl text-slate-200 max-w-2xl drop-shadow-sm">
                   Discover your next great adventure with AI-powered itineraries.
                </p>
             </div>
        </div>

        {/* Search Widget - Floating overlapping the hero */}
        <div className="relative z-20 px-4 -mt-24 pb-20 max-w-5xl mx-auto">
             <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 md:p-8 transition-colors duration-300">
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                     
                     {/* Destination */}
                     <div className="md:col-span-4 space-y-2">
                         <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Destination</label>
                         <div className="relative flex items-center">
                             <MapPin className="absolute left-3 text-slate-400 w-5 h-5" />
                             <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Country, city or airport"
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700/50 border-none rounded-md font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                             />
                         </div>
                     </div>

                     {/* Duration & Vibe */}
                     <div className="md:col-span-4 grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</label>
                            <div className="relative flex items-center">
                                <Calendar className="absolute left-3 text-slate-400 w-5 h-5" />
                                <input
                                    type="number"
                                    min={1}
                                    max={14}
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                                    className="w-full pl-10 pr-2 py-3 bg-slate-100 dark:bg-slate-700/50 border-none rounded-md font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 transition-colors"
                                />
                            </div>
                         </div>
                         <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vibe</label>
                             <select
                                value={vibe}
                                onChange={(e) => setVibe(e.target.value)}
                                className="w-full px-3 py-3 bg-slate-100 dark:bg-slate-700/50 border-none rounded-md font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 cursor-pointer transition-colors"
                             >
                                {Object.values(TripVibe).map((v) => (
                                <option key={v} value={v} className="dark:bg-slate-800">{v}</option>
                                ))}
                             </select>
                         </div>
                     </div>

                     {/* Interests */}
                     <div className="md:col-span-4 space-y-2">
                         <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Interests (Optional)</label>
                         <input
                            type="text"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            placeholder="Food, History..."
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700/50 border-none rounded-md font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                         />
                     </div>
                 </div>

                 <div className="mt-6 flex justify-end">
                     <button
                        onClick={handleGenerate}
                        disabled={loading || !destination}
                        className="w-full md:w-auto px-8 py-4 bg-[#00a698] hover:bg-[#008f82] dark:bg-sky-600 dark:hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-2"
                     >
                        {loading ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5" />}
                        {loading ? 'Planning...' : 'Explore now'}
                     </button>
                 </div>
             </div>

             {/* Inspiration Cards */}
             <div className="mt-12">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 transition-colors">Popular destinations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {['Kyoto, Japan', 'Reykjavik, Iceland', 'Amalfi, Italy'].map((place, i) => (
                        <button key={i} onClick={() => setDestination(place)} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all text-left group border border-slate-200 dark:border-slate-700">
                            <div className="h-32 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${i === 0 ? 'from-pink-400 to-purple-500' : i === 1 ? 'from-blue-400 to-teal-400' : 'from-orange-400 to-red-500'}`}></div>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                            </div>
                            <div className="p-4">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Flight + Hotel</span>
                                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mt-1">{place}</h4>
                            </div>
                        </button>
                    ))}
                </div>
             </div>
        </div>
      </div>
    );
  }

  // Results View
  return (
    <div className="h-full overflow-y-auto bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-4 py-4 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    Trip to {itinerary?.destination}
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {itinerary?.duration} • {vibe} Vibe • Powered by Gemini
                </p>
            </div>
            <button
                onClick={reset}
                className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
                Search Again
            </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
          {itinerary?.itinerary.map((day) => (
            <div key={day.day} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="bg-sky-600 dark:bg-sky-600 text-white font-bold w-8 h-8 rounded-md flex items-center justify-center shadow-sm text-sm">
                             {day.day}
                         </div>
                         <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{day.theme}</h3>
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {day.activities.map((activity, idx) => (
                        <div key={idx} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-full md:w-32 flex-shrink-0">
                                    <div className="inline-flex items-center text-sm font-bold text-slate-600 dark:text-slate-400">
                                        <Clock className="w-4 h-4 mr-1.5 text-sky-600 dark:text-sky-400" />
                                        {activity.time}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{activity.activity}</h4>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">{activity.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-transparent dark:border-slate-600">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {activity.location}
                                        </span>
                                        {activity.tips && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/50">
                                                <Info className="w-3 h-3 mr-1" />
                                                {activity.tips}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="hidden md:flex flex-col justify-center pl-4 border-l border-slate-100 dark:border-slate-700">
                                     <button className="p-2 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                                         <ArrowRight className="w-5 h-5" />
                                     </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TripPlanner;