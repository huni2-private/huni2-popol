'use client';
import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

type ToastState = { message: string; type: 'success' | 'error' } | null;

interface Props {
  toast: ToastState;
}

export function AdminToast({ toast }: Props) {
  if (!toast) return null;
  return (
    <div className="toast toast-top toast-end z-[9999]">
      <div className={`
        flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl font-bold text-sm
        animate-in slide-in-from-top-4 fade-in duration-300
        ${toast.type === 'success' ? 'bg-success text-success-content' : 'bg-error text-error-content'}
      `}>
        {toast.type === 'success'
          ? <CheckCircle2 className="w-4 h-4 shrink-0" />
          : <XCircle className="w-4 h-4 shrink-0" />}
        {toast.message}
      </div>
    </div>
  );
}

export function useAdminToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, showToast };
}
