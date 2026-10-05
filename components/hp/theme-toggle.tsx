'use client';
import {Moon, Sun} from 'lucide-react';
import {THEME_KEY} from '@/lib/theme';

// Both icons are rendered; CSS shows the one for the theme you would switch to, so no state is needed.
export default function ThemeToggle({label}: {label: string}) {
  function toggle() {
    const d = document.documentElement;
    const next = d.dataset.theme === 'light' ? 'dark' : 'light';
    d.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  }
  return <button type="button" className="hp-theme-btn" onClick={toggle} aria-label={label} title={label}>
    <Sun size={18} className="is-sun"/><Moon size={18} className="is-moon"/>
  </button>;
}
