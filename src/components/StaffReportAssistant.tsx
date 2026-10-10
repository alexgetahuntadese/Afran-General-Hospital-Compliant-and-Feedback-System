import React, { useMemo, useState } from 'react';
import { FileText, Printer, Send, Sparkles } from 'lucide-react';
import { CaseSubmission } from '../types/hospital';
import { useLanguage } from '../context/LanguageContext';
import { buildReport, ReportResult } from '../lib/reporting';

interface StaffReportAssistantProps {
  cases: CaseSubmission[];
}

const starterPrompts = [
  'Unresolved complaints from the last 30 days',
  'All complaints by department',
  'Resolved feedback this month',
];

export const StaffReportAssistant: React.FC<StaffReportAssistantProps> = ({ cases }) => {
  const { getDeptName } = useLanguage();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Ask for a report in plain language. For example: “unresolved complaints in Emergency from the last 30 days”.' },
  ]);
  const [report, setReport] = useState<ReportResult | null>(null);

  const summary = useMemo(() => {
    if (!report) return null;
    const resolved = report.cases.filter((item) => item.status === 'resolved').length;
    const ratings = report.cases.filter((item) => item.rating > 0);
    const averageRating = ratings.length
      ? (ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length).toFixed(1)
      : '—';
    return { resolved, averageRating };
  }, [report]);

  const generate = (prompt = query) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    const nextReport = buildReport(trimmed, cases);
    setReport(nextReport);
    setMessages((current) => [
      ...current,
      { role: 'user', text: trimmed },
      { role: 'assistant', text: `${nextReport.description} Use Print report to create a handoff-ready document.` },
    ]);
    setQuery('');
  };

  const printReport = () => {
    document.body.classList.add('printing-report');
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => document.body.classList.remove('printing-report'), 500);
    }, 0);
  };

  return (
    <section className="report-assistant rounded-3xl border border-sky-200/80 bg-gradient-to-br from-white via-sky-50/70 to-teal-50/70 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-700 text-white shadow-lg shadow-sky-700/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Report assistant</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">Turn case data into a printable brief</h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600 dark:text-slate-300">Ask naturally. The report is generated from the cases already visible in your dashboard.</p>
          </div>
        </div>
        {report && <button type="button" onClick={printReport} className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"><Printer className="h-4 w-4" />Print report</button>}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-900/70">
          <div className="max-h-48 space-y-2 overflow-y-auto pr-1" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${message.role === 'user' ? 'ml-5 bg-sky-700 text-white' : 'mr-5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') generate(); }} placeholder="Ask for a report..." className="premium-input min-w-0 flex-1 text-xs" aria-label="Report request" />
            <button type="button" onClick={() => generate()} aria-label="Generate report" className="grid min-h-[44px] w-11 shrink-0 place-items-center rounded-xl bg-sky-700 text-white transition hover:bg-sky-800"><Send className="h-4 w-4" /></button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {starterPrompts.map((prompt) => <button type="button" key={prompt} onClick={() => generate(prompt)} className="rounded-full border border-sky-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-sky-800 transition hover:border-sky-400 dark:border-sky-900 dark:bg-slate-900 dark:text-sky-300">{prompt}</button>)}
          </div>
        </div>

        {report ? (
          <div className="report-print-surface rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
              <div><div className="flex items-center gap-2 text-sky-700 dark:text-sky-300"><FileText className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-[0.16em]">Afran General Hospital</span></div><h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{report.title}</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Generated {new Date().toLocaleString()}</p></div>
              <div className="grid grid-cols-2 gap-2 text-center"><div className="rounded-xl bg-sky-50 px-3 py-2 dark:bg-sky-950/30"><div className="text-xl font-bold text-sky-800 dark:text-sky-200">{report.cases.length}</div><div className="text-[10px] font-semibold text-sky-700 dark:text-sky-300">Cases</div></div><div className="rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-950/30"><div className="text-xl font-bold text-emerald-800 dark:text-emerald-200">{summary?.resolved}</div><div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">Resolved</div></div></div>
            </div>
            <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-200">{report.description} Average rating: <strong>{summary?.averageRating}</strong>.</p>
            <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[580px] text-left text-xs"><thead><tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 dark:border-slate-700"><th className="px-2 py-2">Reference</th><th className="px-2 py-2">Department</th><th className="px-2 py-2">Subject</th><th className="px-2 py-2">Status</th><th className="px-2 py-2">Submitted</th></tr></thead><tbody>{report.cases.map((item) => <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800"><td className="px-2 py-2 font-mono font-bold text-sky-700 dark:text-sky-300">{item.reference}</td><td className="px-2 py-2">{getDeptName(item.assignedDepartment ?? item.department)}</td><td className="max-w-[220px] truncate px-2 py-2">{item.subject}</td><td className="px-2 py-2 capitalize">{item.status.replace('_', ' ')}</td><td className="px-2 py-2 whitespace-nowrap">{new Date(item.submittedAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>
          </div>
        ) : <div className="grid min-h-[250px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-white/50 p-6 text-center dark:border-slate-700 dark:bg-slate-900/40"><div><FileText className="mx-auto h-9 w-9 text-slate-300 dark:text-slate-600" /><p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">Your report preview will appear here</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Use a prompt or choose a suggestion to begin.</p></div></div>}
      </div>
    </section>
  );
};
