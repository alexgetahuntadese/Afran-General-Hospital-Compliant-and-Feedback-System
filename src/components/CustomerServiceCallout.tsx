import React from 'react';
import { Headphones, PhoneCall, Radio, Sparkles } from 'lucide-react';

const configuredPhone = (import.meta.env.VITE_CUSTOMER_SERVICE_PHONE as string | undefined)?.trim() ?? '';
const dialPhone = configuredPhone.replace(/[^\d+]/g, '');

export const CustomerServiceCallout: React.FC = () => {
  if (!configuredPhone || !dialPhone) return null;

  return (
    <>
      <aside className="care-concierge relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-r from-[#fff8e7] via-white to-[#e8fbf6] p-4 shadow-lg shadow-amber-900/5 dark:border-amber-900/60 dark:from-amber-950/30 dark:via-slate-900 dark:to-emerald-950/30 sm:p-5" aria-label="Call customer service">
      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-amber-300/20 blur-2xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="care-concierge-icon relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-400 text-amber-950 shadow-lg shadow-amber-400/25">
            <Headphones className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-300"><Radio className="h-3 w-3" /> Care concierge is live</div>
            <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white">Prefer to talk to someone?</h2>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-600 dark:text-slate-300">Call the customer service manager directly while you are here. Your feedback form will still be available whenever you are ready.</p>
          </div>
        </div>
        <a href={`tel:${dialPhone}`} className="group inline-flex min-h-[48px] items-center justify-center gap-3 rounded-2xl bg-slate-950 px-4 py-2 text-left text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 dark:bg-white dark:text-slate-950 dark:hover:bg-amber-50">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-400 text-emerald-950 transition group-hover:rotate-6"><PhoneCall className="h-4 w-4" /></span>
          <span><span className="block text-[10px] font-semibold uppercase tracking-wider opacity-70">Call customer service</span><span className="mt-0.5 block font-mono text-sm font-bold tracking-wide">{configuredPhone}</span></span>
          <Sparkles className="ml-1 h-4 w-4 text-amber-300" />
        </a>
      </div>
      </aside>
      <a href={`tel:${dialPhone}`} aria-label={`Call customer service at ${configuredPhone}`} className="care-concierge-fab fixed bottom-4 right-4 z-40 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-xs font-bold text-white shadow-2xl shadow-slate-950/25 ring-4 ring-white/70 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950 dark:ring-slate-950/70 sm:hidden">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-400 text-emerald-950"><PhoneCall className="h-3.5 w-3.5" /></span>
        Call {configuredPhone}
      </a>
    </>
  );
};
