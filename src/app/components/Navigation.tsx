'use client';

import React from 'react';
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
      {/* DESKTOP SIDEBAR: Visible on medium screens (md) and up */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-zinc-950 text-white p-4 border-r border-slate-800">
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
                    ? 'bg-emerald-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MOBILE BOTTOM NAVBAR: Visible by default, hidden on md screens and up */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950 border-t border-slate-800 flex items-center justify-around px-4 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${
                isActive ? 'text-emerald-500' : 'text-slate-400'
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