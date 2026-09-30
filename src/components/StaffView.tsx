import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Search, 
  Lock, 
  Star, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  X, 
  UserPlus, 
  LogOut, 
  AlertCircle,
  Mail,
  User,
  Phone,
  BarChart3
} from 'lucide-react';
import { CaseSubmission, StaffUser, SubmissionStatus } from '../types/hospital';
import { DEPARTMENTS } from '../data/seedData';
import { useLanguage } from '../context/LanguageContext';
import { StaffAnalyticsSummary } from './StaffAnalyticsSummary';

interface StaffViewProps {
  cases: CaseSubmission[];
  onUpdateCase: (updated: CaseSubmission) => void;
  currentUser: StaffUser | null;
  onSignIn: (user: StaffUser) => void;
  onSignOut: () => void;
  staffList: StaffUser[];
  onAddStaff: (user: StaffUser) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  cases,
  onUpdateCase,
  currentUser,
  onSignIn,
  onSignOut,
  staffList,
  onAddStaff,
}) => {
  const { t, language, getDeptName } = useLanguage();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  
  // Dashboard states
  const [statusFilter, setStatusFilter] = useState<'all' | 'received' | 'in_review' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCharts, setShowCharts] = useState(true);
  
  // Modals
  const [selectedCase, setSelectedCase] = useState<CaseSubmission | null>(null);
  const [isStaffAccessOpen, setIsStaffAccessOpen] = useState(false);
  const [newColleagueEmail, setNewColleagueEmail] = useState('');

  // Editing case in modal
  const [editStatus, setEditStatus] = useState<SubmissionStatus>('received');
  const [editResponse, setEditResponse] = useState('');

  const counts = useMemo(() => {
    return {
      all: cases.length,
      received: cases.filter(c => c.status === 'received').length,
      in_review: cases.filter(c => c.status === 'in_review').length,
      resolved: cases.filter(c => c.status === 'resolved').length,
    };
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchRef = c.reference.toLowerCase().includes(q);
        const matchSubj = c.subject.toLowerCase().includes(q);
        const matchMsg = c.message.toLowerCase().includes(q);
        const matchDept = c.department.toLowerCase().includes(q);
        const matchName = c.name?.toLowerCase().includes(q);
        if (!matchRef && !matchSubj && !matchMsg && !matchDept && !matchName) return false;
      }
      return true;
    });
  }, [cases, statusFilter, searchQuery]);

  const handleOpenReview = (c: CaseSubmission) => {
    setSelectedCase(c);
    setEditStatus(c.status);
    setEditResponse(c.response || '');
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    const now = new Date().toISOString();
    const updated: CaseSubmission = {
      ...selectedCase,
      status: editStatus,
      response: editResponse.trim() || undefined,
      respondedAt: editResponse.trim() ? now : selectedCase.respondedAt,
      updatedAt: now,
    };

    onUpdateCase(updated);
    setSelectedCase(null);
  };

  const handleApplyTemplate = (type: 'received' | 'investigating' | 'resolved') => {
    switch (type) {
      case 'received':
        setEditResponse('Thank you for contacting Patient Relations. Your submission has been received and routed to the department clinical supervisor for inquiry.');
        break;
      case 'investigating':
        setEditResponse('Our Quality & Patient Experience Committee is currently reviewing the medical logs and staff shift roster for this visit. We will follow up shortly.');
        break;
      case 'resolved':
        setEditResponse('Thank you for your patience. A comprehensive clinical review was conducted and corrective action has been implemented to resolve this concern.');
        break;
    }
  };

  const handleAddStaffMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColleagueEmail.trim()) return;
    const email = newColleagueEmail.trim().toLowerCase();
    onAddStaff({
      email,
      name: email.split('@')[0],
      role: 'staff',
      addedAt: new Date().toISOString(),
    });
    setNewColleagueEmail('');
  };

  // If NOT signed in, show Staff Sign In Card
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 text-center">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              {t.staffSignIn}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {t.staffSignInDesc}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (loginEmail.trim()) {
                onSignIn({
                  email: loginEmail.trim().toLowerCase(),
                  name: loginEmail.split('@')[0],
                  role: 'staff',
                  addedAt: new Date().toISOString(),
                });
              }
            }}
            className="space-y-3 text-left"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={t.staffEmailPlaceholder}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 min-h-[44px] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
            >
              {t.signInBtn}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 block">Quick Demo Sign-In:</span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onSignIn({ email: 'admin@afranhospital.com', name: 'Patient Relations Lead', role: 'admin', addedAt: new Date().toISOString() })}
                className="w-full py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {t.demoAdminBtn} (admin@afranhospital.com)
              </button>
              <button
                type="button"
                onClick={() => onSignIn({ email: 'colleague@afranhospital.com', name: 'Quality Officer', role: 'staff', addedAt: new Date().toISOString() })}
                className="w-full py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {t.demoStaffBtn} (colleague@afranhospital.com)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 space-y-6 sm:space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            {t.patientRelations}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white leading-tight">
            {t.caseDashboard}
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`px-3 py-2 min-h-[40px] text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 shadow-2xs ${
              showCharts
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{showCharts ? t.hideCharts : t.showCharts}</span>
          </button>

          <button
            onClick={() => setIsStaffAccessOpen(true)}
            className="px-3.5 py-2 min-h-[40px] text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.staffAccessTitle}</span>
          </button>

          <button
            onClick={onSignOut}
            className="px-3.5 py-2 min-h-[40px] text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.navSignOut}</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Dashboard (Recharts Visualization) */}
      {showCharts && (
        <StaffAnalyticsSummary cases={cases} />
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl overflow-x-auto no-scrollbar">
            {(['all', 'received', 'in_review', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>
                  {st === 'all' && t.filterAll}
                  {st === 'received' && t.filterReceived}
                  {st === 'in_review' && t.filterInReview}
                  {st === 'resolved' && t.filterResolved}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                  {counts[st]}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchCasesPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 min-h-[40px]"
            />
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {filteredCases.length > 0 ? (
          filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => handleOpenReview(c)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500 dark:hover:border-indigo-500 transition-all p-5 cursor-pointer space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                    {c.reference}
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {getDeptName(c.department)}
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(c.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-semibold capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {c.kind}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      c.status === 'received'
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : c.status === 'in_review'
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {c.status === 'received' && t.statusReceived}
                    {c.status === 'in_review' && t.statusInReview}
                    {c.status === 'resolved' && t.statusResolved}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {c.subject}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {c.message}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <div>
                  {c.anonymous ? (
                    <span>{t.submittedAnonymously}</span>
                  ) : (
                    <span>
                      {c.name || 'Disclosed'} {c.email ? `(${c.email})` : ''} {c.phone ? `· ${c.phone}` : ''}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {c.response && (
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Responded</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenReview(c);
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {t.reviewCase}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {t.noCasesHere}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.newSubmissionsAuto}
            </p>
          </div>
        )}
      </div>

      {/* Review Case Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedCase.reference}
                </span>
                <span className="text-xs capitalize text-slate-500">
                  ({selectedCase.kind})
                </span>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              {/* Incident summary */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {getDeptName(selectedCase.department)}
                  </span>
                  <span className="font-mono text-slate-400">
                    {new Date(selectedCase.submittedAt).toLocaleString()}
                  </span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {selectedCase.subject}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedCase.message}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                  {selectedCase.anonymous ? (
                    <span>{t.submittedAnonymously}</span>
                  ) : (
                    <span>
                      Name: <strong>{selectedCase.name || 'N/A'}</strong> · Email: {selectedCase.email || 'N/A'} · Phone: {selectedCase.phone || 'N/A'}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <form onSubmit={handleSaveReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.statusLabel}
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as SubmissionStatus)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  >
                    <option value="received">{t.statusReceived}</option>
                    <option value="in_review">{t.statusInReview}</option>
                    <option value="resolved">{t.statusResolved}</option>
                  </select>
                </div>

                {/* Response Textarea */}
                <div className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t.responseVisibleNote}
                    </label>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-slate-400">Templates:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate('received')}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300"
                      >
                        Received
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate('investigating')}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300"
                      >
                        Reviewing
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate('resolved')}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300"
                      >
                        Resolved
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={editResponse}
                    onChange={(e) => setEditResponse(e.target.value)}
                    placeholder="Write a clear, courteous update or resolution..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedCase(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    {t.close}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 min-h-[40px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    {t.saveChanges}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Staff Access Modal */}
      {isStaffAccessOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                {t.staffAccessTitle}
              </h2>
              <button
                onClick={() => setIsStaffAccessOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.staffAccessDesc}
              </p>

              <form onSubmit={handleAddStaffMember} className="flex gap-2">
                <input
                  type="email"
                  value={newColleagueEmail}
                  onChange={(e) => setNewColleagueEmail(e.target.value)}
                  placeholder="colleague@afranhospital.com"
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 min-h-[40px]"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 min-h-[40px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors shrink-0"
                >
                  {t.addStaffBtn}
                </button>
              </form>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Staff Directory
                </span>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto">
                  {staffList.map((st) => (
                    <div key={st.email} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">{st.name}</span>
                        <span className="text-[11px] text-slate-400">{st.email}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-semibold">
                        {st.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
