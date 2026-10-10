import React, { useEffect, useRef, useState } from 'react';
import { 
  AlertCircle, 
  Lightbulb, 
  Star, 
  CheckCircle2, 
  Circle,
  ArrowRight, 
  RotateCcw,
  Copy,
  Check,
  Search,
  ShieldCheck,
  Mic,
  Square,
  Trash2,
  Bell,
  X
} from 'lucide-react';
import { SubmissionKind, CaseSubmission } from '../types/hospital';
import { DEPARTMENTS } from '../data/seedData';
import { getDepartmentQuestions, LIKELIHOOD_OPTIONS, QUESTIONNAIRE_VERSION, SATISFACTION_OPTIONS } from '../data/questionnaires';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { removeUnlinkedComplaintAudio, uploadComplaintAudio } from '../lib/data';
import { requestNotificationPermission } from '../lib/firebase';
import { CareSignalFlight } from './CareSignalFlight';
import { CustomerServiceCallout } from './CustomerServiceCallout';

interface SubmitViewProps {
  onSubmitCase: (newCase: CaseSubmission) => Promise<void>;
  onNavigateTrack: (ref: string) => void;
}

const ratingOptionStyles: Record<number, { selected: string; idle: string }> = {
  1: {
    selected: 'border-rose-500 bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25',
    idle: 'border-rose-200 bg-gradient-to-br from-rose-50 to-white text-rose-700 hover:border-rose-400 hover:shadow-md hover:shadow-rose-500/10 dark:border-rose-900 dark:from-rose-950/50 dark:to-slate-900 dark:text-rose-300',
  },
  2: {
    selected: 'border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25',
    idle: 'border-orange-200 bg-gradient-to-br from-orange-50 to-white text-orange-700 hover:border-orange-400 hover:shadow-md hover:shadow-orange-500/10 dark:border-orange-900 dark:from-orange-950/50 dark:to-slate-900 dark:text-orange-300',
  },
  3: {
    selected: 'border-yellow-500 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/25',
    idle: 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-white text-yellow-700 hover:border-yellow-400 hover:shadow-md hover:shadow-yellow-500/10 dark:border-yellow-900 dark:from-yellow-950/50 dark:to-slate-900 dark:text-yellow-300',
  },
  4: {
    selected: 'border-lime-500 bg-gradient-to-br from-lime-500 to-lime-600 text-white shadow-lg shadow-lime-500/25',
    idle: 'border-lime-200 bg-gradient-to-br from-lime-50 to-white text-lime-700 hover:border-lime-400 hover:shadow-md hover:shadow-lime-500/10 dark:border-lime-900 dark:from-lime-950/50 dark:to-slate-900 dark:text-lime-300',
  },
  5: {
    selected: 'border-emerald-500 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25',
    idle: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white text-emerald-700 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/10 dark:border-emerald-900 dark:from-emerald-950/50 dark:to-slate-900 dark:text-emerald-300',
  },
};

const minimumQuestionnaireAnswers = 4;
const FORM_CACHE_KEY = 'afran_feedback_form_cache';

function getSubmissionErrorMessage(error: unknown): string {
  const fallback = 'Unable to submit feedback. Please try again.';
  if (error instanceof Error) return error.message;
  if (typeof error !== 'object' || error === null) return fallback;

  const errorDetails = error as Record<string, unknown>;
  const message = typeof errorDetails.message === 'string' ? errorDetails.message.trim() : '';
  if (!message) return fallback;

  const details = typeof errorDetails.details === 'string' ? errorDetails.details.trim() : '';
  const hint = typeof errorDetails.hint === 'string' ? errorDetails.hint.trim() : '';
  const code = typeof errorDetails.code === 'string' ? errorDetails.code.trim() : '';
  const databaseMessage = [message, details].join(' ');

  if (/audio_path|complaint-audio/i.test(databaseMessage) && (code === 'PGRST204' || /does not exist|schema cache|bucket not found/i.test(databaseMessage))) {
    return `Voice complaint storage is not configured. Apply supabase/migrations/20261001202000_private_complaint_audio.sql in the Supabase SQL Editor before submitting recordings. Database error: ${message}`;
  }

  if (
    /questionnaire_(answers|version)/i.test(databaseMessage)
    && (code === '42703' || code === 'PGRST204' || /column .* does not exist|schema cache/i.test(databaseMessage))
  ) {
    return `Feedback storage is missing questionnaire fields. Apply supabase/migrations/20261001194000_department_questionnaire_responses.sql in the Supabase SQL Editor. Database error: ${message}`;
  }

  if (code === '42501' || /row-level security policy/i.test(databaseMessage)) {
    return `Supabase denied this submission. Confirm that the feedback access migration has been applied and allows public inserts. Database error: ${message}`;
  }

  return [
    message,
    details && `Details: ${details}`,
    hint && `Hint: ${hint}`,
    code && `Code: ${code}`,
  ].filter(Boolean).join(' ');
}

