import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeProvider } from '@mui/material'
import { createAppTheme } from '../theme'

type ColorMode = 'light' | 'dark'

interface ColorModeState {
  mode: ColorMode
  toggleMode: () => void
}

const ColorModeContext = createContext<ColorModeState | null>(null)

const STORAGE_KEY = 'sharif-lab-color-mode'

function getInitialMode(): ColorMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return 'dark'
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>(getInitialMode)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute('data-color-mode', mode)
  }, [mode])

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
    }),
    [mode],
  )

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export function useColorMode() {
  const ctx = useContext(ColorModeContext)
  if (!ctx) throw new Error('useColorMode must be used within ColorModeProvider')
  return ctx
}
