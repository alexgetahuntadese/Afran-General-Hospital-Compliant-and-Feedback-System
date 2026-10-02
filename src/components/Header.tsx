import React from 'react';
import { Shield, Search, FileEdit, Sun, Moon, AlertCircle, QrCode } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { StaffUser } from '../types/hospital';
import hospitalLogo from '../assets/images/afran-general-hospital-logo.jpg';

interface HeaderProps {
  currentView: 'submit' | 'track' | 'staff' | 'qrcode';
  onNavigate: (view: 'submit' | 'track' | 'staff' | 'qrcode') => void;
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
    <header className="sticky top-0 z-40 border-b border-[#90e0ef]/50 bg-white/95 shadow-[0_8px_24px_rgba(3,4,94,0.07)] backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/95">
      <div className="border-b border-[#90e0ef]/30 bg-[#caf0f8]/55 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900/80 sm:px-4">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 text-center text-[10px] font-medium leading-snug text-[#03045e] dark:text-slate-200 sm:text-[11px]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
          <span className="min-w-0">{t.emergencyBanner}</span>
        </div>
      </div>

      <div className="mx-auto flex h-[4.25rem] max-w-5xl items-center justify-between gap-2 px-3 sm:h-[4.75rem] sm:px-6">
        <button
          onClick={() => onNavigate('submit')}
          className="group flex min-w-0 shrink-0 items-center gap-2 rounded-xl text-left outline-none focus-visible:ring-4 focus-visible:ring-[#90e0ef]/60 sm:gap-3"
          aria-label={t.hospitalName}
        >
          <img
            src={hospitalLogo}
            alt={t.hospitalName}
            className="h-11 w-auto max-w-[6.5rem] shrink-0 object-contain transition-transform group-hover:scale-[1.02] sm:h-12 sm:max-w-[7.5rem]"
          />
          <span className="hidden min-w-0 border-l border-slate-200 pl-3 dark:border-slate-700 md:block">
            <span className="block truncate text-xs font-extrabold leading-tight text-[#03045e] dark:text-white">
              {t.hospitalName}
            </span>
            <span className="mt-1 block truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {t.patientRelations}
            </span>
          </span>
        </button>

        <nav aria-label={t.mainNavigation} className="flex min-w-0 items-center gap-0.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-1 dark:border-slate-700/80 dark:bg-slate-900/80 sm:gap-1.5 sm:p-1.5">
          <button
            type="button"
            onClick={() => onNavigate('submit')}
            aria-label={t.navSubmit}
            title={t.navSubmit}
            aria-current={currentView === 'submit' ? 'page' : undefined}
            className={`flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl border px-2 text-[11px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#90e0ef]/60 sm:px-3 sm:text-xs ${
              currentView === 'submit'
                ? 'border-[#90e0ef] bg-white text-[#03045e] shadow-sm dark:border-[#0077b6] dark:bg-slate-800 dark:text-[#90e0ef]'
                : 'border-transparent text-slate-600 hover:border-[#90e0ef]/50 hover:bg-white hover:text-[#03045e] dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            <FileEdit className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{t.navSubmit}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('track')}
            aria-label={t.navTrack}
            title={t.navTrack}
            aria-current={currentView === 'track' ? 'page' : undefined}
            className={`flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl border px-2 text-[11px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#90e0ef]/60 sm:px-3 sm:text-xs ${
              currentView === 'track'
                ? 'border-[#90e0ef] bg-white text-[#03045e] shadow-sm dark:border-[#0077b6] dark:bg-slate-800 dark:text-[#90e0ef]'
                : 'border-transparent text-slate-600 hover:border-[#90e0ef]/50 hover:bg-white hover:text-[#03045e] dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{t.navTrack}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('staff')}
            aria-label={currentUser ? t.navStaff : t.navStaffLogin}
            title={currentUser ? t.navStaff : t.navStaffLogin}
            aria-current={currentView === 'staff' ? 'page' : undefined}
            className={`flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl border px-2 text-[11px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#90e0ef]/60 sm:px-3 sm:text-xs ${
              currentView === 'staff'
                ? 'border-[#90e0ef] bg-white text-[#03045e] shadow-sm dark:border-[#0077b6] dark:bg-slate-800 dark:text-[#90e0ef]'
                : 'border-transparent text-slate-600 hover:border-[#90e0ef]/50 hover:bg-white hover:text-[#03045e] dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{currentUser ? t.navStaff : t.navStaffLogin}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('qrcode')}
            aria-label="QR Code Posters"
            title="QR Code Posters"
            aria-current={currentView === 'qrcode' ? 'page' : undefined}
            className={`flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl border px-2 text-[11px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#90e0ef]/60 sm:px-3 sm:text-xs ${
              currentView === 'qrcode'
                ? 'border-[#90e0ef] bg-white text-[#03045e] shadow-sm dark:border-[#0077b6] dark:bg-slate-800 dark:text-[#90e0ef]'
                : 'border-transparent text-slate-600 hover:border-[#90e0ef]/50 hover:bg-white hover:text-[#03045e] dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            <QrCode className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">QR Posters</span>
          </button>

          <span className="mx-1 h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-700 sm:mx-2" aria-hidden="true" />

          <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-slate-200/80 bg-white/80 p-0.5 dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex min-h-9 min-w-9 items-center justify-center rounded-lg px-1.5 text-[10px] font-extrabold tracking-wide text-[#03045e] transition-colors hover:bg-[#caf0f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077b6] dark:text-[#caf0f8] dark:hover:bg-slate-800 sm:min-w-10 sm:text-[11px]"
              title={language === 'en' ? t.switchToAmharic : language === 'am' ? t.switchToOromo : t.switchToEnglish}
              aria-label={language === 'en' ? t.switchToAmharic : language === 'am' ? t.switchToOromo : t.switchToEnglish}
            >
              {language === 'en' ? 'AM' : language === 'am' ? 'OM' : 'EN'}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex min-h-9 min-w-9 items-center justify-center rounded-lg transition-colors hover:bg-[#caf0f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077b6] dark:hover:bg-slate-800 sm:min-w-10"
              title={theme === 'dark' ? t.lightMode : t.darkMode}
              aria-label={theme === 'dark' ? t.lightMode : t.darkMode}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-500 dark:text-amber-300" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-[#0077b6]" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
