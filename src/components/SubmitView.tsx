import React, { useState } from 'react';
import { 
  AlertCircle, 
  Lightbulb, 
  Heart, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { SubmissionKind, CaseSubmission } from '../types/hospital';
import { DEPARTMENTS } from '../data/seedData';
import { useLanguage } from '../context/LanguageContext';

interface SubmitViewProps {
  onSubmitCase: (newCase: CaseSubmission) => void;
  onNavigateTrack: (ref: string) => void;
}

export const SubmitView: React.FC<SubmitViewProps> = ({ onSubmitCase, onNavigateTrack }) => {
  const { t, language, getDeptName } = useLanguage();

  const [kind, setKind] = useState<SubmissionKind>('complaint');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [rating, setRating] = useState<number>(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCase, setSubmittedCase] = useState<CaseSubmission | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate random 6-character reference code matching target format AGH-XXXXXX
  const generateRef = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `AGH-${code}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert(language === 'am' ? 'እባክዎ ርዕስና ዝርዝር ማብራሪያውን ያስገቡ' : 'Please fill in both subject and description.');
      return;
    }

    setIsSubmitting(true);
    const now = new Date().toISOString();
    const refCode = generateRef();

    const newCase: CaseSubmission = {
      id: refCode,
      reference: refCode,
      kind,
      department,
      subject: subject.trim(),
      message: message.trim(),
      rating,
      anonymous,
      name: anonymous ? undefined : name.trim() || undefined,
      email: anonymous ? undefined : email.trim() || undefined,
      phone: anonymous ? undefined : phone.trim() || undefined,
      status: 'received',
      submittedAt: now,
      updatedAt: now,
    };

    setTimeout(() => {
      onSubmitCase(newCase);
      setSubmittedCase(newCase);
      setIsSubmitting(false);
    }, 350);
  };

  const handleCopyRef = () => {
    if (!submittedCase) return;
    navigator.clipboard.writeText(submittedCase.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If submitted, show clean voucher
  if (submittedCase) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 sm:p-8 text-center space-y-5">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.thankYouTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.keepRefNotice}
            </p>
          </div>

          <div className="py-3 px-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center gap-3">
            <span className="font-mono text-xl font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
              {submittedCase.reference}
            </span>
            <button
              onClick={handleCopyRef}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Copy Reference"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              onClick={() => onNavigateTrack(submittedCase.reference)}
              className="w-full sm:w-auto px-4 py-2 min-h-[40px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>{t.trackThisCase}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setSubmittedCase(null);
                setSubject('');
                setMessage('');
                setRating(0);
              }}
              className="w-full sm:w-auto px-4 py-2 min-h-[40px] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.submitAnother}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12 px-4 space-y-6">
      {/* Clean, Focused Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t.patientRelations}
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight leading-snug">
          {t.heroTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
          {t.heroSubtitle}
        </p>
      </div>

      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs p-5 sm:p-7 space-y-5"
      >
        {/* Clean Segmented Kind Selector */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setKind('complaint')}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              kind === 'complaint'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{t.kindComplaint}</span>
          </button>

          <button
            type="button"
            onClick={() => setKind('feedback')}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              kind === 'feedback'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{t.kindSuggestion}</span>
          </button>

          <button
            type="button"
            onClick={() => setKind('compliment')}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              kind === 'compliment'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span className="truncate">{t.kindCompliment}</span>
          </button>
        </div>

        {/* Department & Experience Rating in a clean cohesive block */}
        <div className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t.chooseDept}
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {getDeptName(dept)}
                </option>
              ))}
            </select>
          </div>

          {/* Compact Star Rating */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {t.overallExperience}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(rating === star ? 0 : star)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                  title={`${star} stars`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-200 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Subject & Description */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t.subjectLabel}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t.subjectPlaceholder}
              className="w-full bg-slate-50/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 placeholder:text-slate-400 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t.messageLabel}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              className="w-full bg-slate-50/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 placeholder:text-slate-400 transition-colors"
              required
            />
          </div>
        </div>

        {/* Anonymous Option & Optional Contact */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {t.submitAnonymously}
            </span>
          </label>

          {!anonymous ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.nameLabel}
                  className="w-full bg-slate-50/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 placeholder:text-slate-400"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailLabel}
                  className="w-full bg-slate-50/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 placeholder:text-slate-400"
                />
              </div>

              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phoneLabel}
                  className="w-full bg-slate-50/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 placeholder:text-slate-400"
                />
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic pl-6">
              {t.anonymousNote}
            </p>
          )}
        </div>

        {/* Clean Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? t.submitting : t.submitButton}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
