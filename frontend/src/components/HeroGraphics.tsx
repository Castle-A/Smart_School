import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Item = {
  id: string;
  title: string;
  subtitle: string;
  lottieUrl?: string; // optional remote Lottie JSON
  anchor?: string; // optional anchor or route to navigate
};

const items: Item[] = [
  {
    id: 'planning',
    title: 'Planning & Emplois du temps',
    subtitle: "Gérez les emplois du temps et évitez les conflits",
    lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_x62chJ.json',
    anchor: '#planning',
  },
  {
    id: 'presence',
    title: 'Présences & Absences',
    subtitle: 'Saisie rapide et rapports détaillés',
    lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_sF7H5u.json',
    anchor: '#presence',
  },
  {
    id: 'grades',
    title: 'Notes & Bulletins',
    subtitle: 'Saisie, calculs et export des bulletins',
    lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_jcikwtux.json',
    anchor: '#grades',
  },
  // 5 additional cards to rotate continuously
  {
    id: 'tasks',
    title: 'Tâches & Devoirs',
    subtitle: 'Assignez et suivez les tâches des élèves',
    lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_touohxv6.json',
    anchor: '#tasks',
  },
  {
    id: 'comms',
    title: 'Communication',
    subtitle: 'Messagerie entre enseignants, parents et élèves',
    lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_9wpyhdzo.json',
    anchor: '#comms',
  },
  {
    id: 'docs',
    title: 'Documents & Ressources',
    subtitle: 'Centralisez PDF, devoirs et supports de cours',
    lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_5ngs2ksb.json',
    anchor: '#docs',
  },
  {
    id: 'reports',
    title: 'Rapports & Analyses',
    subtitle: 'Tableaux de bord et indicateurs clés',
    lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_ktm6z9fh.json',
    anchor: '#reports',
  },
  {
    id: 'parents',
    title: 'Portail Parents',
    subtitle: 'Accès dédié aux parents et responsables',
    lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_sbyf16vz.json',
    anchor: '#parents',
  },
];

function LottiePlayer({ url, containerId }: { url?: string; containerId: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
  let anim: { destroy?: () => void } | null = null;
    let cancelled = false;
    if (!url) return;
    (async () => {
      try {
        // minimal Lottie interface to avoid using `any`
        interface LottiePlayer {
          loadAnimation(opts: {
            container: Element;
            renderer: 'svg' | 'canvas' | 'html';
            loop: boolean;
            autoplay: boolean;
            animationData: unknown;
          }): { destroy?: () => void };
        }

        // ensure lottie is available on window — load script dynamically if needed
        const ensureLottie = async (): Promise<LottiePlayer | undefined> => {
          const win = window as unknown as { lottie?: unknown };
          if (win.lottie) return win.lottie as LottiePlayer;
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/lottie-web@5.10.1/build/player/lottie.min.js';
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('Failed to load lottie'));
            document.head.appendChild(s);
          });
          return (window as unknown as { lottie?: unknown }).lottie as LottiePlayer | undefined;
        };

        const lottie = await ensureLottie();
        if (!lottie) return;
        const res = await fetch(url);
        const json = await res.json();
        if (cancelled) return;
        anim = lottie.loadAnimation({ container: containerRef.current!, renderer: 'svg', loop: true, autoplay: true, animationData: json });
      } catch {
        // swallow; fallback to static
      }
    })();
    return () => {
      cancelled = true;
      try { anim?.destroy?.(); } catch { void 0; }
    };
  }, [url, containerId]);
  return <div id={containerId} ref={containerRef} className="w-full h-48 flex items-center justify-center" />;
}

export default function HeroGraphics() {
  const [index, setIndex] = useState(0);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, []);

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  // display window size (number of cards visible at once)
  const windowSize = 4;

  return (
    <div className="my-10">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-indigo-50 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Découvrir Smart School</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {(() => {
              const visibleItems: { item: Item; idx: number }[] = [];
              for (let i = 0; i < windowSize; i++) {
                const idx = (index + i) % items.length;
                visibleItems.push({ item: items[idx], idx });
              }

              return visibleItems.map(({ item, idx }, pos) => {
                const variants = {
                  hidden: { opacity: 0.4, y: 8, scale: 0.97 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                } as const;

                const transition = shouldReduceMotion
                  ? { duration: 0.12 }
                  : { duration: 0.45, ease: [0.2, 0.8, 0.2, 1], delay: pos * 0.06 };

                return (
                  <motion.div
                    key={item.id}
                    className={`p-4 rounded-xl bg-white border border-gray-100 shadow-sm`}
                    initial={shouldReduceMotion ? undefined : 'hidden'}
                    animate={'visible'}
                    variants={variants}
                    transition={transition}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  >
                    <div className="h-36 flex items-center justify-center">
                        {/* animated illustration: Lottie if available, otherwise simple animated SVG */}
                        {item.lottieUrl ? (
                          <motion.div
                            className="w-full h-full flex items-center justify-center"
                            animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
                            transition={shouldReduceMotion ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <LottiePlayer url={item.lottieUrl} containerId={`lottie-${item.id}`} />
                          </motion.div>
                        ) : (
                          <motion.div
                            className="w-20 h-20 rounded-full bg-indigo-500"
                            animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
                            transition={shouldReduceMotion ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="text-lg font-semibold text-gray-800">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.subtitle}</div>
                      </div>
                      <div className="mt-3 flex items-center justify-end">
                        <div className="text-xs text-gray-400">{idx + 1}/{items.length}</div>
                      </div>
                  </motion.div>
                );
              });
            })()}
          </div>

          {/* controls */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <button onClick={goPrev} aria-label="Précédent" className="bg-white p-2 rounded-full shadow">‹</button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button onClick={goNext} aria-label="Suivant" className="bg-white p-2 rounded-full shadow">›</button>
          </div>

          {/* dots */}
          <div className="mt-4 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Aller à ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full ${i === index ? 'bg-indigo-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
