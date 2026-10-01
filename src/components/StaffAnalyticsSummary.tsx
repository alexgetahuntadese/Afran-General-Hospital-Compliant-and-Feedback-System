import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  AlertCircle, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Star, 
  UserX 
} from 'lucide-react';
import { CaseSubmission } from '../types/hospital';
import { useLanguage } from '../context/LanguageContext';
import { DEPARTMENTS } from '../data/seedData';

interface StaffAnalyticsSummaryProps {
  cases: CaseSubmission[];
  departmentScope?: string;
}

export const StaffAnalyticsSummary: React.FC<StaffAnalyticsSummaryProps> = ({ cases, departmentScope }) => {
  const { t, getDeptName } = useLanguage();
  const departments = departmentScope
    ? [departmentScope]
    : [...new Set([...DEPARTMENTS, ...cases.map((item) => item.department)])];
  const departmentData = departments.map((department) => {
    const departmentCases = cases.filter((item) => item.department === department);
    const complaints = departmentCases.filter((item) => item.kind === 'complaint').length;
    const feedback = departmentCases.filter((item) => item.kind === 'feedback' || item.kind === 'compliment').length;
    const resolved = departmentCases.filter((item) => item.status === 'resolved').length;
    const rated = departmentCases.filter((item) => item.rating > 0);
    const averageRating = rated.length
      ? rated.reduce((sum, item) => sum + item.rating, 0) / rated.length
      : null;
    return {
      department,
      total: departmentCases.length,
      complaints,
      feedback,
      resolved,
      resolutionRate: departmentCases.length ? Math.round((resolved / departmentCases.length) * 100) : 0,
      averageRating,
    };
  }).sort((a, b) => b.total - a.total || departments.indexOf(a.department) - departments.indexOf(b.department));

  // Metrics
  const total = cases.length;
  const resolvedCount = cases.filter(c => c.status === 'resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;
  
  const ratedCases = cases.filter(c => c.rating > 0);
  const avgRating = ratedCases.length > 0 
    ? (ratedCases.reduce((acc, curr) => acc + curr.rating, 0) / ratedCases.length).toFixed(1)
    : 'N/A';

  const anonymousCount = cases.filter(c => c.anonymous).length;
  const anonymousRate = total > 0 ? Math.round((anonymousCount / total) * 100) : 0;

  // Legacy compliment cases are grouped with suggestions as unified feedback.
  const complaints = cases.filter(c => c.kind === 'complaint').length;
  const feedbackCount = cases.filter(c => c.kind === 'feedback' || c.kind === 'compliment').length;

  const categoryData = [
    {
      name: t.kindComplaint,
      value: complaints,
      color: '#f43f5e', // rose-500
      icon: AlertCircle,
    },
    {
      name: t.kindFeedback,
      value: feedbackCount,
      color: '#1d4ed8', // blue-700
      icon: Lightbulb,
    },
  ].filter(d => d.value > 0);

  // Status Distribution (Received, Under review, Resolved)
  const receivedCount = cases.filter(c => c.status === 'received').length;
  const inReviewCount = cases.filter(c => c.status === 'in_review').length;

  const statusData = [
    {
      name: t.statusReceived,
      count: receivedCount,
      fill: '#f59e0b', // amber-500
    },
    {
      name: t.statusInReview,
      count: inReviewCount,
      fill: '#3b82f6', // blue-500
    },
    {
      name: t.statusResolved,
      count: resolvedCount,
      fill: '#0ea5e9', // sky-500
    },
  ];

  // Custom clean tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-md text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            {data.name || data.payload?.name}
          </p>
          <p className="text-slate-500 dark:text-slate-400 font-mono">
            {data.value ?? data.payload?.count} {t.casesUnit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Top Quick KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Feedback */}
        <div className="bg-slate-50/70 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-1">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate">
            {t.totalCases}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {total}
            </span>
            <span className="text-[11px] text-slate-400">
              {t.submissionsUnit}
            </span>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-slate-50/70 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-1">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate">
            {t.resolutionRate}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400 tabular-nums">
              {resolutionRate}%
            </span>
            <span className="text-[11px] text-slate-400">
              ({resolvedCount}/{total})
            </span>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-slate-50/70 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-1">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate">
            {t.avgRating}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-bold font-mono text-amber-500 tabular-nums">
              {avgRating}
            </span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="text-[11px] text-slate-400">
              ({ratedCases.length} {t.reviewsUnit})
            </span>
          </div>
        </div>

        {/* Anonymous Rate */}
        <div className="bg-slate-50/70 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-1">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate">
            {t.anonymousRate}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-200 tabular-nums">
              {anonymousRate}%
            </span>
            <span className="text-[11px] text-slate-400">
              ({anonymousCount} {t.anonymousUnit})
            </span>
          </div>
        </div>
      </div>

      <section aria-labelledby="department-performance-heading" className="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 id="department-performance-heading" className="text-sm font-extrabold text-slate-900 dark:text-white">
              {t.departmentAnalysis}
            </h3>
            {departmentScope && (
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{getDeptName(departmentScope)}</p>
            )}
          </div>
          <span className="text-[10px] font-medium text-slate-400">
            {departmentData.length} {t.departmentsLabel}
          </span>
        </div>

        {departmentData.some(({ total: count }) => count > 0) ? (
          <div className="space-y-2.5">
            {departmentData.map((item) => (
              <article key={item.department} className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-700/80 dark:bg-slate-800/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="min-w-0 flex-1 text-xs font-bold text-slate-800 dark:text-slate-100">
                    {getDeptName(item.department)}
                  </h4>
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-slate-800 shadow-xs dark:bg-slate-900 dark:text-slate-100">
                    {item.total} <span className="font-sans font-medium text-slate-500">{t.departmentTotalCases}</span>
                  </span>
                </div>

                <div
                  className="mt-2.5 flex h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                  role="img"
                  aria-label={`${getDeptName(item.department)}: ${item.complaints} ${t.departmentComplaints}, ${item.feedback} ${t.departmentFeedback}`}
                >
                  {item.total > 0 && (
                    <>
                      <span className="bg-rose-500" style={{ width: `${(item.complaints / item.total) * 100}%` }} />
                      <span className="bg-blue-600" style={{ width: `${(item.feedback / item.total) * 100}%` }} />
                    </>
                  )}
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] sm:grid-cols-4">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-slate-500 dark:text-slate-400">{t.departmentComplaints}</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-300">{item.complaints}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-slate-500 dark:text-slate-400">{t.departmentFeedback}</span>
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-300">{item.feedback}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-slate-500 dark:text-slate-400">{t.departmentResolutionRate}</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{item.resolutionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-slate-500 dark:text-slate-400">{t.departmentAverageRating}</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-300">
                      {item.averageRating === null ? '—' : item.averageRating.toFixed(1)}
                      {item.averageRating !== null && <span className="ml-0.5 text-amber-500">★</span>}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {t.noDepartmentCases}
          </p>
        )}
      </section>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Chart 1: Categories Donut Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t.categoriesDistribution}
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {total} {t.totalUnit}
            </span>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400 italic">{t.noCategoryData}</div>
            )}
          </div>

          {/* Clean Legend */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block truncate">
                {t.kindComplaint}
              </span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                {complaints}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold block truncate">
                {t.kindFeedback}
              </span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                {feedbackCount}
              </span>
            </div>
          </div>
        </div>

        {/* Chart 2: Case Status Types Bar Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t.statusDistribution}
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {resolutionRate}% {t.resolvedUnit}
            </span>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }} 
                    stroke="#94a3b8" 
                    tickLine={false} 
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fontSize: 11 }} 
                    stroke="#94a3b8" 
                    tickLine={false} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400 italic">{t.noStatusData}</div>
            )}
          </div>

          {/* Clean Legend */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block truncate">
                {t.statusReceived}
              </span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                {receivedCount}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block truncate">
                {t.statusInReview}
              </span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                {inReviewCount}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold block truncate">
                {t.statusResolved}
              </span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                {resolvedCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
