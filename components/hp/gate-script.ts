// Shared by the server page (inline script) and the client gate/hero. Must stay a plain module:
// values exported from a 'use client' file are client references on the server, not strings.
export const GATE_KEY = 'hp-route';
export const GATE_EVENT = 'hp:enter';

/**
 * Runs before first paint: opens the gate for a fresh visit to the home page so
 * the page cannot be scrolled until the visitor picks a direction.
 */
export const gateScript = `(function(){try{var d=document.documentElement;if(!location.hash&&!sessionStorage.getItem('${GATE_KEY}'))d.classList.add('hp-gate-open')}catch(e){}})();`;
