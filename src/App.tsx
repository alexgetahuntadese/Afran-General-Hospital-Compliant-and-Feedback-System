/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { SubmitView } from './components/SubmitView';
import { TrackView } from './components/TrackView';
import { StaffView } from './components/StaffView';
import { CaseSubmission, StaffUser } from './types/hospital';
import { 
  getStoredCases, 
  addCase, 
  updateCase, 
  getStoredStaff, 
  addStaff, 
  getCurrentUser, 
  setCurrentUser,
  resetDemoData 
} from './utils/storage';

function HospitalFeedbackApp() {
  const { t, language } = useLanguage();

  const [currentView, setCurrentView] = useState<'submit' | 'track' | 'staff'>('submit');
  const [cases, setCases] = useState<CaseSubmission[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [currentUser, setCurrentUserState] = useState<StaffUser | null>(null);
  const [trackTargetRef, setTrackTargetRef] = useState<string>('AGH-7K2P9Q');

  useEffect(() => {
    setCases(getStoredCases());
    setStaffList(getStoredStaff());
    setCurrentUserState(getCurrentUser());
  }, []);

  const handleCreateCase = (newCase: CaseSubmission) => {
    addCase(newCase);
    setCases([newCase, ...cases]);
  };

  const handleUpdateCase = (updated: CaseSubmission) => {
    updateCase(updated);
    setCases(cases.map(c => c.id === updated.id ? updated : c));
  };

  const handleSignIn = (user: StaffUser) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    addStaff(user);
    setStaffList(getStoredStaff());
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
  };

  const handleNavigateTrack = (ref: string) => {
    setTrackTargetRef(ref);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-100 dark:selection:bg-indigo-950 selection:text-indigo-900 dark:selection:text-indigo-200">
      {/* Target Site Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 sm:pb-12">
        {currentView === 'submit' && (
          <SubmitView
            onSubmitCase={handleCreateCase}
            onNavigateTrack={handleNavigateTrack}
          />
        )}

        {currentView === 'track' && (
          <TrackView
            initialRef={trackTargetRef}
            cases={cases}
          />
        )}

        {currentView === 'staff' && (
          <StaffView
            cases={cases}
            onUpdateCase={handleUpdateCase}
            currentUser={currentUser}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            staffList={staffList}
            onAddStaff={(user) => {
              addStaff(user);
              setStaffList(getStoredStaff());
            }}
          />
        )}
      </main>

      {/* Simple, Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {t.hospitalName}
          </span>
          <span aria-hidden="true">·</span>
          <span>{t.patientRelations}</span>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} Afran General Hospital. All patient feedback is handled with confidentiality and care.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HospitalFeedbackApp />
      </LanguageProvider>
    </ThemeProvider>
  );
}
