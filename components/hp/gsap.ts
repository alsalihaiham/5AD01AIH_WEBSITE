import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';

// Registering starts GSAP's ticker, which falls back to setTimeout without requestAnimationFrame.
// Cloudflare Workers reject timers at module scope, so plugins are only registered in the browser.
if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP, ScrollTrigger);

export {gsap, ScrollTrigger, useGSAP};
