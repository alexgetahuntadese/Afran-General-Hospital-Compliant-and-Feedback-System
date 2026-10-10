import { CaseSubmission, SubmissionKind, SubmissionStatus } from '../types/hospital';
import { DEPARTMENTS } from '../data/seedData';

export interface ReportFilters {
  kind?: SubmissionKind;
  status?: SubmissionStatus;
  unresolvedOnly?: boolean;
  department?: string;
  since?: Date;
}

export interface ReportResult {
  title: string;
  description: string;
  cases: CaseSubmission[];
  filters: ReportFilters;
  departmentBreakdown: Array<{ department: string; total: number; unresolved: number; resolved: number }>;
  insights: string[];
}

function findDepartment(query: string): string | undefined {
  const normalized = query.toLowerCase();
  return DEPARTMENTS.find((department) => {
    const aliases = department
      .toLowerCase()
      .replace(/[()&]/g, ' ')
      .split(/\s+/)
      .filter((part) => part.length > 2);
    return aliases.length > 0 && aliases.every((part) => normalized.includes(part));
  });
}

function getSince(query: string): Date | undefined {
  const now = new Date();
  const match = query.match(/(?:last|past)\s+(\d+)\s+days?/i);
  if (match) {
    const since = new Date(now);
    since.setDate(since.getDate() - Number(match[1]));
    return since;
  }
  if (/today/i.test(query)) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (/this\s+week/i.test(query)) {
    const since = new Date(now);
    since.setDate(since.getDate() - since.getDay());
    since.setHours(0, 0, 0, 0);
    return since;
  }
  if (/this\s+month/i.test(query)) {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return undefined;
}

export function buildReport(query: string, allCases: CaseSubmission[]): ReportResult {
  const normalized = query.trim().toLowerCase();
  const filters: ReportFilters = {};

  if (/complaint|complaints|problem|error/i.test(normalized)) filters.kind = 'complaint';
  else if (/compliment|praise|thank/i.test(normalized)) filters.kind = 'compliment';
  else if (/feedback|suggestion|suggestions/i.test(normalized)) filters.kind = 'feedback';

  if (/unresolved|open|pending|not resolved/i.test(normalized)) filters.unresolvedOnly = true;
  else if (/resolved|closed|complete/i.test(normalized)) filters.status = 'resolved';
  else if (/in review|under review|reviewing/i.test(normalized)) filters.status = 'in_review';
  else if (/received|new/i.test(normalized)) filters.status = 'received';

  filters.department = findDepartment(normalized);
  filters.since = getSince(normalized);

  const cases = allCases.filter((item) => {
    if (filters.kind && item.kind !== filters.kind) return false;
    if (filters.unresolvedOnly && item.status === 'resolved') return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.department && (item.assignedDepartment ?? item.department) !== filters.department) return false;
    if (filters.since && new Date(item.submittedAt) < filters.since) return false;
    return true;
  });

  const labelKind = filters.kind === 'complaint'
    ? 'complaints'
    : filters.kind === 'feedback'
      ? 'feedback submissions'
      : filters.kind === 'compliment'
        ? 'compliments'
        : 'submissions';
  const labelStatus = filters.unresolvedOnly
    ? 'that are unresolved'
    : filters.status
      ? `with status ${filters.status.replace('_', ' ')}`
      : '';
  const labelDepartment = filters.department ? ` for ${filters.department}` : '';
  const labelDate = filters.since ? ` since ${filters.since.toLocaleDateString()}` : '';
  const departmentBreakdown = Array.from(new Set(cases.map((item) => item.assignedDepartment ?? item.department)))
    .map((department) => {
      const departmentCases = cases.filter((item) => (item.assignedDepartment ?? item.department) === department);
      return {
        department,
        total: departmentCases.length,
        unresolved: departmentCases.filter((item) => item.status !== 'resolved').length,
        resolved: departmentCases.filter((item) => item.status === 'resolved').length,
      };
    })
    .sort((a, b) => b.total - a.total);
  const ratings = cases.filter((item) => item.rating > 0);
  const averageRating = ratings.length ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length : null;
  const insights: string[] = [];
  if (!cases.length) insights.push('No cases match this request. Try a wider date range or remove a filter.');
  if (departmentBreakdown[0]) insights.push(`${departmentBreakdown[0].department} has the largest share with ${departmentBreakdown[0].total} case${departmentBreakdown[0].total === 1 ? '' : 's'}.`);
  const unresolved = cases.filter((item) => item.status !== 'resolved').length;
  if (cases.length) insights.push(`${unresolved} of ${cases.length} case${cases.length === 1 ? '' : 's'} remain unresolved (${Math.round((unresolved / cases.length) * 100)}%).`);
  if (averageRating !== null) insights.push(`Average rating is ${averageRating.toFixed(1)} out of 5 across ${ratings.length} rated case${ratings.length === 1 ? '' : 's'}.`);
  const unseen = cases.filter((item) => item.kind === 'complaint' && !item.departmentHeadChecked).length;
  if (unseen) insights.push(`${unseen} complaint${unseen === 1 ? '' : 's'} have not yet been marked seen by a department head.`);

  return {
    title: `${labelKind.charAt(0).toUpperCase()}${labelKind.slice(1)} report`,
    description: `Showing ${cases.length} ${labelKind}${labelStatus ? ` ${labelStatus}` : ''}${labelDepartment}${labelDate}.`,
    cases,
    filters,
    departmentBreakdown,
    insights,
  };
}
