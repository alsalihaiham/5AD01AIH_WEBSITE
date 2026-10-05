// Plain module: values exported from a 'use client' file become client references on the server.
export const THEME_KEY = 'hp-theme';
/** Runs before first paint so the page never flashes in the wrong theme. Dark is the house style. */
export const themeScript = `(function(){var d=document.documentElement;d.classList.add('hp-js');try{var t=localStorage.getItem('${THEME_KEY}');d.dataset.theme=t==='light'?'light':'dark'}catch(e){d.dataset.theme='dark'}})();`;