export const SubmitView: React.FC<SubmitViewProps> = ({ onSubmitCase, onNavigateTrack }) => {
  const { t, language, getDeptName } = useLanguage();
  const { showNotification } = useNotification();
  const maxRecordingBytes = 10 * 1024 * 1024;

  const [kind, setKind] = useState<SubmissionKind>('complaint');
  const [department, setDepartment] = useState('');
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, number>>({});
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
  const [submitError, setSubmitError] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [audioConsent, setAudioConsent] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [wizardStep, setWizardStep] = useState(0);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [notificationPermissionRequested, setNotificationPermissionRequested] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const wizardProgressRef = useRef<HTMLDivElement>(null);
  const discardRecordingRef = useRef(false);
  const usesQuestionnaire = kind !== 'complaint';
  const departmentQuestions = getDepartmentQuestions(department);
  const answeredQuestionCount = departmentQuestions.filter(({ id }) => questionnaireAnswers[id]).length;
  const wizardSteps = [t.wizardStepType, t.wizardStepDetails, t.wizardStepMessage, t.wizardStepReview];

  const moveToWizardStep = (nextStep: number) => {
    setSubmitError('');
    setWizardStep(nextStep);
    window.requestAnimationFrame(() => {
      if (!wizardProgressRef.current) return;
      const top = wizardProgressRef.current.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  };

  const validateWizardStep = () => {
    if (wizardStep === 1 && !department) {
      setSubmitError(language === 'am'
        ? 'እባክዎ መምሪያ ይምረጡ።'
        : language === 'om'
          ? 'Maaloo kutaa filadhu.'
          : 'Please select a department.');
      return false;
    }
    if (wizardStep === 1 && usesQuestionnaire && answeredQuestionCount < minimumQuestionnaireAnswers) {
      setSubmitError(language === 'am'
        ? `ለመቀጠል ቢያንስ ${minimumQuestionnaireAnswers} የመምሪያ ጥያቄዎችን ይመልሉ።`
        : language === 'om'
          ? `Itti fufuuf gaaffilee kutaa yoo xiqqaate ${minimumQuestionnaireAnswers} deebisaa.`
          : `Please answer at least ${minimumQuestionnaireAnswers} department questions to continue.`);
      return false;
    }
    if (wizardStep === 2 && kind === 'complaint' && !message.trim() && !audioBlob) {
      setSubmitError(language === 'am'
        ? 'እባክዎ ዝርዝር ማብራሪያ ያስገቡ ወይም የድምጽ ቅጂ ያያይዙ።'
        : language === 'om'
          ? 'Maaloo ibsa barreessaa ykn sagalee waraabame itti dabalaa.'
          : 'Add a description or attach a voice recording to your complaint.');
      return false;
    }
    if (wizardStep === 2 && audioBlob && !audioConsent) {
      setSubmitError(language === 'am'
        ? 'እባክዎ የድምጽ ቅጂው እንዲያያዝ ፈቃድዎን ያረጋግጡ።'
        : language === 'om'
          ? 'Maaloo sagaleen waraabame akka itti dabalamu eeyyama keessan mirkaneessaa.'
          : 'Please confirm that you consent to attaching this recording.');
      return false;
    }
    return true;
  };

  const handleWizardContinue = () => {
    if (validateWizardStep()) moveToWizardStep(wizardStep + 1);
  };

  const questionDescription = kind === 'complaint'
    ? (language === 'am'
      ? 'የተከሰተውን ነገር ይግለጹ። ርዕስ አማራጭ ነው።'
      : 'Tell us what happened. A subject is optional.')
    : kind === 'feedback'
    ? (language === 'am'
      ? 'ከዚህ መምሪያ ጋር የተያያዘ የማሻሻያ ሀሳብ ወይም ምስጋና ለማጋራት ጥያቄዎቹን ይመልሱ።'
      : 'Answer a few questions to share a suggestion or compliment about this department.')
    : (language === 'am'
      ? 'ለዚህ መምሪያ ያለዎትን ምስጋና ለማጋራት ጥያቄዎቹን ይመልሱ።'
      : 'Answer a few questions to share a compliment for this department.');

  useEffect(() => {
    if (!audioBlob) {
      setAudioPreviewUrl('');
      return;
    }
    const previewUrl = URL.createObjectURL(audioBlob);
    setAudioPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [audioBlob]);

  useEffect(() => () => {
    if (recordingTimerRef.current !== null) window.clearTimeout(recordingTimerRef.current);
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  // Save form state to localStorage
  useEffect(() => {
    const formState = {
      kind,
      department,
      questionnaireAnswers,
      rating,
      subject,
      message,
      anonymous,
      name,
      email,
      phone,
      enableNotifications,
      wizardStep,
    };
    try {
      localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(formState));
    } catch (e) {
      console.error('Failed to save form state:', e);
    }
  }, [kind, department, questionnaireAnswers, rating, subject, message, anonymous, name, email, phone, enableNotifications, wizardStep]);

  // Load form state from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(FORM_CACHE_KEY);
      if (cached) {
        const formState = JSON.parse(cached);
        if (formState.kind) setKind(formState.kind);
        if (formState.department) setDepartment(formState.department);
        if (formState.questionnaireAnswers) setQuestionnaireAnswers(formState.questionnaireAnswers);
        if (formState.rating) setRating(formState.rating);
        if (formState.subject) setSubject(formState.subject);
        if (formState.message) setMessage(formState.message);
        if (formState.anonymous !== undefined) setAnonymous(formState.anonymous);
        if (formState.name) setName(formState.name);
        if (formState.email) setEmail(formState.email);
        if (formState.phone) setPhone(formState.phone);
        if (formState.enableNotifications !== undefined) setEnableNotifications(formState.enableNotifications);
        if (formState.wizardStep !== undefined) setWizardStep(formState.wizardStep);
      }
    } catch (e) {
      console.error('Failed to load form state:', e);
    }
  }, []);

  // Clear form cache
  const clearFormCache = () => {
    try {
      localStorage.removeItem(FORM_CACHE_KEY);
    } catch (e) {
      console.error('Failed to clear form cache:', e);
    }
  };

  // Reset form and clear cache
  const handleResetForm = () => {
    setKind('complaint');
    setDepartment('');
    setQuestionnaireAnswers({});
    setRating(0);
    setSubject('');
    setMessage('');
    setAnonymous(false);
    setName('');
    setEmail('');
    setPhone('');
    setEnableNotifications(false);
    setWizardStep(0);
    setSubmitError('');
    setAudioBlob(null);
    setAudioPreviewUrl('');
    setAudioConsent(false);
    clearFormCache();
    showNotification('info', 'Form cleared');
  };

  const stopRecording = () => {
    if (recordingTimerRef.current !== null) {
      window.clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    const recorder = recorderRef.current;
    if (recorder?.state === 'recording') {
      recorder.stop();
    } else {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      setIsRecording(false);
    }
  };

  const startRecording = async () => {
    setRecordingError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordingError(t.recordingUnsupported);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const preferredTypes = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg'];
      const supportedType = preferredTypes.find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = supportedType
        ? new MediaRecorder(stream, { mimeType: supportedType })
        : new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorderRef.current = recorder;
      discardRecordingRef.current = false;
      setAudioBlob(null);
      setAudioConsent(false);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onerror = () => {
        setRecordingError(t.recordingFailed);
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      };
      recorder.onstop = () => {
        const recording = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        if (discardRecordingRef.current) {
          setAudioBlob(null);
        } else if (recording.size > maxRecordingBytes) {
          setAudioBlob(null);
          setRecordingError(t.recordingTooLarge);
        } else if (recording.size > 0) {
          setAudioBlob(recording);
          setRecordingError('');
        }
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        recorderRef.current = null;
        setIsRecording(false);
      };
      recorder.start();
      setIsRecording(true);
      recordingTimerRef.current = window.setTimeout(stopRecording, 3 * 60 * 1000);
    } catch (error) {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      setRecordingError(error instanceof Error
        ? error.message
        : t.microphoneUnavailable);
    }
  };

  const clearRecording = () => {
    discardRecordingRef.current = true;
    stopRecording();
    setAudioBlob(null);
    setAudioConsent(false);
    setRecordingError('');
  };

  const selectSubmissionKind = (nextKind: SubmissionKind) => {
    if (nextKind !== 'complaint') clearRecording();
    setKind(nextKind);
    setQuestionnaireAnswers({});
    setSubmitError('');
    // For complaint, go to step 1 (department selection only)
    // For feedback, go to step 1 (department + questionnaire)
    setWizardStep(1);
  };

  // Generate random 6-character reference code matching target format AGH-XXXXXX
  const generateRef = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `AGH-${code}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wizardStep < wizardSteps.length - 1) {
      handleWizardContinue();
      return;
    }
    if (!department) {
      setSubmitError(language === 'am'
        ? 'እባክዎ መምሪያ ይምረጡ።'
        : language === 'om'
          ? 'Maaloo kutaa filadhu.'
          : 'Please select a department.');
      return;
    }
    if (usesQuestionnaire) {
      if (answeredQuestionCount < minimumQuestionnaireAnswers) {
        setSubmitError(t.questionnaireMinimumError.replace('{minimum}', String(minimumQuestionnaireAnswers)));
        return;
      }
    } else if (!message.trim() && !audioBlob) {
      setSubmitError(language === 'am'
        ? 'እባክዎ ዝርዝር ማብራሪያ ያስገቡ ወይም የድምጽ ቅጂ ያያይዙ።'
        : language === 'om'
          ? 'Maaloo ibsa barreessaa ykn sagalee waraabame itti dabalaa.'
          : 'Add a description or attach a voice recording to your complaint.');
      return;
    } else if (audioBlob && !audioConsent) {
      setSubmitError(language === 'am'
        ? 'እባክዎ የድምጽ ቅጂው እንዲያያዝ ፈቃድዎን ያረጋግጡ።'
        : language === 'om'
          ? 'Maaloo sagaleen waraabame akka itti dabalamu eeyyama keessan mirkaneessaa.'
          : 'Please confirm that you consent to attaching this recording.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    const now = new Date().toISOString();
    const refCode = generateRef();

    let deviceToken: string | null = null;

    const newCase: CaseSubmission = {
      id: refCode,
      reference: refCode,
      kind,
      department,
      subject: subject.trim() || (kind === 'complaint'
        ? (audioBlob
          ? (language === 'am' ? `${getDeptName(department)} - የድምጽ ቅሬታ` : `${department} voice complaint`)
          : (language === 'am' ? `${getDeptName(department)} - ቅሬታ` : `${department} complaint`))
        : (language === 'am' ? `${getDeptName(department)} - አስተያየት` : `${department} feedback`)),
      message: message.trim() || (kind === 'complaint'
        ? (language === 'am' ? 'የድምጽ ቅሬታ ቅጂ ተያይዟል።' : 'Voice complaint recording attached.')
        : (language === 'am' ? 'የመምሪያ ጥያቄዎች ቀርበዋል።' : 'Department questionnaire submitted.')),
      rating,
      anonymous,
      name: anonymous ? undefined : name.trim() || undefined,
      email: anonymous ? undefined : email.trim() || undefined,
      phone: anonymous ? undefined : phone.trim() || undefined,
      status: 'received',
      submittedAt: now,
      updatedAt: now,
      questionnaireVersion: usesQuestionnaire ? QUESTIONNAIRE_VERSION : undefined,
      questionnaireAnswers: usesQuestionnaire ? questionnaireAnswers : undefined,
    };

    let uploadedAudioPath: string | undefined;
    try {
      // Notification setup is optional and must not prevent a case from being
      // submitted when Firebase is not configured or the browser rejects it.
      if (enableNotifications && !notificationPermissionRequested) {
        try {
          deviceToken = await requestNotificationPermission();
        } finally {
          setNotificationPermissionRequested(true);
        }
      }
      if (audioBlob) uploadedAudioPath = await uploadComplaintAudio(refCode, audioBlob);
      const caseWithAudio = uploadedAudioPath ? { ...newCase, audioPath: uploadedAudioPath } : newCase;
      await onSubmitCase(caseWithAudio);
      setSubmittedCase(caseWithAudio);
      showNotification('success', t.submissionSuccess);
      
      // Clear form cache after successful submission
      clearFormCache();
      
      // Save device token if permission was granted
      if (deviceToken) {
        // TODO: Save device token to database
        console.log('Device token obtained:', deviceToken);
      }
    } catch (error) {
      let message = getSubmissionErrorMessage(error);
      if (uploadedAudioPath) {
        try {
          await removeUnlinkedComplaintAudio(uploadedAudioPath);
        } catch (cleanupError) {
          const cleanupMessage = cleanupError instanceof Error ? cleanupError.message : 'The uploaded audio could not be cleaned up.';
          message = `${message} ${cleanupMessage}`;
        }
      }
      setSubmitError(message);
      showNotification('error', t.submissionError);
    } finally {
      setIsSubmitting(false);
    }
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
        <CareSignalFlight
          reference={submittedCase.reference}
          department={getDeptName(submittedCase.department)}
          onTrack={() => onNavigateTrack(submittedCase.reference)}
          onReset={() => {
            setSubmittedCase(null);
            handleResetForm();
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-16 px-4 space-y-8 sm:space-y-12">
      <CustomerServiceCallout />
      {/* Welcome panel */}
      <section className="premium-hero hero-float relative overflow-hidden rounded-[32px] border border-white/20 bg-gradient-to-br from-[#0077b6] via-[#00b4d8] to-[#90e0ef] px-6 py-8 text-white shadow-2xl sm:rounded-[40px] sm:px-12 sm:py-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" aria-hidden="true" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-white/15 blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-[#caf0f8]/30 blur-2xl" aria-hidden="true" />
        <div className="relative grid gap-6 sm:gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/90 sm:text-sm">
              {t.patientRelations}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {t.heroTitle}
            </h1>
            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-white/90">
              {t.heroSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTrack('')}
            className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-6 py-4 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/40"
          >
            <Search className="h-5 w-5" />
            <span>{t.trackHeading}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-4 text-xs font-medium text-white/90 sm:mt-8 sm:pt-6 sm:text-sm">
          <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4" />
            {t.confidentialityNote}
          </span>
          <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4" />
            {t.patientRelations}
          </span>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="premium-form mx-auto max-w-4xl rounded-[40px] border border-white/40 bg-white/70 backdrop-blur-xl p-8 shadow-2xl dark:border-slate-700/50 dark:bg-slate-900/70 sm:p-12"
      >
        <div className="flex items-center justify-between gap-6 border-b border-slate-200/50 pb-8 dark:border-slate-700/50">
          <div>
            <div className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#0077b6] dark:text-[#90e0ef]">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#0077b6] to-[#00b4d8] ring-2 ring-[#90e0ef]/40 animate-pulse" />
              {t.patientRelations}
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.submitButton}</h2>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              {questionDescription}
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetForm}
            className="shrink-0 flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
            title="Clear form and reset"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
        <div ref={wizardProgressRef} className="sticky top-[4.5rem] z-10 -mx-1 mt-8 rounded-3xl border border-slate-200/50 bg-white/80 backdrop-blur-xl p-6 shadow-xl dark:border-slate-700/50 dark:bg-slate-900/80 sm:static sm:mx-0 sm:mt-10 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
          <ol aria-label={`${t.wizardStepProgress} ${wizardStep + 1} / ${wizardSteps.length}: ${wizardSteps[wizardStep]}`} className="grid grid-cols-4 gap-4">
            {wizardSteps.map((label, index) => {
              const isComplete = index < wizardStep;
              const isCurrent = index === wizardStep;
              return (
                <li key={label} aria-current={isCurrent ? 'step' : undefined} className="min-w-0">
                  <div className={`mb-3 h-2.5 rounded-full transition-all duration-500 ${isComplete || isCurrent ? 'bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#90e0ef] shadow-xl shadow-[#0077b6]/30' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  <span className={`block truncate text-center text-xs font-bold transition-all duration-300 ${isCurrent ? 'text-[#0077b6] dark:text-[#90e0ef] scale-110' : isComplete ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
                    {index + 1}. {label}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="sr-only" aria-live="polite">
            {`${wizardSteps[wizardStep]} · ${wizardStep + 1} / ${wizardSteps.length}`}
          </p>
        </div>
        <div className={wizardStep === 0 ? 'mt-8' : 'hidden'}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => selectSubmissionKind('complaint')}
            aria-pressed={kind === 'complaint'}
            className={`kind-choice group relative min-h-36 touch-manipulation overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/40 active:translate-y-0 ${
              kind === 'complaint'
                ? 'border-rose-500 bg-gradient-to-br from-rose-100 via-white to-rose-50 shadow-2xl shadow-rose-500/25 ring-4 ring-rose-300 dark:border-rose-600 dark:from-rose-950/90 dark:via-slate-900 dark:to-rose-950/60 dark:ring-rose-700'
                : 'border-slate-200 bg-white shadow-lg hover:border-rose-400 hover:bg-gradient-to-br hover:from-rose-50 hover:to-white hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-rose-600 dark:hover:from-rose-950/40 dark:hover:to-slate-900'
            }`}
          >
            <span className={`absolute inset-y-0 left-0 w-2 transition-all duration-500 ${kind === 'complaint' ? 'bg-gradient-to-b from-rose-500 to-rose-600' : 'bg-transparent group-hover:bg-gradient-to-b group-hover:from-rose-400 group-hover:to-rose-500 dark:group-hover:from-rose-700 dark:group-hover:to-rose-800'}`} aria-hidden="true" />
            <span className="flex items-center gap-5">
              <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 ${
                kind === 'complaint'
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-2xl shadow-rose-500/40 scale-110'
                  : 'bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700 group-hover:scale-110 dark:from-rose-950/70 dark:to-rose-900/70 dark:text-rose-300'
              }`}>
                <AlertCircle className="h-7 w-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-extrabold text-slate-900 dark:text-white">{t.kindComplaint}</span>
                <span className="mt-2 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {t.kindComplaintDescription}
                </span>
              </span>
              <span className="shrink-0" aria-hidden="true">
                {kind === 'complaint'
                  ? <CheckCircle2 className="h-7 w-7 text-rose-600 dark:text-rose-300 scale-110" />
                  : <Circle className="h-7 w-7 text-slate-300 transition-colors group-hover:text-rose-400 dark:text-slate-600" />}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => selectSubmissionKind('feedback')}
            aria-pressed={kind === 'feedback'}
            className={`kind-choice group relative min-h-36 touch-manipulation overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 active:translate-y-0 ${
              kind === 'feedback'
                ? 'border-blue-500 bg-gradient-to-br from-blue-100 via-white to-sky-50 shadow-2xl shadow-blue-500/25 ring-4 ring-blue-300 dark:border-blue-600 dark:from-blue-950/90 dark:via-slate-900 dark:to-sky-950/60 dark:ring-blue-700'
                : 'border-slate-200 bg-white shadow-lg hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-600 dark:hover:from-blue-950/40 dark:hover:to-slate-900'
            }`}
          >
            <span className={`absolute inset-y-0 left-0 w-2 transition-all duration-500 ${kind === 'feedback' ? 'bg-gradient-to-b from-blue-500 to-blue-600' : 'bg-transparent group-hover:bg-gradient-to-b group-hover:from-blue-400 group-hover:to-blue-500 dark:group-hover:from-blue-700 dark:group-hover:to-blue-800'}`} aria-hidden="true" />
            <span className="flex items-center gap-5">
              <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 ${
                kind === 'feedback'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl shadow-blue-500/40 scale-110'
                  : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 group-hover:scale-110 dark:from-blue-950/70 dark:to-blue-900/70 dark:text-blue-300'
              }`}>
                <Lightbulb className="h-7 w-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-extrabold text-slate-900 dark:text-white">{t.kindFeedback}</span>
                <span className="mt-2 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {t.kindFeedbackDescription}
                </span>
              </span>
              <span className="shrink-0" aria-hidden="true">
                {kind === 'feedback'
                  ? <CheckCircle2 className="h-7 w-7 text-blue-600 dark:text-blue-300 scale-110" />
                  : <Circle className="h-7 w-7 text-slate-300 transition-colors group-hover:text-blue-400 dark:text-slate-600" />}
              </span>
            </span>
          </button>
        </div>
        <p className="mt-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 px-5 py-4 text-base leading-relaxed text-slate-700 dark:from-slate-800/60 dark:to-slate-900/60 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 shadow-md" aria-live="polite">
          {questionDescription}
        </p>
        </div>

        {/* Department & Experience Rating in a clean cohesive block */}
        <div className={wizardStep === 1 ? 'space-y-6 pt-6' : 'hidden'}>
          <div>
            <label htmlFor="feedback-department" className="mb-3 block text-sm font-bold text-slate-800 dark:text-slate-200">
              {t.chooseDept}
            </label>
            <select
              id="feedback-department"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setQuestionnaireAnswers({});
                setSubmitError('');
              }}
              className="premium-input w-full cursor-pointer border-2 text-slate-900 dark:text-white text-base py-3 px-4 rounded-xl transition-all hover:border-[#0077b6] focus:border-[#0077b6] focus:ring-4 focus:ring-[#0077b6]/20"
            >
              <option value="">{t.chooseDept}</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {getDeptName(dept)}
                </option>
              ))}
            </select>
          </div>

          {usesQuestionnaire && (
            <fieldset className="space-y-5 rounded-3xl border-2 border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-5 shadow-lg dark:border-slate-700/60 dark:from-slate-800/60 dark:to-slate-900 sm:p-6">
              <legend className="sr-only">
                {t.questionnaireTitle}
              </legend>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {t.questionnaireTitle}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t.questionnaireInstructions.replace('{minimum}', String(minimumQuestionnaireAnswers))}
                  </p>
                </div>
                <span className="rounded-full border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-white px-4 py-1.5 text-xs font-bold text-blue-800 shadow-md dark:border-blue-700 dark:from-blue-950/60 dark:to-slate-900 dark:text-blue-200">
                  {answeredQuestionCount}/{departmentQuestions.length} {t.questionnaireAnswered}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#90e0ef] transition-[width] duration-500 shadow-lg"
                  style={{ width: `${(answeredQuestionCount / departmentQuestions.length) * 100}%` }}
                />
              </div>
              <div className="space-y-4">
                {departmentQuestions.map((question, index) => {
                  const options = question.scale === 'likelihood' ? LIKELIHOOD_OPTIONS : SATISFACTION_OPTIONS;
                  const selectedValue = questionnaireAnswers[question.id];

                  return (
                    <div key={question.id} className="rounded-2xl border-2 border-slate-200/60 bg-white p-4 shadow-md transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-900 dark:hover:border-blue-700 sm:p-5">
                      <div className="mb-4 flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-xs font-black text-blue-800 shadow-md dark:from-blue-950/70 dark:to-blue-900/70 dark:text-blue-200">
                          {index + 1}
                        </span>
                        <span className="pt-1 text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                          {question[language]}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2" role="group" aria-label={question[language]}>
                        {options.map((option) => {
                          const isSelected = selectedValue === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-label={`${option.value}: ${option[language]}`}
                              aria-pressed={isSelected}
                              onClick={() => {
                                setQuestionnaireAnswers((answers) => ({
                                  ...answers,
                                  [question.id]: option.value,
                                }));
                                setSubmitError('');
                              }}
                              className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border-2 px-1 py-2.5 text-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                                isSelected ? ratingOptionStyles[option.value].selected : ratingOptionStyles[option.value].idle
                              }`}
                            >
                              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black transition-all ${
                                isSelected ? 'bg-white/30 ring-2 ring-white/40 scale-110' : 'bg-white/90 shadow-md dark:bg-slate-950/50'
                              }`}>{option.value}</span>
                              <span className="text-[10px] font-bold leading-tight break-words">
                                {option[language]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          )}

          <fieldset className="rounded-3xl border-2 border-amber-300/60 bg-gradient-to-br from-amber-50 via-white to-amber-100/50 p-5 shadow-lg dark:border-amber-700/60 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/20">
            <legend className="px-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              {t.overallExperience}
            </legend>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {t.ratingPrompt}
              </span>
              {rating > 0 && (
                <span className="rounded-full bg-gradient-to-r from-amber-200 to-amber-300 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-md dark:from-amber-800 dark:to-amber-700 dark:text-amber-100" aria-live="polite">
                  {rating}/5
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2" role="group" aria-label={t.overallExperience}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(rating === star ? 0 : star)}
                  aria-label={`${star} ${star === 1 ? t.starUnit : t.starsUnit}`}
                  aria-pressed={rating === star}
                  className={`flex min-h-14 min-w-14 items-center justify-center rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40 hover:scale-110 ${
                    star <= rating
                      ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-xl shadow-amber-500/30'
                      : 'text-slate-300 hover:bg-gradient-to-br hover:from-amber-100 hover:to-amber-200 hover:text-amber-600 dark:text-slate-600 dark:hover:from-amber-900/50 dark:hover:to-amber-800/50 dark:hover:text-amber-300'
                  }`}
                  title={`${star} ${star === 1 ? t.starUnit : t.starsUnit}`}
                >
                  <Star className={`h-7 w-7 transition-transform ${star <= rating ? 'fill-current scale-110' : ''}`} />
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className={wizardStep === 2 ? 'space-y-5 pt-6' : 'hidden'}>
        {/* Complaints require a description, but not a subject. */}
        <div className="space-y-5 pt-2">
          <div>
            <label htmlFor="feedback-subject" className="mb-3 block text-sm font-bold text-slate-800 dark:text-slate-200">
              {t.subjectLabel} ({t.optionalLabel})
            </label>
            <input
              id="feedback-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={usesQuestionnaire
                ? t.subjectPlaceholder
                : t.subjectPlaceholder}
              className="premium-input w-full border-2 text-slate-900 dark:text-white text-base py-3 px-4 rounded-xl transition-all hover:border-[#0077b6] focus:border-[#0077b6] focus:ring-4 focus:ring-[#0077b6]/20"
            />
          </div>

          <div>
            <label htmlFor="feedback-message" className="mb-3 block text-sm font-bold text-slate-800 dark:text-slate-200">
              {usesQuestionnaire || (kind === 'complaint' && audioBlob)
                ? t.additionalCommentsLabel
                : t.messageLabel}
            </label>
            <textarea
              id="feedback-message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={usesQuestionnaire
                ? t.additionalCommentsPlaceholder
                : t.messagePlaceholder}
              className="premium-input min-h-40 w-full resize-y border-2 text-slate-900 dark:text-white text-base py-3 px-4 rounded-xl transition-all hover:border-[#0077b6] focus:border-[#0077b6] focus:ring-4 focus:ring-[#0077b6]/20"
            />
          </div>
        </div>

        {kind === 'complaint' && (
          <section className="space-y-3 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50/70 p-4 dark:border-sky-900/70 dark:from-sky-950/35 dark:to-blue-950/20 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-300">
                <Mic className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {t.voiceComplaintLabel}
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {t.audioPrivacyNotice}
                </p>
              </div>
            </div>

            {!audioBlob && (
              <button
                type="button"
                onClick={isRecording ? stopRecording : () => void startRecording()}
                className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 sm:w-auto ${
                  isRecording
                    ? 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500/30'
                    : 'bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-500/30'
                }`}
              >
                {isRecording ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-4 w-4" />}
                {isRecording ? t.recordingStop : t.recordingStart}
              </button>
            )}

            {isRecording && (
              <p className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300" role="status">
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                {t.recordingInProgress}
              </p>
            )}

            {recordingError && (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                {recordingError}
              </p>
            )}

            {audioBlob && audioPreviewUrl && (
              <div className="space-y-3 rounded-xl border border-blue-200 bg-white/80 p-3 dark:border-blue-900 dark:bg-slate-900/80">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-200">
                    {t.recordingReady}
                    <span className="ml-2 font-medium text-slate-500">({Math.ceil(audioBlob.size / 1024)} KB)</span>
                  </span>
                  <button
                    type="button"
                    onClick={clearRecording}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t.recordingRemove}
                  </button>
                </div>
                <audio controls src={audioPreviewUrl} className="w-full" />
                <label className="flex cursor-pointer items-start gap-2.5 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-700 dark:border-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={audioConsent}
                    onChange={(event) => setAudioConsent(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    {t.recordingConsent}
                  </span>
                </label>
              </div>
            )}
          </section>
        )}
        </div>

        {/* Anonymous Option & Optional Contact */}
        <div className={wizardStep === 3 ? 'space-y-3 pt-4' : 'hidden'}>
          <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.wizardReviewKind}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{kind === 'complaint' ? t.kindComplaint : t.kindFeedback}</p>
            <h3 className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-100">{t.wizardReviewDepartment}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{getDeptName(department)}</p>
            <h3 className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-100">{t.wizardReviewMessage}</h3>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600 dark:text-slate-300">
              {message.trim() || (audioBlob ? t.recordingAttached : t.wizardNoMessage)}
            </p>
            <h3 className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-100">{t.wizardReviewContact}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {anonymous
                ? t.wizardAnonymous
                : [name, email, phone].filter(Boolean).join(' · ') || t.wizardNoMessage}
            </p>
          </section>
        
        {/* Push Notification Permission */}
        <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 dark:border-blue-900/70 dark:from-blue-950/35 dark:to-blue-900/20">
          <label className="flex cursor-pointer items-start gap-3 select-none">
            <input
              type="checkbox"
              checked={enableNotifications}
              onChange={(e) => setEnableNotifications(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.enableNotifications}</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {t.notificationDescription}
              </p>
            </div>
          </label>
        </section>

        <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <label className="flex cursor-pointer items-center gap-2.5 select-none">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-300">
              {t.submitAnonymously}
            </span>
          </label>

          {!anonymous ? (
            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-3">
              <label className="space-y-1.5">
                <span className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">{t.nameLabel}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  aria-label={t.nameLabel}
                  placeholder={t.nameLabel}
                  className="premium-input w-full border text-slate-900 dark:text-white"
                />
              </label>

              <label className="space-y-1.5">
                <span className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">{t.emailLabel}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-label={t.emailLabel}
                  placeholder={t.emailLabel}
                  className="premium-input w-full border text-slate-900 dark:text-white"
                />
              </label>

              <label className="space-y-1.5">
                <span className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">{t.phoneLabel}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  aria-label={t.phoneLabel}
                  placeholder={t.phoneLabel}
                  className="premium-input w-full border text-slate-900 dark:text-white"
                />
              </label>
            </div>
          ) : (
            <p className="pl-6 text-[11px] italic text-slate-400 dark:text-slate-500">
              {t.anonymousNote}
            </p>
          )}
        </div>
        </div>

        <div className="pt-4">
          {submitError && (
            <p role="alert" className="mb-4 flex items-start gap-3 rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-rose-100/50 p-4 text-sm font-semibold text-rose-800 dark:border-rose-700 dark:from-rose-950/60 dark:to-rose-900/30 dark:text-rose-300 shadow-lg shadow-rose-500/10">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              {submitError}
            </p>
          )}
          <div className="flex gap-4">
            {wizardStep > 0 && (
              <button
                type="button"
                onClick={() => moveToWizardStep(wizardStep - 1)}
                className="min-h-14 flex-1 rounded-2xl border-2 border-slate-300 px-5 text-sm font-bold text-slate-700 transition-all duration-300 hover:bg-slate-100 hover:border-slate-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/30 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-500"
              >
                {t.wizardBack}
              </button>
            )}
            {wizardStep < wizardSteps.length - 1 ? (
              <button
                key="continue"
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  handleWizardContinue();
                }}
                className="flex min-h-14 flex-1 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#90e0ef] px-5 text-sm font-black text-white shadow-xl shadow-[#0077b6]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0077b6]/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#90e0ef]/60"
              >
                {t.wizardContinue}
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                key="submit"
                type="submit"
                disabled={isSubmitting}
                className="flex min-h-14 flex-1 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#90e0ef] px-5 text-sm font-black text-white shadow-xl shadow-[#0077b6]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0077b6]/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#90e0ef]/60 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-lg"
              >
                <span>{isSubmitting ? t.submitting : t.submitButton}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
