import React from 'react';

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'danger';
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = 'Confirmer',
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'primary',
  onCancel,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onCancel} />
      <div className="bg-white rounded-lg shadow-lg z-50 w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {message && <div className="text-sm text-gray-600 mb-4">{message}</div>}
        <div className="flex justify-end gap-3">
          <button className="px-3 py-2 rounded border" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`px-4 py-2 rounded text-white ${
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
