import React, { useState, useEffect } from 'react';
import { MessageSquare, Compass, Plane, Moon, Sun } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import TripPlanner from './components/TripPlanner';

enum AppMode {
  CHAT = 'CHAT',
  PLANNER = 'PLANNER'
}

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.PLANNER);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode class on HTML element or wrapper
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`flex h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
      {/* Sidebar Navigation - Dark Brand Color */}
      <aside className="relative z-20 w-16 lg:w-64 bg-[#05203c] dark:bg-[#02101f] text-white flex flex-col justify-between transition-all duration-300 shadow-xl flex-shrink-0 border-r border-slate-700/50 dark:border-slate-800">
        <div>
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-700/50 dark:border-slate-800">
            <div className="text-sky-400">
              <Compass className="w-8 h-8" />
            </div>
            <span className="hidden lg:block ml-3 font-bold text-xl tracking-tight text-white">TravelFlow</span>
          </div>

          <nav className="mt-6 px-2 lg:px-4 space-y-2">
            <button
              onClick={() => setMode(AppMode.PLANNER)}
              className={`w-full flex items-center justify-center lg:justify-start px-2 lg:px-4 py-3 rounded-lg transition-all duration-200 group ${
                mode === AppMode.PLANNER
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Plane className="w-5 h-5" />
              <span className="hidden lg:block ml-3 font-medium">Plan Trip</span>
            </button>

            <button
              onClick={() => setMode(AppMode.CHAT)}
              className={`w-full flex items-center justify-center lg:justify-start px-2 lg:px-4 py-3 rounded-lg transition-all duration-200 group ${
                mode === AppMode.CHAT
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="hidden lg:block ml-3 font-medium">Assistant</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-700/50 dark:border-slate-800 space-y-4">
          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-center lg:justify-between px-3 py-2 rounded-md bg-[#0a2a4d] dark:bg-[#0f172a] hover:bg-[#113a66] dark:hover:bg-[#1e293b] text-slate-300 hover:text-white transition-colors border border-transparent hover:border-slate-600"
          >
            <div className="flex items-center">
               {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
               <span className="hidden lg:block ml-2 text-sm font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className="hidden lg:block w-8 h-4 bg-slate-700 rounded-full relative">
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isDarkMode ? 'left-4.5' : 'left-0.5'}`} style={{ left: isDarkMode ? '18px' : '2px' }}></div>
            </div>
          </button>

          <div className="hidden lg:block bg-[#0f2d4d] dark:bg-[#0f172a] rounded-lg p-3">
            <p className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">Powered by</p>
            <p className="text-sm font-bold text-sky-400">
              Gemini 2.5 Flash
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden relative flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-8 shadow-sm flex-shrink-0 z-10 transition-colors duration-300">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">
                {mode === AppMode.CHAT ? 'AI Travel Assistant' : 'Trip Planner'}
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-3">
               <button className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Help</button>
               <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
               <button className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Sign In</button>
            </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {mode === AppMode.CHAT ? <ChatInterface /> : <TripPlanner />}
        </div>
      </main>
    </div>
  );
};

export default App;