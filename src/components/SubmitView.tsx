import React, { useEffect, useRef, useState } from 'react';
import { 
  AlertCircle, 
  Lightbulb, 
  Star, 
  CheckCircle2, 
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
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
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
  const recorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const discardRecordingRef = useRef(false);
  const usesQuestionnaire = kind !== 'complaint';
  const departmentQuestions = getDepartmentQuestions(department);
  const answeredQuestionCount = departmentQuestions.filter(({ id }) => questionnaireAnswers[id]).length;

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
      setRecordingError(language === 'am'
        ? 'ይህ አሳሽ የድምጽ ቅጂን አይደግፍም። እባክዎ የተዘመነ አሳሽ ይጠቀሙ።'
        : 'Audio recording is not supported by this browser. Please use a modern browser.');
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
        setRecordingError(language === 'am' ? 'ቅጂው አልተሳካም። እባክዎ እንደገና ይሞክሩ።' : 'Recording failed. Please try again.');
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
          setRecordingError(language === 'am'
            ? 'ቅጂው ከ10 ሜባ በላይ ነው። እባክዎ አጭር ቅጂ ያድርጉ።'
            : 'Recording exceeds the 10 MB limit. Please make a shorter recording.');
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
        : (language === 'am' ? 'ማይክሮፎኑን መጠቀም አልተቻለም።' : 'Could not access the microphone.'));
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
    if (usesQuestionnaire) {
      if (answeredQuestionCount < minimumQuestionnaireAnswers) {
        setSubmitError(language === 'am'
          ? `ለማስገባት ቢያንስ ${minimumQuestionnaireAnswers} የመምሪያ ጥያቄዎችን ይመልሱ።`
          : `Please answer at least ${minimumQuestionnaireAnswers} department questions to submit.`);
        return;
      }
    } else if (!message.trim() && !audioBlob) {
      setSubmitError(language === 'am'
        ? 'እባክዎ ዝርዝር ማብራሪያ ያስገቡ ወይም የድምጽ ቅጂ ያያይዙ።'
        : 'Add a description or attach a voice recording to your complaint.');
      return;
    } else if (audioBlob && !audioConsent) {
      setSubmitError(language === 'am'
        ? 'እባክዎ የድምጽ ቅጂው እንዲያያዝ ፈቃድዎን ያረጋግጡ።'
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
              {copied ? <Check className="w-4 h-4 text-sky-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              onClick={() => onNavigateTrack(submittedCase.reference)}
              className="w-full sm:w-auto px-4 py-2 min-h-[40px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
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
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 space-y-6">
      {/* Welcome panel */}
      <section className="premium-hero hero-float relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-blue-950 to-sky-900 px-5 py-7 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:px-8 sm:py-9">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-blue-400/25 blur-3xl" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_35%)]" aria-hidden="true" />
        <div className="relative grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
              {t.patientRelations}
            </p>
            <h1 className="font-serif text-3xl font-black tracking-tight text-white sm:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
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
        <div className="relative mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-4 text-[11px] font-medium text-cyan-100">
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
            <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              {t.patientRelations}
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{t.submitButton}</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {language === 'am' ? 'የሚፈልጉትን የግብረመልስ አይነት ይምረጡ።' : 'Choose how you would like to share your experience.'}
            </p>
          </div>
          <span className="hidden rounded-full bg-gradient-to-r from-blue-100 to-sky-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-800 dark:from-blue-950/60 dark:to-sky-950/60 dark:text-blue-200 sm:inline-flex">
            {t.patientRelations}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => selectSubmissionKind('complaint')}
            aria-pressed={kind === 'complaint'}
            className={`kind-choice rounded-2xl border px-3 py-3 text-left transition-all duration-200 ${
              kind === 'complaint'
                ? 'border-rose-300 bg-rose-50 shadow-sm ring-1 ring-rose-200 dark:border-rose-800 dark:bg-rose-950/40 dark:ring-rose-900'
                : 'border-slate-200 bg-white hover:border-rose-200 hover:bg-rose-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-rose-900 dark:hover:bg-rose-950/20'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                <AlertCircle className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-slate-900 dark:text-white">{t.kindComplaint}</span>
                <span className="mt-0.5 block text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {language === 'am' ? 'ችግር ወይም ስጋት ያቅርቡ' : 'Report a concern or problem'}
                </span>
              </span>
            </span>
          </button>

          <button
          type="button"
          onClick={() => selectSubmissionKind('feedback')}
          aria-pressed={kind === 'feedback'}
          className={`kind-choice rounded-2xl border px-3 py-3 text-left transition-all duration-200 ${
            kind === 'feedback'
              ? 'border-blue-300 bg-blue-50 shadow-sm ring-1 ring-blue-200 dark:border-blue-800 dark:bg-blue-950/40 dark:ring-blue-900'
              : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-900 dark:hover:bg-blue-950/20'
          }`}
          >
          <span className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Lightbulb className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold text-slate-900 dark:text-white">{t.kindFeedback}</span>
              <span className="mt-0.5 block text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                {language === 'am' ? 'ሀሳብ ወይም ምስጋና ያጋሩ' : 'Share a suggestion or compliment'}
              </span>
            </span>
          </span>
          </button>
        </div>
        <p className="mt-3 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300" aria-live="polite">
          {questionDescription}
        </p>

        {/* Department & Experience Rating in a clean cohesive block */}
        <div className="space-y-4 pt-1">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-300">
              {t.chooseDept}
            </label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setQuestionnaireAnswers({});
                setSubmitError('');
              }}
              className="premium-input w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-900 transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-900 sm:text-sm"
            >
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
                {language === 'am' ? 'የመምሪያ ጥያቄዎች' : `${department} questionnaire`}
              </legend>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {language === 'am' ? 'የመምሪያ ጥያቄዎች' : `${department} questionnaire`}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'am'
                      ? `ከ1 (በጣም ደካማ) እስከ 5 (በጣም ጥሩ) ይምረጡ፤ ለማስገባት ቢያንስ ${minimumQuestionnaireAnswers} ጥያቄዎችን ይመልሱ።`
                      : `Rate from 1 (Very poor) to 5 (Excellent). Answer at least ${minimumQuestionnaireAnswers} questions to submit.`}
                  </p>
                </div>
                <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-[10px] font-bold text-blue-800 dark:border-blue-900 dark:bg-slate-900 dark:text-blue-200">
                  {answeredQuestionCount}/{departmentQuestions.length} {language === 'am' ? 'ተመልሷል' : 'answered'}
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
                          {language === 'am' ? question.am : question.en}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5" role="group" aria-label={language === 'am' ? question.am : question.en}>
                        {options.map((option) => {
                          const isSelected = selectedValue === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-label={`${option.value}: ${language === 'am' ? option.am : option.en}`}
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
                                {language === 'am' ? option.am : option.en}
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

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
              {t.overallExperience}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(rating === star ? 0 : star)}
                aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                aria-pressed={rating === star}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  title={`${star} stars`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Complaints require a description, but not a subject. */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-300">
              {language === 'am' ? 'ርዕስ (አማራጭ)' : 'Subject (optional)'}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={usesQuestionnaire
                ? (language === 'am' ? 'አጭር ርዕስ' : 'Add a short summary')
                : (language === 'am' ? 'አጭር ርዕስ' : 'Add a short subject (optional)')}
              className="premium-input w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-900 transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-900 sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-300">
              {usesQuestionnaire || (kind === 'complaint' && audioBlob)
                ? (language === 'am' ? 'ተጨማሪ አስተያየት (አማራጭ)' : 'Additional comments (optional)')
                : t.messageLabel}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={usesQuestionnaire
                ? (language === 'am' ? 'ሌላ ማካፈል የሚፈልጉት ነገር ካለ...' : 'Share any other details you would like us to know...')
                : t.messagePlaceholder}
              className="premium-input w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-900 transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-900 sm:text-sm"
              required={!usesQuestionnaire && !audioBlob}
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
                  {language === 'am' ? 'የድምጽ ቅሬታ (አማራጭ)' : 'Voice complaint (optional)'}
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {language === 'am'
                    ? 'እስከ 3 ደቂቃ የሚቆይ ድምጽ ይቅረጹ። ቅጂው በግል ማከማቻ ይጠበቃል፤ ጉዳዩን ማየት የሚፈቀድላቸው ሰራተኞች ብቻ ማዳመጥ ይችላሉ።'
                    : 'Record up to 3 minutes. Audio is stored privately and only staff authorized to view this case can listen.'}
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
                {isRecording
                  ? (language === 'am' ? 'ቅጂውን አቁም' : 'Stop recording')
                  : (language === 'am' ? 'ቅጂ ጀምር' : 'Start recording')}
              </button>
            )}

            {isRecording && (
              <p className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300" role="status">
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                {language === 'am' ? 'እየቀረጸ ነው · እስከ 3 ደቂቃ' : 'Recording · up to 3 minutes'}
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
                    {language === 'am' ? 'ቅጂ ዝግጁ ነው' : 'Recording ready'}
                    <span className="ml-2 font-medium text-slate-500">({Math.ceil(audioBlob.size / 1024)} KB)</span>
                  </span>
                  <button
                    type="button"
                    onClick={clearRecording}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {language === 'am' ? 'ሰርዝ' : 'Remove'}
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
                    {language === 'am'
                      ? 'ይህንን የድምጽ ቅጂ ከቅሬታዬ ጋር ለጉዳዩ ግምገማ እንዲያያዝ እፈቅዳለሁ።'
                      : 'I consent to attaching this audio to my complaint for review by authorized hospital staff.'}
                  </span>
                </label>
              </div>
            )}
          </section>
        )}

        {/* Anonymous Option & Optional Contact */}
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
            <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-3">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.nameLabel}
                  className="premium-input w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-900 transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailLabel}
                  className="premium-input w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-900 transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phoneLabel}
                  className="premium-input w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-900 transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-900"
                />
              </div>
            </div>
          ) : (
            <p className="pl-6 text-[11px] italic text-slate-400 dark:text-slate-500">
              {t.anonymousNote}
            </p>
          )}
        </div>

        <div className="pt-2">
          {submitError && (
            <p role="alert" className="mb-3 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {submitError}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 px-4 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.35)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(37,99,235,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
          >
            <span>{isSubmitting ? t.submitting : t.submitButton}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
