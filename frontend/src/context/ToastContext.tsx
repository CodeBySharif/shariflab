import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { Alert, Snackbar } from '@mui/material'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_VISIBLE_MS = 3200

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null)
  const nextId = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++nextId.current
    setToast({ id, message, type })
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), TOAST_VISIBLE_MS)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={!!toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => setToast(null)}
      >
        <Alert
          onClose={() => setToast(null)}
          severity={toast?.type === 'error' ? 'error' : 'success'}
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: 3,
            fontWeight: 500,
          }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
