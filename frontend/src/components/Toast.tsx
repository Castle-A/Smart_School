import React, { useEffect } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onClose?: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, type = 'success', visible, onClose }) => {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onClose && onClose(), 3000);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  if (!visible) return null;

  const bg = type === 'success' ? 'bg-green-100 border-green-200 text-green-800' : type === 'error' ? 'bg-red-100 border-red-200 text-red-800' : 'bg-blue-100 border-blue-200 text-blue-800';

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className={`${bg} px-4 py-2 rounded shadow-md`}>{message}</div>
    </div>
  );
};

export default Toast;
