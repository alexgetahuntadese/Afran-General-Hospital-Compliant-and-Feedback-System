import React, { useState, useEffect } from 'react';
import { Search, Star, AlertCircle, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CaseSubmission } from '../types/hospital';
import { useLanguage } from '../context/LanguageContext';

interface TrackViewProps {
  initialRef?: string;
  cases: CaseSubmission[];
}

export const TrackView: React.FC<TrackViewProps> = ({ initialRef, cases }) => {
  const { t, language, getDeptName } = useLanguage();

  const [query, setQuery] = useState(initialRef || '');
  const [activeCase, setActiveCase] = useState<CaseSubmission | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialRef) {
      setQuery(initialRef);
      handleLookup(initialRef);
    }
  }, [initialRef, cases]);

  const handleLookup = (refCode: string) => {
    setHasSearched(true);
    const cleaned = refCode.trim().toUpperCase();
    if (!cleaned) {
      setActiveCase(null);
      return;
    }
    const found = cases.find(c => c.reference.toUpperCase() === cleaned || c.id.toUpperCase() === cleaned);
    setActiveCase(found || null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(query);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{t.statusReceived}</span>
          </span>
        );
      case 'in_review':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>{t.statusInReview}</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{t.statusResolved}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12 px-4 space-y-6">
      {/* Title */}
      <div className="space-y-1 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t.patientRelations}
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight leading-snug">
          {t.trackHeading}
        </h1>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.trackPlaceholder}
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 min-h-[44px] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 font-mono uppercase tracking-wider transition-colors shadow-2xs"
        />
        <button
          type="submit"
          className="px-5 py-2.5 min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>{t.trackButton}</span>
        </button>
      </form>

      {/* Case Details View */}
      {activeCase ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs p-5 sm:p-7 space-y-5">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 block tracking-wider">
                {activeCase.reference}
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                <span>{getDeptName(activeCase.department)}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{new Date(activeCase.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="self-start sm:self-auto">
              {getStatusBadge(activeCase.status)}
            </div>
          </div>

          {/* Rating */}
          {activeCase.rating > 0 && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= activeCase.rating
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Narrative */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {activeCase.subject}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {activeCase.message}
            </p>
          </div>

          {/* Submitter */}
          <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            {activeCase.anonymous ? (
              <span>{t.submittedAnonymously}</span>
            ) : (
              <span>Submitted by: <strong>{activeCase.name || 'Disclosed patient'}</strong></span>
            )}
          </div>

          {/* Response from Patient Relations */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{t.responseFromPR}</span>
            </div>

            {activeCase.response ? (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                {activeCase.response}
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                {t.awaitingResponse}
              </p>
            )}

            {activeCase.respondedAt && (
              <div className="text-[10px] text-slate-400 font-mono text-right">
                {new Date(activeCase.respondedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {t.noCaseFound}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.checkRefAgain}
          </p>
        </div>
      ) : null}
    </div>
  );
};
