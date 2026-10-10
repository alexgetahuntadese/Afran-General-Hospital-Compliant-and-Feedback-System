import React, { useState, useMemo, useEffect } from 'react';
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
  BarChart3,
  Mic,
  Pencil,
  KeyRound,
  UserCheck,
  UserX,
  Trash2,
} from 'lucide-react';
import { CaseSubmission, StaffAccountAction, StaffRole, StaffUser, SubmissionStatus } from '../types/hospital';
import { useLanguage } from '../context/LanguageContext';
import { StaffAnalyticsSummary } from './StaffAnalyticsSummary';
import { getDepartmentQuestions, LIKELIHOOD_OPTIONS, SATISFACTION_OPTIONS } from '../data/questionnaires';
import { DEPARTMENTS } from '../data/seedData';
import { getComplaintAudioUrl } from '../lib/data';

interface StaffViewProps {
  cases: CaseSubmission[];
  onUpdateCase: (updated: CaseSubmission) => Promise<void>;
  currentUser: StaffUser | null;
  onSignIn: (username: string, password: string) => Promise<void>;
  onSignOut: () => void;
  staffList: StaffUser[];
  onManageStaffAccount: (input: StaffAccountAction) => Promise<void>;
  onCreateStaffAccount: (input: { username: string; fullName: string; password: string; role: StaffRole; department?: string }) => Promise<void>;
  authError: string;
  dataError: string;
}

