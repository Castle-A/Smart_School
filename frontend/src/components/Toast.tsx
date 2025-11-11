import React, { useEffect, useState } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  duration?: number; // ms
  onClose?: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, type = 'success', visible, duration = 2500, onClose }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [fading, setFading] = useState(false);

  // respect prefers-reduced-motion
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fadeMs = prefersReduced ? 0 : 200;

  useEffect(() => {
    if (!visible) {
      setMounted(false);
      setFading(false);
      return;
    }
    setMounted(true);
    setFading(false);

    const fadeStart = Math.max(0, duration - fadeMs);
    const t1 = setTimeout(() => setFading(true), fadeStart);
    const t2 = setTimeout(() => {
      setMounted(false);
      setFading(false);
      onClose?.();
    }, duration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visible, duration, fadeMs, onClose]);

  if (!mounted) return null;

  const bg = type === 'success' ? 'bg-green-100 border-green-200 text-green-800' : type === 'error' ? 'bg-red-100 border-red-200 text-red-800' : 'bg-blue-100 border-blue-200 text-blue-800';

  const style: React.CSSProperties = prefersReduced
    ? {}
    : { transition: `opacity ${fadeMs}ms ease`, opacity: fading ? 0 : 1 };

  return (
    <div className="fixed top-6 right-6 z-50">
      <div style={style} className={`${bg} px-4 py-2 rounded shadow-md`}>{message}</div>
    </div>
  );
};

export default Toast;
