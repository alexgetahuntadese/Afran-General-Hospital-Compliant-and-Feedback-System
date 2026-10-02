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
  Trash2
} from 'lucide-react';
import { SubmissionKind, CaseSubmission } from '../types/hospital';
import { DEPARTMENTS } from '../data/seedData';
import { getDepartmentQuestions, LIKELIHOOD_OPTIONS, QUESTIONNAIRE_VERSION, SATISFACTION_OPTIONS } from '../data/questionnaires';
import { useLanguage } from '../context/LanguageContext';
import { removeUnlinkedComplaintAudio, uploadComplaintAudio } from '../lib/data';

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
    selected: 'border-orange-500 bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25',
    idle: 'border-orange-200 bg-gradient-to-br from-orange-50 to-white text-orange-700 hover:border-orange-400 hover:shadow-md hover:shadow-orange-500/10 dark:border-orange-900 dark:from-orange-950/50 dark:to-slate-900 dark:text-orange-300',
  },
  3: {
    selected: 'border-amber-500 bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 shadow-lg shadow-amber-500/25',
    idle: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white text-amber-800 hover:border-amber-400 hover:shadow-md hover:shadow-amber-500/10 dark:border-amber-900 dark:from-amber-950/50 dark:to-slate-900 dark:text-amber-300',
  },
  4: {
    selected: 'border-blue-500 bg-gradient-to-br from-blue-500 to-sky-600 text-white shadow-lg shadow-blue-500/25',
    idle: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white text-blue-800 hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/10 dark:border-blue-900 dark:from-blue-950/50 dark:to-slate-900 dark:text-blue-300',
  },
  5: {
    selected: 'border-sky-500 bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25',
    idle: 'border-sky-200 bg-gradient-to-br from-sky-50 to-white text-sky-800 hover:border-sky-400 hover:shadow-md hover:shadow-sky-500/10 dark:border-sky-900 dark:from-sky-950/50 dark:to-slate-900 dark:text-sky-300',
  },
};

