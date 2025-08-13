import { createContext, useContext, useState, ReactNode } from "react";
import Toast, { ToastProps } from "@/components/Toast";

interface ToastContextType {
  showToast: (message: string, type: ToastProps["type"], duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastState {
  id: string;
  message: string;
  type: ToastProps["type"];
  duration?: number;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: ToastProps["type"], duration?: number) => {
    const id = Date.now().toString();
    const newToast: ToastState = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string, duration?: number) => {
    showToast(message, "success", duration);
  };

  const showError = (message: string, duration?: number) => {
    showToast(message, "error", duration);
  };

  const showWarning = (message: string, duration?: number) => {
    showToast(message, "warning", duration);
  };

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}