'use client';

import { Calendar, Briefcase, BarChart2 } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const navItems = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
  ];

  return (
    <>
      {/* sidebar on desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-amber-200 text-stone-800 p-4 border-r border-amber-300/60 shadow-sm">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-700 text-white'
                    : 'text-stone-500 hover:bg-orange-100 hover:text-orange-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* bottom bar on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-amber-200 border-t border-amber-300/60 shadow-lg top-shadow flex items-center justify-around px-4 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${
                isActive ? 'text-orange-700' : 'text-stone-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}