export const StaffView: React.FC<StaffViewProps> = ({
  cases,
  onUpdateCase,
  currentUser,
  onSignIn,
  onSignOut,
  staffList,
  onManageStaffAccount,
  onCreateStaffAccount,
  authError,
  dataError,
}) => {
  const { t, language, getDeptName } = useLanguage();
  const canManageStaff = currentUser?.role === 'superadmin';
  const canReadStaffDirectory = canManageStaff || currentUser?.role === 'customer_service_manager';
  const canAssignCases = canManageStaff || currentUser?.role === 'customer_service_manager';

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState('');
  
  // Dashboard states
  const [statusFilter, setStatusFilter] = useState<'all' | 'received' | 'in_review' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCharts, setShowCharts] = useState(true);
  
  // Modals
  const [selectedCase, setSelectedCase] = useState<CaseSubmission | null>(null);
  const [isStaffAccessOpen, setIsStaffAccessOpen] = useState(false);
  const [staffAccessTab, setStaffAccessTab] = useState<'create' | 'directory'>('create');
  const [staffAccountDrafts, setStaffAccountDrafts] = useState<Record<string, { username: string; fullName: string; role: StaffRole; department: string }>>({});
  const [staffPasswordDrafts, setStaffPasswordDrafts] = useState<Record<string, string>>({});
  const [editingStaffUsername, setEditingStaffUsername] = useState('');
  const [staffSaveUsername, setStaffSaveUsername] = useState('');
  const [staffSaveError, setStaffSaveError] = useState('');
  const [staffSaveSuccess, setStaffSaveSuccess] = useState('');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffPasswordConfirmation, setNewStaffPasswordConfirmation] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('staff');
  const [newStaffDepartment, setNewStaffDepartment] = useState('');
  const [isCreatingStaff, setIsCreatingStaff] = useState(false);

  // Editing case in modal
  const [editStatus, setEditStatus] = useState<SubmissionStatus>('received');
  const [editAssignedDepartment, setEditAssignedDepartment] = useState('');
  const [editResponse, setEditResponse] = useState('');
  const [editEscalated, setEditEscalated] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [complaintAudioUrl, setComplaintAudioUrl] = useState('');
  const [complaintAudioError, setComplaintAudioError] = useState('');
  const [isLoadingComplaintAudio, setIsLoadingComplaintAudio] = useState(false);

  useEffect(() => {
    setSelectedCase(null);
    setStatusFilter('all');
    setSearchQuery('');
    setSaveError('');
  }, [currentUser?.username, currentUser?.role, currentUser?.department]);

  useEffect(() => {
    let active = true;
    setComplaintAudioUrl('');
    setComplaintAudioError('');
    if (!selectedCase?.audioPath) {
      setIsLoadingComplaintAudio(false);
      return () => {
        active = false;
      };
    }

    setIsLoadingComplaintAudio(true);
    void getComplaintAudioUrl(selectedCase.audioPath)
      .then((url) => {
        if (active) setComplaintAudioUrl(url);
      })
      .catch((error: unknown) => {
        if (active) {
          setComplaintAudioError(error instanceof Error ? error.message : 'Unable to load the complaint recording.');
        }
      })
      .finally(() => {
        if (active) setIsLoadingComplaintAudio(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCase?.audioPath]);

  const visibleCases = useMemo(() => {
    if (currentUser?.role === 'ceo') return cases.filter((c) => c.escalated);
    if (currentUser?.role === 'department_head') {
      return cases.filter((c) => (c.assignedDepartment ?? c.department) === currentUser.department);
    }
    return currentUser?.role === 'customer_service_manager' || currentUser?.role === 'superadmin' ? cases : [];
  }, [cases, currentUser]);

  const counts = useMemo(() => {
    return {
      all: visibleCases.length,
      received: visibleCases.filter(c => c.status === 'received').length,
      in_review: visibleCases.filter(c => c.status === 'in_review').length,
      resolved: visibleCases.filter(c => c.status === 'resolved').length,
      seen: visibleCases.filter(c => c.departmentHeadChecked).length,
    };
  }, [visibleCases]);

  const filteredCases = useMemo(() => {
    return visibleCases.filter(c => {
      if (currentUser?.role !== 'ceo' && statusFilter !== 'all' && c.status !== statusFilter) return false;
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
  }, [visibleCases, statusFilter, searchQuery, currentUser?.role]);

  const handleOpenReview = async (c: CaseSubmission) => {
    let reviewCase = c;

    // Auto-mark as checked by department head when they open the case
    if (currentUser?.role === 'department_head' && !c.departmentHeadChecked) {
      reviewCase = {
        ...c,
        departmentHeadChecked: true,
        departmentHeadCheckedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      try {
        await onUpdateCase(reviewCase);
      } catch (error) {
        console.error('Failed to mark as checked by department head:', error);
      }
    }

    setSelectedCase(reviewCase);
    setEditStatus(reviewCase.status);
    setEditAssignedDepartment(reviewCase.assignedDepartment ?? reviewCase.department);
    setEditResponse(reviewCase.response || '');
    setEditEscalated(Boolean(reviewCase.escalated));
  };

  const getStaffDraft = (staff: StaffUser) => staffAccountDrafts[staff.username] ?? {
    username: staff.username,
    fullName: staff.name,
    role: staff.role,
    department: staff.department ?? '',
  };

  const handleSaveStaffAccount = async (staff: StaffUser) => {
    const draft = getStaffDraft(staff);
    const newUsername = draft.username.trim().toLowerCase();
    if (!draft.fullName.trim()) {
      setStaffSaveError(t.staffEnterNameUsername);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUsername)) {
      setStaffSaveError(t.staffInvalidUsername);
      return;
    }
    if (draft.role === 'department_head' && !draft.department) {
      setStaffSaveError(t.staffDepartmentRequired);
      return;
    }
    setStaffSaveUsername(staff.username);
    setStaffSaveError('');
    setStaffSaveSuccess('');
    try {
      await onManageStaffAccount({
        action: 'update',
        username: staff.username,
        newUsername,
        fullName: draft.fullName.trim(),
        role: draft.role,
        department: draft.role === 'department_head' ? draft.department : undefined,
      });
      setStaffAccountDrafts((drafts) => {
        const next = { ...drafts };
        delete next[staff.username];
        return next;
      });
      setEditingStaffUsername('');
      setStaffSaveSuccess(t.staffUpdateAccount);
    } catch (error) {
      setStaffSaveError(error instanceof Error ? error.message : t.staffAccountUpdateError);
    } finally {
      setStaffSaveUsername('');
    }
  };

  const handleResetStaffPassword = async (staff: StaffUser) => {
    const password = staffPasswordDrafts[staff.username] ?? '';
    if (password.length < 12) {
      setStaffSaveError(t.staffPasswordTooShort);
      return;
    }
    setStaffSaveUsername(staff.username);
    setStaffSaveError('');
    setStaffSaveSuccess('');
    try {
      await onManageStaffAccount({ action: 'reset_password', username: staff.username, password });
      setStaffPasswordDrafts((drafts) => ({ ...drafts, [staff.username]: '' }));
      setStaffSaveSuccess(t.staffPasswordResetDone);
    } catch (error) {
      setStaffSaveError(error instanceof Error ? error.message : t.staffPasswordResetError);
    } finally {
      setStaffSaveUsername('');
    }
  };

  const handleSetStaffActive = async (staff: StaffUser) => {
    const confirmMessage = staff.isActive ? t.staffConfirmDeactivate : t.staffConfirmActivate;
    if (!window.confirm(`${confirmMessage}\n${staff.name} (${staff.username})`)) return;
    setStaffSaveUsername(staff.username);
    setStaffSaveError('');
    setStaffSaveSuccess('');
    try {
      await onManageStaffAccount({ action: 'set_active', username: staff.username, isActive: !staff.isActive });
      setStaffSaveSuccess(staff.isActive ? t.staffAccountInactive : t.staffAccountActive);
    } catch (error) {
      setStaffSaveError(error instanceof Error ? error.message : t.staffAccountUpdateError);
    } finally {
      setStaffSaveUsername('');
    }
  };

  const handleDeleteStaffAccount = async (staff: StaffUser) => {
    if (!window.confirm(`${t.staffDeleteConfirm}\n${staff.name} (${staff.username})`)) return;
    setStaffSaveUsername(staff.username);
    setStaffSaveError('');
    setStaffSaveSuccess('');
    try {
      await onManageStaffAccount({ action: 'delete', username: staff.username });
      setStaffSaveSuccess(t.staffDeleteAccount);
    } catch (error) {
      setStaffSaveError(error instanceof Error ? error.message : t.staffAccountDeleteError);
    } finally {
      setStaffSaveUsername('');
    }
  };

  const handleCreateStaff = async (event: React.FormEvent) => {
    event.preventDefault();
    const username = newStaffUsername.trim().toLowerCase();
    if (!username || !newStaffName.trim()) {
      setStaffSaveError(t.staffEnterNameUsername);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      setStaffSaveError(t.staffInvalidUsername);
      return;
    }
    if (newStaffPassword.length < 12) {
      setStaffSaveError(t.staffPasswordTooShort);
      return;
    }
    if (newStaffPassword !== newStaffPasswordConfirmation) {
      setStaffSaveError(t.staffPasswordsMismatch);
      return;
    }
    if (newStaffRole === 'department_head' && !newStaffDepartment) {
      setStaffSaveError(t.staffDepartmentRequired);
      return;
    }
    setIsCreatingStaff(true);
    setStaffSaveError('');
    try {
      await onCreateStaffAccount({
        username,
        fullName: newStaffName,
        password: newStaffPassword,
        role: newStaffRole,
        department: newStaffRole === 'department_head' ? newStaffDepartment : undefined,
      });
      setNewStaffUsername('');
      setNewStaffName('');
      setNewStaffPassword('');
      setNewStaffPasswordConfirmation('');
      setNewStaffRole('staff');
      setNewStaffDepartment('');
      setStaffAccessTab('directory');
    } catch (error) {
      setStaffSaveError(error instanceof Error ? error.message : t.staffCreateError);
    } finally {
      setIsCreatingStaff(false);
    }
  };

  const getRoleLabel = (role: StaffRole) => {
    switch (role) {
      case 'superadmin': return t.roleSuperadmin;
      case 'customer_service_manager': return t.roleCustomerServiceManager;
      case 'department_head': return t.roleDepartmentHead;
      case 'ceo': return t.roleCeo;
      default: return t.roleStaff;
    }
  };

  const getSignInErrorMessage = (error: unknown): string => {
    const message = error instanceof Error ? error.message : 'Unable to sign in.';
    if (/invalid login credentials/i.test(message)) return 'Invalid username or password.';
    return message;
  };

  const handleApplyTemplate = (type: 'received' | 'investigating' | 'resolved') => {
    switch (type) {
      case 'received':
        setEditResponse(t.templateReceivedMessage);
        break;
      case 'investigating':
        setEditResponse(t.templateReviewingMessage);
        break;
      case 'resolved':
        setEditResponse(t.templateResolvedMessage);
        break;
    }
  };

  // If NOT signed in, show Staff Sign In Card
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-gradient-to-br from-white via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/30 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(7,89,133,0.08)] p-6 sm:p-8 space-y-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-700 to-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-900/15">
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
            onSubmit={async (e) => {
              e.preventDefault();
              const normalizedUsername = loginUsername.trim().toLowerCase();
              const isUsername = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedUsername);

              if (!isUsername || !loginPassword) {
                setSignInError('Enter a valid username and password.');
                return;
              }

              setIsSigningIn(true);
              setSignInError('');
              try {
                await onSignIn(normalizedUsername, loginPassword);
                setLoginPassword('');
              } catch (error) {
                setSignInError(getSignInErrorMessage(error));
              } finally {
                setIsSigningIn(false);
              }
            }}
            className="space-y-3 text-left"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.staffUsername}
              </label>
              <input
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                spellCheck={false}
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder={t.staffUsernamePlaceholder}
                className="premium-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.staffPassword}
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="premium-input w-full"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full py-2.5 min-h-[48px] bg-gradient-to-r from-sky-800 to-teal-700 hover:from-sky-900 hover:to-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/25 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm shadow-sky-900/15"
            >
              {isSigningIn ? t.signingIn : t.signInBtn}
            </button>
          </form>

          <p className="text-xs text-slate-500 dark:text-slate-400">{t.passwordSignIn}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.managerProvisionNote}</p>
          {(authError || signInError) && (
            <p className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              {signInError || authError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 space-y-6 sm:space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
            {t.patientRelations}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            {t.caseDashboard}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {currentUser.role === 'superadmin'
              ? t.roleSuperadmin
              : currentUser.role === 'ceo'
              ? t.ceoScope
              : currentUser.role === 'department_head'
              ? `${t.roleDepartmentHead}: ${getDeptName(currentUser.department || '')} · ${t.departmentHeadScope}`
              : currentUser.role === 'customer_service_manager'
              ? t.managerScope
              : t.staffScope}
          </p>
        </div>

        {dataError && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
            {dataError}
          </p>
        )}

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {(currentUser.role === 'superadmin' || currentUser.role === 'customer_service_manager' || currentUser.role === 'department_head') && <button
            onClick={() => setShowCharts(!showCharts)}
            className={`px-3 py-2 min-h-[40px] text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 shadow-2xs ${
              showCharts
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{showCharts ? t.hideCharts : t.showCharts}</span>
          </button>}

          {canReadStaffDirectory && <button
            onClick={() => setIsStaffAccessOpen(true)}
            className="px-3.5 py-2 min-h-[40px] text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.staffAccessTitle}</span>
          </button>}

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
      {showCharts && (currentUser.role === 'superadmin' || currentUser.role === 'customer_service_manager' || currentUser.role === 'department_head') && (
        <StaffAnalyticsSummary
          cases={visibleCases}
          departmentScope={currentUser.role === 'department_head' ? currentUser.department : undefined}
        />
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          {currentUser.role !== 'ceo' && <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl overflow-x-auto no-scrollbar">
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
          </div>}

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchCasesPlaceholder}
              className="premium-input w-full pl-9"
            />
          </div>
          {(currentUser.role === 'customer_service_manager' || currentUser.role === 'superadmin') && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>{counts.seen} seen by department heads</span>
            </div>
          )}
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {filteredCases.length > 0 ? (
          filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => currentUser.role !== 'ceo' && handleOpenReview(c)}
              className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-all p-5 space-y-3 ${currentUser.role !== 'ceo' ? 'cursor-pointer hover:border-blue-500 dark:hover:border-blue-500' : ''}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-300 tracking-wider">
                    {c.reference}
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {getDeptName(c.department)}
                  </span>
                  {c.assignedDepartment && c.assignedDepartment !== c.department && (
                    <>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">→</span>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        {getDeptName(c.assignedDepartment)}
                      </span>
                    </>
                  )}
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(c.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {c.escalated && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      {t.escalated}
                    </span>
                  )}
                  {c.departmentHeadChecked && (
                    <span
                      title={c.departmentHeadCheckedAt ? `Seen ${new Date(c.departmentHeadCheckedAt).toLocaleString()}` : 'Seen by department head'}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Seen by dept. head</span>
                    </span>
                  )}
                  <span className="text-[11px] font-semibold capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {c.kind === 'complaint' ? t.kindComplaint : t.kindFeedback}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      c.status === 'received'
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : c.status === 'in_review'
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
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
                      {c.name || t.undisclosedName} {c.email ? `(${c.email})` : ''} {c.phone ? `· ${c.phone}` : ''}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {c.response && (
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.respondedLabel}</span>
                    </span>
                  )}
                  {currentUser.role !== 'ceo' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenReview(c);
                      }}
                      className="text-xs font-semibold text-blue-700 dark:text-blue-300 hover:underline"
                    >
                      {t.reviewCase}
                    </button>
                  )}
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
                <span className="font-mono text-base font-bold text-blue-700 dark:text-blue-300">
                  {selectedCase.reference}
                </span>
                <span className="text-xs capitalize text-slate-500">
                  ({selectedCase.kind === 'complaint' ? t.kindComplaint : t.kindFeedback})
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

              {selectedCase.audioPath && (
                <section className="space-y-2 rounded-xl border border-sky-200 bg-sky-50/70 p-4 dark:border-sky-900/60 dark:bg-sky-950/25">
                  <h3 className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                    <Mic className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                    {t.staffVoiceRecordingTitle}
                  </h3>
                  {isLoadingComplaintAudio && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.secureAudioLoading}
                    </p>
                  )}
                  {complaintAudioError && (
                    <p role="alert" className="text-xs text-rose-700 dark:text-rose-300">
                      {complaintAudioError}
                    </p>
                  )}
                  {complaintAudioUrl && (
                    <audio controls preload="none" src={complaintAudioUrl} className="w-full" />
                  )}
                  <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {t.audioPrivacyNotice}
                  </p>
                </section>
              )}

              {selectedCase.questionnaireAnswers && (
                <section className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    {t.staffQuestionnaireTitle}
                  </h3>
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
                    {getDepartmentQuestions(selectedCase.department)
                      .filter(({ id }) => selectedCase.questionnaireAnswers?.[id] !== undefined)
                      .map((question, index) => (
                        <div key={question.id} className="flex items-start justify-between gap-4 p-3">
                          <span className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            {index + 1}. {question[language]}
                          </span>
                          <span className="shrink-0 rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800 dark:bg-blue-950/50 dark:text-blue-200">
                            {(question.scale === 'likelihood' ? LIKELIHOOD_OPTIONS : SATISFACTION_OPTIONS)
                              .find(({ value }) => value === selectedCase.questionnaireAnswers?.[question.id])?.[language]}
                          </span>
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* Department Head Verification Status */}
              {selectedCase.departmentHeadChecked && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Seen / Checked by Department Head</span>
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    This complaint has been reviewed and verified by the department head.
                  </div>
                  {selectedCase.departmentHeadCheckedAt && (
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-500 font-mono text-right">
                      Verified: {new Date(selectedCase.departmentHeadCheckedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Status Update */}
              <form onSubmit={async (e) => {
                e.preventDefault();
                setSaveError('');
                setIsSaving(true);
                try {
                  await onUpdateCase({
                    ...selectedCase,
                    status: editStatus,
                    assignedDepartment: canAssignCases ? editAssignedDepartment : selectedCase.assignedDepartment,
                    assignedAt: canAssignCases && editAssignedDepartment !== (selectedCase.assignedDepartment ?? selectedCase.department)
                      ? new Date().toISOString()
                      : selectedCase.assignedAt,
                    escalated: editEscalated,
                    response: editResponse.trim() || undefined,
                    respondedAt: editResponse.trim() ? new Date().toISOString() : selectedCase.respondedAt,
                    updatedAt: new Date().toISOString(),
                  });
                  setSelectedCase(null);
                } catch (error) {
                  setSaveError(error instanceof Error ? error.message : 'Unable to save case changes.');
                } finally {
                  setIsSaving(false);
                }
              }} className="space-y-4">
                {saveError && (
                  <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                    {saveError}
                  </p>
                )}
                <label className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs font-semibold text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
                  <input
                    type="checkbox"
                    checked={editEscalated}
                    onChange={(e) => setEditEscalated(e.target.checked)}
                    className="h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                  />
                  {t.markEscalated}
                </label>
                <div>
                  {canAssignCases && (
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t.staffDepartmentLabel} · Assigned
                      </label>
                      <select
                        value={editAssignedDepartment}
                        onChange={(e) => setEditAssignedDepartment(e.target.value)}
                        className="premium-input w-full"
                      >
                        {DEPARTMENTS.map((department) => (
                          <option key={department} value={department}>{getDeptName(department)}</option>
                        ))}
                      </select>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        The selected department head will see this case in their queue.
                      </p>
                    </div>
                  )}
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.statusLabel}
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as SubmissionStatus)}
                    className="premium-input w-full"
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
                      <span className="text-slate-400">{t.responseTemplates}</span>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate('received')}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300"
                      >
                        {t.templateReceived}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate('investigating')}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300"
                      >
                        {t.templateReviewing}
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
                    className="premium-input w-full"
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
                    disabled={isSaving}
                    className="px-5 py-2 min-h-[44px] bg-blue-600 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:opacity-60 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    {isSaving ? t.saving : t.saveChanges}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Staff Access Modal */}
      {isStaffAccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-3 backdrop-blur-xs sm:p-4">
          <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:max-h-[calc(100dvh-2rem)]">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                {t.staffAccessTitle}
              </h2>
              <button
                onClick={() => {
                  setIsStaffAccessOpen(false);
                  setNewStaffPassword('');
                  setNewStaffPasswordConfirmation('');
                }}
                disabled={isCreatingStaff}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6 text-xs sm:text-sm">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {canManageStaff ? t.staffAccessDesc : t.staffAccessManagerDesc}
              </p>

              {canManageStaff && (
                <div role="tablist" aria-label={t.staffAccessTitle} className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                  <button
                    type="button"
                    role="tab"
                    id="staff-create-tab"
                    aria-selected={staffAccessTab === 'create'}
                    aria-controls="staff-access-panel"
                    onClick={() => {
                      setStaffAccessTab('create');
                      setStaffSaveError('');
                    }}
                    className={`min-h-10 rounded-lg px-3 text-xs font-semibold transition-colors ${staffAccessTab === 'create' ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-blue-300' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                  >
                    {t.staffAccessCreateTab}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="staff-directory-tab"
                    aria-selected={staffAccessTab === 'directory'}
                    aria-controls="staff-access-panel"
                    onClick={() => setStaffAccessTab('directory')}
                    className={`min-h-10 rounded-lg px-3 text-xs font-semibold transition-colors ${staffAccessTab === 'directory' ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-blue-300' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                  >
                    {t.staffAccessDirectoryTab}
                  </button>
                </div>
              )}

              {staffSaveError && (
                <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                  {staffSaveError}
                </p>
              )}
              {staffSaveSuccess && (
                <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {staffSaveSuccess}
                </p>
              )}

              {canManageStaff && staffAccessTab === 'create' && (
                <div id="staff-access-panel" role="tabpanel" aria-labelledby="staff-create-tab">
                <form onSubmit={(event) => void handleCreateStaff(event)} className="space-y-2 rounded-xl border border-blue-100 bg-blue-50/60 p-3 dark:border-blue-900/60 dark:bg-blue-950/20">
                  <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">{t.staffCreateAccount}</span>
                  <label className="block space-y-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <span>{t.staffFullName}</span>
                    <input value={newStaffName} onChange={(event) => setNewStaffName(event.target.value)} autoComplete="name" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" required />
                  </label>
                  <label className="block space-y-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <span>{t.staffUsername}</span>
                    <input type="text" autoCapitalize="none" autoComplete="username" spellCheck={false} value={newStaffUsername} onChange={(event) => setNewStaffUsername(event.target.value)} placeholder="username@afran.com" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" required />
                  </label>
                  <label className="block space-y-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <span>{t.staffInitialPassword}</span>
                    <input type="password" autoComplete="new-password" minLength={12} value={newStaffPassword} onChange={(event) => setNewStaffPassword(event.target.value)} placeholder={t.staffPasswordMinLength} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" required />
                  </label>
                  <label className="block space-y-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <span>{t.staffConfirmPassword}</span>
                    <input type="password" autoComplete="new-password" minLength={12} value={newStaffPasswordConfirmation} onChange={(event) => setNewStaffPasswordConfirmation(event.target.value)} placeholder={t.staffConfirmPasswordHint} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" required />
                  </label>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.staffPasswordShareNote}</p>
                  <div className="flex gap-2">
                    <label className="min-w-0 flex-1 space-y-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      <span>{t.staffRoleLabel}</span>
                      <select value={newStaffRole} onChange={(event) => setNewStaffRole(event.target.value as StaffRole)} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                      <option value="staff">{t.roleStaff}</option>
                      <option value="superadmin">{t.roleSuperadmin}</option>
                      <option value="department_head">{t.roleDepartmentHead}</option>
                      <option value="customer_service_manager">{t.roleCustomerServiceManager}</option>
                      <option value="ceo">{t.roleCeo}</option>
                      </select>
                    </label>
                    {newStaffRole === 'department_head' && (
                      <label className="min-w-0 flex-1 space-y-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        <span>{t.staffDepartmentLabel}</span>
                        <select value={newStaffDepartment} onChange={(event) => setNewStaffDepartment(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                        <option value="">{t.staffDepartmentLabel}</option>
                        {DEPARTMENTS.map((department) => <option key={department} value={department}>{department}</option>)}
                        </select>
                      </label>
                    )}
                  </div>
                  {newStaffRole === 'department_head' && (
                    <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                      {t.staffDepartmentAccessNote}
                    </p>
                  )}
                  <button type="submit" disabled={isCreatingStaff} className="min-h-10 w-full rounded-lg bg-blue-700 px-4 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-60">
                    {isCreatingStaff ? t.staffCreatingAccount : t.staffCreateAccountButton}
                  </button>
                </form>
                </div>
              )}

              {(!canManageStaff || staffAccessTab === 'directory') && (
              <div id="staff-access-panel" role={canManageStaff ? 'tabpanel' : undefined} aria-labelledby={canManageStaff ? 'staff-directory-tab' : undefined} className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t.staffDirectoryTitle}
                </span>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {staffList.map((st) => (
                    <div key={st.username} className={`space-y-3 py-3 text-xs ${!st.isActive ? 'opacity-70' : ''}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-white block">{st.name}</span>
                          <span className="text-[11px] text-slate-400">{st.username}</span>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${st.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                            {st.isActive ? t.staffAccountActive : t.staffAccountInactive}
                          </span>
                          {!canManageStaff && (
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              {getRoleLabel(st.role)}
                            </span>
                          )}
                        </div>
                      </div>
                      {canManageStaff && (
                        <div className="space-y-3">
                          {st.username === currentUser?.username ? (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.staffSelfAccountProtected}</p>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingStaffUsername(editingStaffUsername === st.username ? '' : st.username);
                                  setStaffSaveError('');
                                  setStaffSaveSuccess('');
                                  setStaffAccountDrafts((drafts) => ({
                                    ...drafts,
                                    [st.username]: drafts[st.username] ?? {
                                      username: st.username,
                                      fullName: st.name,
                                      role: st.role,
                                      department: st.department ?? '',
                                    },
                                  }));
                                }}
                                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                {editingStaffUsername === st.username ? t.staffCancelEdit : t.staffEditAccount}
                              </button>

                              {editingStaffUsername === st.username && (() => {
                                const draft = getStaffDraft(st);
                                const isBusy = staffSaveUsername === st.username;
                                const hasChanges = draft.username.trim().toLowerCase() !== st.username
                                  || draft.fullName.trim() !== st.name
                                  || draft.role !== st.role
                                  || draft.department !== (st.department ?? '');
                                const updateDraft = (changes: Partial<typeof draft>) => {
                                  setStaffAccountDrafts((drafts) => ({
                                    ...drafts,
                                    [st.username]: { ...draft, ...changes },
                                  }));
                                  setStaffSaveError('');
                                  setStaffSaveSuccess('');
                                };
                                return (
                                  <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/40">
                                    <label className="block space-y-1 font-medium text-slate-600 dark:text-slate-300">
                                      <span>{t.staffFullName}</span>
                                      <input
                                        value={draft.fullName}
                                        onChange={(event) => updateDraft({ fullName: event.target.value })}
                                        autoComplete="name"
                                        className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                      />
                                    </label>
                                    <label className="block space-y-1 font-medium text-slate-600 dark:text-slate-300">
                                      <span>{t.staffNewUsername}</span>
                                      <input
                                        value={draft.username}
                                        onChange={(event) => updateDraft({ username: event.target.value })}
                                        autoCapitalize="none"
                                        autoComplete="username"
                                        spellCheck={false}
                                        className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                      />
                                    </label>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                      <label className="block space-y-1 font-medium text-slate-600 dark:text-slate-300">
                                        <span>{t.staffRoleLabel}</span>
                                        <select
                                          value={draft.role}
                                          onChange={(event) => updateDraft({
                                            role: event.target.value as StaffRole,
                                            department: event.target.value === 'department_head' ? draft.department || '' : '',
                                          })}
                                          className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                        >
                                          <option value="superadmin">{t.roleSuperadmin}</option>
                                          <option value="customer_service_manager">{t.roleCustomerServiceManager}</option>
                                          <option value="department_head">{t.roleDepartmentHead}</option>
                                          <option value="ceo">{t.roleCeo}</option>
                                          <option value="staff">{t.roleStaff}</option>
                                        </select>
                                      </label>
                                      {draft.role === 'department_head' && (
                                        <label className="block space-y-1 font-medium text-slate-600 dark:text-slate-300">
                                          <span>{t.staffDepartmentLabel}</span>
                                          <select
                                            value={draft.department}
                                            onChange={(event) => updateDraft({ department: event.target.value })}
                                            className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                          >
                                            <option value="">{t.staffDepartmentLabel}</option>
                                            {DEPARTMENTS.map((department) => (
                                              <option key={department} value={department}>{getDeptName(department)}</option>
                                            ))}
                                          </select>
                                        </label>
                                      )}
                                    </div>
                                    {draft.role === 'department_head' && (
                                      <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">{t.staffDepartmentAccessNote}</p>
                                    )}
                                    <button
                                      type="button"
                                      disabled={isBusy || !hasChanges}
                                      onClick={() => void handleSaveStaffAccount(st)}
                                      className="min-h-10 w-full rounded-lg bg-blue-700 px-3 text-xs font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {isBusy ? t.staffUpdatingAccount : t.staffUpdateAccount}
                                    </button>
                                  </div>
                                );
                              })()}

                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                                <input
                                  type="password"
                                  minLength={12}
                                  autoComplete="new-password"
                                  aria-label={`${t.staffPasswordReset}: ${st.username}`}
                                  placeholder={t.staffPasswordReset}
                                  value={staffPasswordDrafts[st.username] ?? ''}
                                  onChange={(event) => {
                                    setStaffPasswordDrafts((drafts) => ({ ...drafts, [st.username]: event.target.value }));
                                    setStaffSaveError('');
                                    setStaffSaveSuccess('');
                                  }}
                                  className="min-h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-[11px] text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                />
                                <button
                                  type="button"
                                  disabled={staffSaveUsername === st.username || (staffPasswordDrafts[st.username] ?? '').length < 12}
                                  onClick={() => void handleResetStaffPassword(st)}
                                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-blue-200 px-3 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950/40"
                                >
                                  <KeyRound className="h-3.5 w-3.5" />
                                  {t.staffResetPassword}
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  disabled={staffSaveUsername === st.username}
                                  onClick={() => void handleSetStaffActive(st)}
                                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-amber-200 px-3 text-[11px] font-semibold text-amber-800 hover:bg-amber-50 disabled:opacity-50 dark:border-amber-900 dark:text-amber-300 dark:hover:bg-amber-950/40"
                                >
                                  {st.isActive ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                                  {st.isActive ? t.staffDeactivate : t.staffActivate}
                                </button>
                                <button
                                  type="button"
                                  disabled={staffSaveUsername === st.username}
                                  onClick={() => void handleDeleteStaffAccount(st)}
                                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-200 px-3 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  {t.staffDeleteAccount}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
