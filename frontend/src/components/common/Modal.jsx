import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-slate-900 bg-opacity-50 transition-opacity" 
          onClick={onClose} 
        />
        
        <div className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full ${maxWidth} z-10 border border-slate-200`}>
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
