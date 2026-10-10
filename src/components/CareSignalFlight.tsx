import React from 'react';
import { ArrowRight, CheckCircle2, Clock3, Plane, ShieldCheck, Sparkles } from 'lucide-react';

interface CareSignalFlightProps {
  reference: string;
  department: string;
  onTrack: () => void;
  onReset: () => void;
}

export const CareSignalFlight: React.FC<CareSignalFlightProps> = ({ reference, department, onTrack, onReset }) => (
  <div className="care-signal-card relative overflow-hidden rounded-[2rem] border border-sky-200/80 bg-gradient-to-br from-[#032b45] via-[#075985] to-[#0f766e] p-5 text-white shadow-2xl shadow-sky-900/20 sm:p-7">
    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/15 blur-2xl" />
    <div className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-emerald-300/10 blur-2xl" />

    <div className="relative flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
          <Sparkles className="h-3.5 w-3.5" />
          Care Signal dispatched
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Your voice is in flight.</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-sky-100">
          Your message is safely on its way to the <strong className="text-white">{department}</strong> care team.
        </p>
      </div>
      <div className="care-signal-orbit grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/10">
        <Plane className="care-signal-plane h-7 w-7 rotate-12 text-cyan-200" />
      </div>
    </div>

    <div className="care-signal-route relative mt-7 h-16" aria-hidden="true">
      <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-cyan-200/45" />
      <div className="care-signal-route-dot absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_0_6px_rgba(110,231,183,0.12)]" />
      <div className="care-signal-route-dot absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_0_6px_rgba(165,243,252,0.12)]" />
      <div className="care-signal-flight-dot absolute left-[12%] top-1/2 -translate-y-1/2"><Plane className="h-5 w-5 rotate-12 text-white drop-shadow-lg" /></div>
      <div className="absolute left-0 top-10 text-[10px] font-semibold text-emerald-200">Received</div>
      <div className="absolute right-0 top-10 text-[10px] font-semibold text-cyan-100">Care team queue</div>
    </div>

    <div className="relative mt-4 grid gap-2 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-white/10 p-3"><CheckCircle2 className="h-4 w-4 text-emerald-300" /><p className="mt-2 text-xs font-bold">Captured</p><p className="mt-1 text-[10px] text-sky-100/75">Your experience is recorded.</p></div>
      <div className="rounded-2xl border border-white/10 bg-white/10 p-3"><Clock3 className="h-4 w-4 text-cyan-200" /><p className="mt-2 text-xs font-bold">Queued</p><p className="mt-1 text-[10px] text-sky-100/75">The right team can pick it up.</p></div>
      <div className="rounded-2xl border border-white/10 bg-white/10 p-3"><ShieldCheck className="h-4 w-4 text-teal-200" /><p className="mt-2 text-xs font-bold">Private</p><p className="mt-1 text-[10px] text-sky-100/75">Handled with care and discretion.</p></div>
    </div>

    <div className="relative mt-5 flex flex-col gap-3 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-[10px] font-semibold uppercase tracking-wider text-sky-200">Flight reference</p><p className="mt-1 font-mono text-lg font-bold tracking-wider text-white">{reference}</p></div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={onTrack} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-sky-900 transition hover:bg-cyan-50"><span>Track the signal</span><ArrowRight className="h-4 w-4" /></button>
        <button type="button" onClick={onReset} className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/25 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10">Send another</button>
      </div>
    </div>
  </div>
);
