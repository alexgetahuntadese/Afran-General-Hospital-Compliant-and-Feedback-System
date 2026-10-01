import React from 'react';
import { Shield, Search, FileEdit, Sun, Moon, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { StaffUser } from '../types/hospital';
import hospitalLogo from '../assets/images/afran-general-hospital-logo.svg';

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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Subtle Emergency Advisory Strip */}
      <div className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800/60 px-4 py-1 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
        <span className="truncate">{t.emergencyBanner}</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand & Wordmark */}
        <button
          onClick={() => onNavigate('submit')}
          className="text-left flex items-center group focus:outline-none"
          aria-label={t.hospitalName}
        >
          <img
            src={hospitalLogo}
            alt="Afran General Hospital"
            className="h-auto w-[8.75rem] sm:w-[11.25rem] shrink-0 transition-transform group-hover:scale-[1.02]"
          />
        </button>

        {/* Navigation & Clean Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Submit */}
          <button
            onClick={() => onNavigate('submit')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'submit'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.navSubmit}</span>
          </button>

          {/* Track */}
          <button
            onClick={() => onNavigate('track')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'track'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.navTrack}</span>
          </button>

          {/* Staff */}
          <button
            onClick={() => onNavigate('staff')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'staff'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentUser ? t.navStaff : t.navStaffLogin}</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" aria-hidden="true" />

          {/* Language Switcher Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2 py-1 rounded-md text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={language === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
          >
            {language === 'am' ? 'EN' : 'አማርኛ'}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
