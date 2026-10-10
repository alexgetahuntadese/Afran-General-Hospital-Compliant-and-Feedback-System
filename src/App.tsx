/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect } from 'react';
import hospitalLogo from './assets/images/afran-general-hospital-logo.jpg';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Header } from './components/Header';
import { SubmitView } from './components/SubmitView';
import { TrackView } from './components/TrackView';
import { Notifications } from './components/Notifications';
import { CaseSubmission, StaffAccountAction, StaffRole, StaffUser } from './types/hospital';
import type { Session } from '@supabase/supabase-js';
import { createCase, createStaffAccount, getCases, getCurrentUserProfile, getStaffProfiles, manageStaffAccount, updateCase } from './lib/data';
import { supabase } from './lib/supabase';

const StaffView = lazy(() => import('./components/StaffView').then((module) => ({ default: module.StaffView })));
const QRCodePoster = lazy(() => import('./components/QRCodePoster').then((module) => ({ default: module.QRCodePoster })));

function HospitalFeedbackApp() {
  const { t } = useLanguage();

  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [currentView, setCurrentView] = useState<'submit' | 'track' | 'staff' | 'qrcode'>('submit');
  const [cases, setCases] = useState<CaseSubmission[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [currentUser, setCurrentUserState] = useState<StaffUser | null>(null);
  const [trackTargetRef, setTrackTargetRef] = useState('');
  const [dataError, setDataError] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setIsSplashExiting(true), 1550);
    const hideTimer = window.setTimeout(() => setShowSplash(false), 1900);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

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

  const handleManageStaffAccount = async (input: StaffAccountAction) => {
    await manageStaffAccount(input);
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

  if (showSplash) {
    return (
      <div
        className={`hospital-splash${isSplashExiting ? ' hospital-splash--exiting' : ''}`}
        role="status"
        aria-label={t.hospitalName}
      >
        <svg className="hospital-splash__city" viewBox="0 0 390 844" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <circle cx="304" cy="493" r="68" fill="#fbbf24" opacity=".08" />
          <circle cx="304" cy="493" r="38" fill="#fde68a" opacity=".45" />
          <path d="M0 594c46-30 76-12 111-26 39-16 63-4 103-22 38-17 76-4 109-22 24-13 45-12 67-4v324H0z" fill="#247181" opacity=".58" />
          <path d="M0 643c42-24 72-11 108-27 39-18 68-5 103-19 39-16 75-3 111-17 25-10 47-10 68-4v268H0z" fill="#11586b" opacity=".78" />
          <g fill="#0a3449">
            <path d="M12 626h33v111H12zM16 610h25v16H16z" />
            <path d="M51 601h37v139H51zM58 584h23v17H58z" />
            <path d="M96 570h34v173H96zM101 555l12-18 12 18z" />
            <path d="M136 619h42v125h-42zM142 605h30v14h-30z" />
            <path d="M184 628h46v116h-46zM183 628c3-18 12-27 24-31 12 4 21 13 23 31z" />
            <path d="M237 588h39v157h-39zM244 574h25v14h-25z" />
            <path d="M284 551h34v194h-34zM289 535h24v16h-24z" />
            <path d="M324 612h51v133h-51zM331 598h37v14h-37z" />
            <path d="M0 684h390v160H0z" />
          </g>
          <g fill="#fcdca2" opacity=".55">
            <path d="M20 640h5v7h-5zm12 0h5v7h-5zm-12 17h5v7h-5zm12 0h5v7h-5zm-12 17h5v7h-5zm12 0h5v7h-5z" />
            <path d="M60 615h6v8h-6zm13 0h6v8h-6zm-13 17h6v8h-6zm13 0h6v8h-6zm-13 17h6v8h-6zm13 0h6v8h-6z" />
            <path d="M104 586h6v9h-6zm13 0h6v9h-6zm-13 18h6v9h-6zm13 0h6v9h-6zm-13 18h6v9h-6zm13 0h6v9h-6z" />
            <path d="M145 638h7v9h-7zm15 0h7v9h-7zm-15 18h7v9h-7zm15 0h7v9h-7zm-15 18h7v9h-7zm15 0h7v9h-7z" />
            <path d="M194 650h7v9h-7zm17 0h7v9h-7zm-17 18h7v9h-7zm17 0h7v9h-7z" />
            <path d="M245 606h7v9h-7zm16 0h7v9h-7zm-16 18h7v9h-7zm16 0h7v9h-7zm-16 18h7v9h-7zm16 0h7v9h-7z" />
            <path d="M291 568h6v9h-6zm14 0h6v9h-6zm-14 18h6v9h-6zm14 0h6v9h-6zm-14 18h6v9h-6zm14 0h6v9h-6z" />
            <path d="M333 630h7v9h-7zm17 0h7v9h-7zm-17 18h7v9h-7zm17 0h7v9h-7zm-17 18h7v9h-7zm17 0h7v9h-7z" />
          </g>
          <path d="M0 742c56-28 95-18 139-4 49 15 87 8 132-7 42-14 75-9 119 7v106H0z" fill="#082f49" />
        </svg>
        <div className="hospital-splash__content">
          <p className="hospital-splash__location">
            <span aria-hidden="true" />
            {t.splashLocation}
          </p>
          <div className="hospital-splash__logo">
            <img src={hospitalLogo} alt="" />
          </div>
          <h1 className="hospital-splash__name">{t.hospitalName}</h1>
          <p className="hospital-splash__subtitle">{t.splashSubtitle}</p>
          <svg className="hospital-splash__ecg" viewBox="0 0 160 36" fill="none" aria-hidden="true">
            <path className="hospital-splash__ecg-track" d="M2 18h42l9-9 12 20 13-28 12 22 8-5h60" />
            <path className="hospital-splash__ecg-pulse" d="M2 18h42l9-9 12 20 13-28 12 22 8-5h60" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#effbff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-[#90e0ef] dark:selection:bg-cyan-950 selection:text-[#03045e] dark:selection:text-teal-200">
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

        <Suspense fallback={<div className="mx-auto grid min-h-[360px] max-w-6xl place-items-center px-4 text-sm text-slate-500">Loading hospital workspace…</div>}>
          {currentView === 'staff' && (
            <StaffView
              cases={cases}
              onUpdateCase={handleUpdateCase}
              currentUser={currentUser}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
              staffList={staffList}
              onManageStaffAccount={handleManageStaffAccount}
              onCreateStaffAccount={handleCreateStaffAccount}
              authError={authError}
              dataError={dataError}
            />
          )}

          {currentView === 'qrcode' && <QRCodePoster />}
        </Suspense>
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
          © {new Date().getFullYear()} {t.hospitalName}. {t.footerNotice}
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <HospitalFeedbackApp />
          <Notifications />
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
