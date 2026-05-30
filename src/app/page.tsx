'use client';

import { useState } from 'react';
import Navigation from './components/Navigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Our responsive navigation shell */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MAIN CONTENT CONTAINER */}
      {/* Mobile: bottom padding so the fixed navbar doesn't overlap text */}
      {/* Desktop: left margin (md:ml-64) to clear the fixed sidebar */}
      <main className="pb-24 md:pb-6 md:ml-64 p-6 transition-all duration-200">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'calendar' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Responsive Calendar</h2>
              <p className="text-slate-400">Custody schedule and event rules container goes here.</p>
            </div>
          )}

          {activeTab === 'work' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Work Responsibilities</h2>
              <p className="text-slate-400">Weekly task lists and Kanban container goes here.</p>
            </div>
          )}

          {activeTab === 'progress' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Personal Progress Tracker</h2>
              <p className="text-slate-400">Books, metrics, and automated API components go here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}