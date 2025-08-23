import Toast, { ToastProps } from '@/components/common/Toast'
import { createContext, ReactNode, useContext, useState } from 'react'

type ToastOptions = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

type ToastContextType = {
  showToast: (message: string, type: ToastProps['type'], duration?: number) => void
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
  toast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

type ToastProviderProps = {
  children: ReactNode
}

type ToastState = {
  id: string
  message: string
  type: ToastProps['type']
  duration?: number
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const showToast = (message: string, type: ToastProps['type'], duration?: number) => {
    const id = Date.now().toString()
    const newToast: ToastState = { id, message, type, duration }

    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showSuccess = (message: string, duration?: number) => {
    showToast(message, 'success', duration)
  }

  const showError = (message: string, duration?: number) => {
    showToast(message, 'error', duration)
  }

  const showWarning = (message: string, duration?: number) => {
    showToast(message, 'warning', duration)
  }

  // @bookmark-pro/ui 호환성을 위한 toast 함수
  const toast = (options: ToastOptions) => {
    const message = options.description || options.title || ''
    let type: ToastProps['type'] = 'success'

    if (options.variant === 'destructive') {
      type = 'error'
    } else if (options.title?.includes('경고') || options.description?.includes('경고')) {
      type = 'warning'
    }

    showToast(message, type, options.duration)
  }

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    toast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 bottom-4 left-4 z-50 pointer-events-none">
        <div className="mx-auto space-y-2 max-w-md">
          {toasts.map((toast, index) => (
            <div
              key={toast.id}
              className="pointer-events-auto"
              style={{
                transform: `translateY(${index * 8}px)`,
                zIndex: 50 - index,
              }}
            >
              <Toast
                type={toast.type}
                message={toast.message}
                duration={toast.duration}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
