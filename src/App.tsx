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
import { CaseSubmission, StaffRole, StaffUser } from './types/hospital';
import type { Session } from '@supabase/supabase-js';
import { createCase, createStaffAccount, getCases, getCurrentUserProfile, getStaffProfiles, updateCase, updateStaffProfile } from './lib/data';
import { supabase } from './lib/supabase';

function HospitalFeedbackApp() {
  const { t } = useLanguage();

  const [currentView, setCurrentView] = useState<'submit' | 'track' | 'staff'>('submit');
  const [cases, setCases] = useState<CaseSubmission[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [currentUser, setCurrentUserState] = useState<StaffUser | null>(null);
  const [trackTargetRef, setTrackTargetRef] = useState('');
  const [dataError, setDataError] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setAuthError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    let active = true;
    const loadUser = async (session: Session | null) => {
      if (!session?.user) {
        if (active) setCurrentUserState(null);
        return;
      }

      try {
        const profile = await getCurrentUserProfile(session.user.id);
        if (!active) return;
        if (!profile) {
          await client.auth.signOut();
          setAuthError('This email does not have an assigned staff role. Contact the Customer Service Manager.');
          return;
        }
        setAuthError('');
        setCurrentUserState(profile);
      } catch (error) {
        if (active) {
          setAuthError(error instanceof Error ? error.message : 'Unable to load the staff profile.');
        }
      }
    };

    void client.auth.getSession().then(({ data, error }) => {
      if (error) {
        setAuthError(error.message);
        return;
      }
      void loadUser(data.session);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => void loadUser(session));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setCases([]);
      setStaffList([]);
      setDataError('');
      return;
    }

    let active = true;
    const loadDashboardData = async () => {
      try {
        const loadedCases = await getCases();
        if (active) setCases(loadedCases);
        if (currentUser.role === 'customer_service_manager' || currentUser.role === 'superadmin') {
          const loadedStaff = await getStaffProfiles();
          if (active) setStaffList(loadedStaff);
        } else if (active) {
          setStaffList([]);
        }
        if (active) setDataError('');
      } catch (error) {
        if (active) {
          setDataError(error instanceof Error ? error.message : 'Unable to load dashboard data.');
        }
      }
    };

    void loadDashboardData();
    return () => {
      active = false;
    };
  }, [currentUser]);

  const handleCreateCase = async (newCase: CaseSubmission) => {
    await createCase(newCase);
    if (currentUser) setCases(await getCases());
  };

  const handleUpdateCase = async (updated: CaseSubmission) => {
    await updateCase(updated);
    setCases(await getCases());
  };

  const handleUpdateStaffProfile = async (username: string, role: StaffRole, department?: string) => {
    await updateStaffProfile(username, role, department);
    setStaffList(await getStaffProfiles());
  };

  const handleCreateStaffAccount = async (input: { username: string; fullName: string; password: string; role: StaffRole; department?: string }) => {
    await createStaffAccount(input);
    setStaffList(await getStaffProfiles());
  };

  const handleSignIn = async (username: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured.');

    const normalizedUsername = username.trim().toLowerCase();
    const isUsernameFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedUsername);
    if (!isUsernameFormatValid || !password) {
      throw new Error('Enter your username and password.');
    }

    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedUsername,
      password,
    });
    if (error) throw error;
  };

  const handleSignOut = async () => {
    if (!supabase) {
      setAuthError('');
      setCurrentUserState(null);
      setCases([]);
      setStaffList([]);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) setAuthError(error.message);
    else {
      setAuthError('');
      setCurrentUserState(null);
      setCases([]);
      setStaffList([]);
    }
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
            onUpdateStaffProfile={handleUpdateStaffProfile}
            onCreateStaffAccount={handleCreateStaffAccount}
            authError={authError}
            dataError={dataError}
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
