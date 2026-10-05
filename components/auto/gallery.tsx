'use client';
import {useCallback, useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Play, Expand, Share2, X, ChevronLeft, ChevronRight} from 'lucide-react';
import {Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose} from '@/components/ui/dialog';
import type {Media} from '@/lib/types';
import {copy, type Lang} from '@/lib/i18n';

export function ShareButton({title, lang = 'nl'}: {title: string; lang?: Lang}) {
  const t = copy[lang], [status, setStatus] = useState('');
  async function share() {
    try {
      if (navigator.share) await navigator.share({title, url: location.href});
      else { await navigator.clipboard.writeText(location.href); setStatus(t.copied); }
    } catch (e) { if ((e as Error).name !== 'AbortError') setStatus(location.href); }
  }
  return <span className="hp-share"><button className="hp-icon-btn" onClick={share}><Share2 size={16}/>{t.share}</button><span role="status" className="share-status">{status}</span></span>;
}

export default function Gallery({media, title, lang = 'nl'}: {media: Media[]; title: string; lang?: Lang}) {
  const t = copy[lang];
  const [[selected, dir], setSelected] = useState<[number, number]>([0, 0]);
  const [open, setOpen] = useState(false);
  const count = media.length;
  const go = useCallback((step: number) => setSelected(([n]) => [(n + step + count) % count, step]), [count]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (open || !(e.target instanceof HTMLElement) || e.target.closest('input,textarea,select')) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [go, open]);
  const item = media[selected];
  if (!item) return <div className="hp-gallery-empty">{t.noPhotos}</div>;

  return <div className="hp-viewer">
    <div className="hp-viewer-main">
      <AnimatePresence initial={false} custom={dir}>
        <motion.div key={item.id} className="hp-viewer-slide" custom={dir}
          initial={{opacity: 0, x: dir * 60, scale: 1.04}} animate={{opacity: 1, x: 0, scale: 1}} exit={{opacity: 0, x: dir * -60}}
          transition={{duration: .6, ease: [0.22, 1, 0.36, 1]}}>
          {item.type === 'image'
            ? <button onClick={() => setOpen(true)} aria-label={t.enlarge}><img src={item.url} alt={item.alt || title} width="1920" height="1080" fetchPriority={selected === 0 ? 'high' : 'auto'}/></button>
            : <video src={item.url} controls playsInline preload="metadata" aria-label={t.video + ' ' + title}/>}
        </motion.div>
      </AnimatePresence>
      <span className="hp-viewer-count">{String(selected + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
      {item.type === 'image' && <button className="hp-viewer-expand" onClick={() => setOpen(true)} aria-label={t.enlarge}><Expand size={16}/></button>}
      {count > 1 && <>
        <button className="hp-viewer-nav is-prev" onClick={() => go(-1)} aria-label={t.prev}><ChevronLeft size={22}/></button>
        <button className="hp-viewer-nav is-next" onClick={() => go(1)} aria-label={t.next}><ChevronRight size={22}/></button>
      </>}
    </div>
    {count > 1 && <div className="hp-thumbs">
      {media.map((m, i) => <button key={m.id} className={selected === i ? 'is-active' : ''} onClick={() => setSelected([i, i > selected ? 1 : -1])}
        aria-label={m.type === 'video' ? t.video : t.gallery + ' ' + (i + 1)} aria-pressed={selected === i}>
        {m.type === 'image' ? <img src={m.url} width="200" height="130" loading="lazy" alt=""/> : <span><Play size={20}/>{t.video}</span>}
      </button>)}
    </div>}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gallery-modal hp-lightbox" showCloseButton={false} onKeyDown={e => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); }}>
        <DialogTitle className="sr-only">{title} — {t.gallery}</DialogTitle>
        <DialogDescription className="sr-only">{t.prev} / {t.next}</DialogDescription>
        <DialogClose className="gallery-close" aria-label={t.close}><X size={23}/></DialogClose>
        {item.type === 'image' ? <img src={item.url} alt={item.alt || title} width="1920" height="1080"/> : <video key={item.id} src={item.url} controls playsInline/>}
        <div className="gallery-modal-controls"><button onClick={() => go(-1)}>{t.prev}</button><span>{selected + 1} / {count}</span><button onClick={() => go(1)}>{t.next}</button></div>
      </DialogContent>
    </Dialog>
  </div>;
}
