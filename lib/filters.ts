import type {Car} from './types';

export type Sort = 'new' | 'priceAsc' | 'priceDesc' | 'km';
export type Filters = {brand: string; budget: number; fuel: string; sort: Sort};
export const NO_FILTERS: Filters = {brand: '', budget: 0, fuel: '', sort: 'new'};
/** Fired by the hero search so the stock grid updates without a page reload. */
export const FILTER_EVENT = 'hp:filter';

const SORTS: Sort[] = ['new', 'priceAsc', 'priceDesc', 'km'];

/** Reads ?merk=&budget=&brandstof=&sort= so a search can be shared as a link. */
export function readFilters(params: Record<string, string | string[] | undefined>): Filters {
  const one = (k: string) => {const v = params[k]; return (Array.isArray(v) ? v[0] : v) || '';};
  const budget = Number(one('budget'));
  const sort = one('sort') as Sort;
  return {brand: one('merk').slice(0, 40), budget: Number.isFinite(budget) && budget > 0 ? budget : 0, fuel: one('brandstof').slice(0, 20), sort: SORTS.includes(sort) ? sort : 'new'};
}

export function filterQuery(f: Filters): string {
  const q = new URLSearchParams();
  if (f.brand) q.set('merk', f.brand);
  if (f.budget) q.set('budget', String(f.budget));
  if (f.fuel) q.set('brandstof', f.fuel);
  if (f.sort !== 'new') q.set('sort', f.sort);
  return q.toString();
}

export function applyFilters(cars: Car[], f: Filters): Car[] {
  const list = cars.filter(c =>
    (!f.brand || c.brand.toLowerCase() === f.brand.toLowerCase()) &&
    (!f.budget || c.price <= f.budget) &&
    (!f.fuel || c.fuel === f.fuel));
  // Sold cars stay visible as proof of activity, but never above available ones.
  const sold = (c: Car) => c.status === 'sold' ? 1 : 0;
  const by: Record<Sort, (a: Car, b: Car) => number> = {
    new: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    km: (a, b) => a.km - b.km,
  };
  return list.sort((a, b) => sold(a) - sold(b) || by[f.sort](a, b));
}
