'use client';

import { useState } from 'react';
import Navigation from './components/Navigation';

// main shell, tabs swap content in the center column
export default function Home() {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div className="min-h-screen bg-amber-100 text-stone-800 flex">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="pb-24 md:pb-6 md:ml-64 p-6 transition-all duration-200 flex-1">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'calendar' && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-6 flex justify-between items-end">
            <div>
                  <h2 className="text-2xl font-bold text-stone-800">Schedule</h2>
                  <p className="text-stone-600 text-sm mt-1">Manage custody blocks and events.</p>
                </div>
              </div>

              <CalendarGrid />
            </div>
          )}

          {activeTab === 'work' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Work Responsibilities</h2>
              <p className="text-stone-500">Weekly task lists and Kanban container goes here.</p>
            </div>
          )}

          {activeTab === 'progress' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Personal Progress Tracker</h2>
              <p className="text-stone-500">Books, metrics, and automated API components go here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
