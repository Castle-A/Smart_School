import React, { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, []);

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="my-10">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-indigo-50 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Découvrir Smart School</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className={`p-4 rounded-xl bg-white border border-gray-100 shadow-sm transform transition-all ${idx === index ? 'scale-100' : 'scale-95 opacity-60'}`}
                aria-hidden={idx !== index}
              >
                <div className="h-48 flex items-center justify-center">
                  {it.lottieUrl ? <LottiePlayer url={it.lottieUrl} containerId={`lottie-${it.id}`} /> : <div className="w-20 h-20 rounded-full bg-indigo-500" />}
                </div>
                <div className="mt-4">
                  <div className="text-lg font-semibold text-gray-800">{it.title}</div>
                  <div className="text-sm text-gray-500">{it.subtitle}</div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <a href={it.anchor ?? '#'} className="text-indigo-600 font-medium hover:underline">En savoir plus</a>
                  <div className="text-xs text-gray-400">{idx + 1}/{items.length}</div>
                </div>
              </div>
            ))}
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