const minimumQuestionnaireAnswers = 4;

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
      if (audioBlob) uploadedAudioPath = await uploadComplaintAudio(refCode, audioBlob);
      const caseWithAudio = uploadedAudioPath ? { ...newCase, audioPath: uploadedAudioPath } : newCase;
      await onSubmitCase(caseWithAudio);
      setSubmittedCase(caseWithAudio);
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 sm:p-8 text-center space-y-5">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto">
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
            <span className="font-mono text-xl font-bold tracking-wider text-blue-700 dark:text-blue-300">
              {submittedCase.reference}
            </span>
            <button
              onClick={handleCopyRef}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={t.copyReference}
              aria-label={t.copyReference}
            >
              {copied ? <Check className="w-4 h-4 text-sky-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              onClick={() => onNavigateTrack(submittedCase.reference)}
              className="w-full sm:w-auto px-4 py-2 min-h-[44px] bg-blue-600 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
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
                setWizardStep(0);
              }}
              className="w-full sm:w-auto px-4 py-2 min-h-[40px] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
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
    <div className="max-w-5xl mx-auto py-5 sm:py-12 px-4 space-y-4 sm:space-y-6">
      {/* Welcome panel */}
      <section className="premium-hero hero-float relative overflow-hidden rounded-[28px] border border-[#90e0ef]/30 px-4 py-5 text-white shadow-[0_30px_80px_rgba(3,4,94,0.2)] sm:rounded-[32px] sm:px-8 sm:py-9">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#90e0ef]/35 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-teal-400/25 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-8 bottom-2 h-24 w-24 rounded-full bg-amber-400/10 blur-2xl" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_35%)]" aria-hidden="true" />
        <div className="relative grid gap-4 sm:gap-7 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl space-y-2 sm:space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#caf0f8] sm:text-[11px] sm:tracking-[0.24em]">
              {t.patientRelations}
            </p>
            <h1 className="font-serif text-2xl font-black tracking-tight text-white sm:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-slate-200 sm:text-base">
              {t.heroSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTrack('')}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold tracking-[0.08em] text-white transition-all duration-200 hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-cyan-200"
          >
            <Search className="h-4 w-4" />
            <span>{t.trackHeading}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#90e0ef]/30 pt-3 text-[10px] font-medium text-[#caf0f8] sm:mt-7 sm:pt-4 sm:text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.confidentialityNote}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t.patientRelations}
          </span>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="premium-form mx-auto max-w-3xl rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-8"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0077b6] dark:text-[#90e0ef]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#90e0ef] ring-2 ring-[#90e0ef]/25" />
              {t.patientRelations}
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{t.submitButton}</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t.feedbackTypePrompt}
            </p>
          </div>
          <span className="hidden rounded-full bg-[#caf0f8] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#03045e] dark:bg-[#023e8a]/50 dark:text-[#caf0f8] sm:inline-flex">
            {t.patientRelations}
          </span>
        </div>
        <div ref={wizardProgressRef} className="sticky top-[4.5rem] z-10 -mx-1 mt-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 sm:static sm:mx-0 sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
          <ol aria-label={`${t.wizardStepProgress} ${wizardStep + 1} / ${wizardSteps.length}: ${wizardSteps[wizardStep]}`} className="grid grid-cols-4 gap-2">
            {wizardSteps.map((label, index) => {
              const isComplete = index < wizardStep;
              const isCurrent = index === wizardStep;
              return (
                <li key={label} aria-current={isCurrent ? 'step' : undefined} className="min-w-0">
                  <div className={`mb-1 h-1.5 rounded-full transition-colors ${isComplete || isCurrent ? 'bg-[#0077b6]' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  <span className={`block truncate text-center text-[10px] font-semibold ${isCurrent ? 'text-[#03045e] dark:text-[#90e0ef]' : isComplete ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
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
        <div className={wizardStep === 0 ? 'mt-5' : 'hidden'}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => selectSubmissionKind('complaint')}
            aria-pressed={kind === 'complaint'}
            className={`kind-choice group relative min-h-24 touch-manipulation overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/20 active:translate-y-0 ${
              kind === 'complaint'
                ? 'border-rose-300 bg-gradient-to-br from-rose-50 via-white to-rose-100/70 shadow-[0_10px_24px_rgba(225,29,72,0.12)] ring-2 ring-rose-200 dark:border-rose-800 dark:from-rose-950/70 dark:via-slate-900 dark:to-rose-950/40 dark:ring-rose-900'
                : 'border-slate-200 bg-white shadow-sm hover:border-rose-200 hover:bg-rose-50/40 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-rose-900 dark:hover:bg-rose-950/20'
            }`}
          >
            <span className={`absolute inset-y-0 left-0 w-1 transition-colors ${kind === 'complaint' ? 'bg-rose-500' : 'bg-transparent group-hover:bg-rose-200 dark:group-hover:bg-rose-900'}`} aria-hidden="true" />
            <span className="flex items-center gap-3.5">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
                kind === 'complaint'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-rose-50 text-rose-700 group-hover:scale-105 dark:bg-rose-950/70 dark:text-rose-300'
              }`}>
                <AlertCircle className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-slate-900 dark:text-white">{t.kindComplaint}</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {t.kindComplaintDescription}
                </span>
              </span>
              <span className="shrink-0" aria-hidden="true">
                {kind === 'complaint'
                  ? <CheckCircle2 className="h-5 w-5 text-rose-600 dark:text-rose-300" />
                  : <Circle className="h-5 w-5 text-slate-300 transition-colors group-hover:text-rose-300 dark:text-slate-600" />}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => selectSubmissionKind('feedback')}
            aria-pressed={kind === 'feedback'}
            className={`kind-choice group relative min-h-24 touch-manipulation overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 active:translate-y-0 ${
              kind === 'feedback'
                ? 'border-blue-300 bg-gradient-to-br from-blue-50 via-white to-sky-100/70 shadow-[0_10px_24px_rgba(37,99,235,0.12)] ring-2 ring-blue-200 dark:border-blue-800 dark:from-blue-950/70 dark:via-slate-900 dark:to-sky-950/40 dark:ring-blue-900'
                : 'border-slate-200 bg-white shadow-sm hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-900 dark:hover:bg-blue-950/20'
            }`}
          >
            <span className={`absolute inset-y-0 left-0 w-1 transition-colors ${kind === 'feedback' ? 'bg-blue-500' : 'bg-transparent group-hover:bg-blue-200 dark:group-hover:bg-blue-900'}`} aria-hidden="true" />
            <span className="flex items-center gap-3.5">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
                kind === 'feedback'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-blue-50 text-blue-700 group-hover:scale-105 dark:bg-blue-950/70 dark:text-blue-300'
              }`}>
                <Lightbulb className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-slate-900 dark:text-white">{t.kindFeedback}</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {t.kindFeedbackDescription}
                </span>
              </span>
              <span className="shrink-0" aria-hidden="true">
                {kind === 'feedback'
                  ? <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  : <Circle className="h-5 w-5 text-slate-300 transition-colors group-hover:text-blue-300 dark:text-slate-600" />}
              </span>
            </span>
          </button>
        </div>
        <p className="mt-3 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300" aria-live="polite">
          {questionDescription}
        </p>
        </div>

        {/* Department & Experience Rating in a clean cohesive block */}
        <div className={wizardStep === 1 ? 'space-y-5 pt-4' : 'hidden'}>
          <div>
            <label htmlFor="feedback-department" className="mb-2 block text-xs font-bold text-slate-800 dark:text-slate-200">
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
              className="premium-input w-full cursor-pointer border text-slate-900 dark:text-white"
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
            <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40 sm:p-5">
              <legend className="sr-only">
                {t.questionnaireTitle}
              </legend>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {t.questionnaireTitle}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {t.questionnaireInstructions.replace('{minimum}', String(minimumQuestionnaireAnswers))}
                  </p>
                </div>
                <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-[10px] font-bold text-blue-800 dark:border-blue-900 dark:bg-slate-900 dark:text-blue-200">
                  {answeredQuestionCount}/{departmentQuestions.length} {t.questionnaireAnswered}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500 transition-[width] duration-300"
                  style={{ width: `${(answeredQuestionCount / departmentQuestions.length) * 100}%` }}
                />
              </div>
              <div className="space-y-2.5">
                {departmentQuestions.map((question, index) => {
                  const options = question.scale === 'likelihood' ? LIKELIHOOD_OPTIONS : SATISFACTION_OPTIONS;
                  const selectedValue = questionnaireAnswers[question.id];

                  return (
                    <div key={question.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition-colors hover:border-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-900 sm:p-4">
                      <div className="mb-3 flex items-start gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-black text-blue-800 dark:bg-blue-950/70 dark:text-blue-200">
                          {index + 1}
                        </span>
                        <span className="pt-0.5 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                          {question[language]}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5" role="group" aria-label={question[language]}>
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
                              className={`flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl border px-1 py-2 text-center transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                                isSelected ? ratingOptionStyles[option.value].selected : ratingOptionStyles[option.value].idle
                              }`}
                            >
                              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
                                isSelected ? 'bg-white/20 ring-1 ring-white/30' : 'bg-white/80 shadow-sm dark:bg-slate-950/50'
                              }`}>{option.value}</span>
                              <span className="text-[9px] font-bold leading-tight break-words">
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

          <fieldset className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-white p-3.5 dark:border-amber-900/60 dark:from-amber-950/30 dark:to-slate-900">
            <legend className="px-1 text-xs font-bold text-slate-800 dark:text-slate-200">
              {t.overallExperience}
            </legend>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.ratingPrompt}
              </span>
              {rating > 0 && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 dark:bg-amber-950/70 dark:text-amber-200" aria-live="polite">
                  {rating}/5
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center justify-between gap-1" role="group" aria-label={t.overallExperience}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(rating === star ? 0 : star)}
                  aria-label={`${star} ${star === 1 ? t.starUnit : t.starsUnit}`}
                  aria-pressed={rating === star}
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/30 ${
                    star <= rating
                      ? 'bg-amber-100 text-amber-500 dark:bg-amber-950/50'
                      : 'text-slate-300 hover:bg-amber-50 hover:text-amber-400 dark:text-slate-600 dark:hover:bg-amber-950/30'
                  }`}
                  title={`${star} ${star === 1 ? t.starUnit : t.starsUnit}`}
                >
                  <Star className={`h-6 w-6 transition-transform ${star <= rating ? 'fill-current scale-110' : ''}`} />
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className={wizardStep === 2 ? 'space-y-3 pt-4' : 'hidden'}>
        {/* Complaints require a description, but not a subject. */}
        <div className="space-y-3 pt-1">
          <div>
            <label htmlFor="feedback-subject" className="mb-2 block text-xs font-bold text-slate-800 dark:text-slate-200">
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
              className="premium-input w-full border text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="feedback-message" className="mb-2 block text-xs font-bold text-slate-800 dark:text-slate-200">
              {usesQuestionnaire || (kind === 'complaint' && audioBlob)
                ? t.additionalCommentsLabel
                : t.messageLabel}
            </label>
            <textarea
              id="feedback-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={usesQuestionnaire
                ? t.additionalCommentsPlaceholder
                : t.messagePlaceholder}
              className="premium-input min-h-36 w-full resize-y border text-slate-900 dark:text-white"
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

        <div className="pt-2">
          {submitError && (
            <p role="alert" className="mb-3 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {submitError}
            </p>
          )}
          <div className="flex gap-3">
            {wizardStep > 0 && (
              <button
                type="button"
                onClick={() => moveToWizardStep(wizardStep - 1)}
                className="min-h-12 flex-1 rounded-2xl border border-slate-300 px-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/20 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
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
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#03045e] via-[#0077b6] to-[#023e8a] px-4 text-sm font-black text-white shadow-[0_18px_36px_rgba(0,119,182,0.28)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#90e0ef]/60"
              >
                {t.wizardContinue}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                key="submit"
                type="submit"
                disabled={isSubmitting}
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#03045e] via-[#0077b6] to-[#023e8a] px-4 text-sm font-black text-white shadow-[0_18px_36px_rgba(0,119,182,0.3)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(0,119,182,0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#90e0ef]/60 disabled:cursor-not-allowed disabled:opacity-60"
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
