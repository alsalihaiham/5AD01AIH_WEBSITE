type Group = {dimensions?: {date?: string}; sum?: {requests?: number; pageViews?: number}; uniq?: {uniques?: number}};
export type Answer = {errors?: {message?: string}[]; data?: {viewer?: {zones?: {httpRequests1dGroups?: Group[]}[]}}} | null | undefined;

export type Day = {date: string; requests: number; pageViews: number; visitors: number};

/** Turns the Cloudflare GraphQL answer into plain numbers; tolerant of missing data. */
export function parseStats(data: Answer): {error?: string; days: Day[]; totals: {requests: number; pageViews: number; visitors: number}} {
  const errors = data?.errors;
  if (Array.isArray(errors) && errors.length) return {error: String(errors[0]?.message || 'Onbekende fout van Cloudflare.'), days: [], totals: {requests: 0, pageViews: 0, visitors: 0}};
  const groups: Group[] = data?.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];
  const days = groups.map(g => ({date: String(g?.dimensions?.date ?? ''), requests: Number(g?.sum?.requests) || 0, pageViews: Number(g?.sum?.pageViews) || 0, visitors: Number(g?.uniq?.uniques) || 0})).filter(d => d.date);
  const last7 = days.slice(-7);
  return {days, totals: {requests: last7.reduce((n, d) => n + d.requests, 0), pageViews: last7.reduce((n, d) => n + d.pageViews, 0), visitors: last7.reduce((n, d) => n + d.visitors, 0)}};
}
