import React from 'react';
import { Shield, Search, FileEdit, Sun, Moon, AlertCircle } from 'lucide-react';
import logo from '../assets/images/afran-general-hospital-logo.jpg';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { StaffUser } from '../types/hospital';

interface HeaderProps {
  currentView: 'submit' | 'track' | 'staff';
  onNavigate: (view: 'submit' | 'track' | 'staff') => void;
  currentUser: StaffUser | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currentUser,
}) => {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/85 backdrop-blur-xl transition-colors">
      <div className="flex items-center justify-center gap-1.5 border-b border-slate-200/70 bg-slate-50 px-4 py-1.5 text-center text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
        <span className="truncate font-semibold tracking-[0.12em] uppercase">{t.emergencyBanner}</span>
      </div>

      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('submit')}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="brand-badge group-hover:scale-[1.02] logo-pulse">
            <img
              src={logo}
              alt="Afran General Hospital logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="brand-wordmark">
              Afran
            </span>
            <span className="brand-submark">
              General Hospital
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {t.patientRelations}
            </span>
          </div>
        </button>

        {/* Navigation & Clean Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Submit */}
          <button
            onClick={() => onNavigate('submit')}
            className={`rounded-xl px-3 py-2 text-[11px] font-semibold tracking-[0.04em] transition-all duration-200 flex items-center gap-1.5 ${
              currentView === 'submit'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:bg-white dark:text-slate-900'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            <FileEdit className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.navSubmit}</span>
          </button>

          <button
            onClick={() => onNavigate('track')}
            className={`rounded-xl px-3 py-2 text-[11px] font-semibold tracking-[0.04em] transition-all duration-200 flex items-center gap-1.5 ${
              currentView === 'track'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:bg-white dark:text-slate-900'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.navTrack}</span>
          </button>

          <button
            onClick={() => onNavigate('staff')}
            className={`rounded-xl px-3 py-2 text-[11px] font-semibold tracking-[0.04em] transition-all duration-200 flex items-center gap-1.5 ${
              currentView === 'staff'
                ? 'bg-gradient-to-r from-blue-700 to-sky-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{currentUser ? t.navStaff : t.navStaffLogin}</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" aria-hidden="true" />

          {/* Language Switcher Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            title={language === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
          >
            {language === 'am' ? 'EN' : 'አማርኛ'}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
