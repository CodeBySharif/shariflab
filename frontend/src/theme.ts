import { createTheme, type Theme } from '@mui/material/styles'

/** DESIGN.md tokens — single system across auth, list, detail, settings. */
export const tokens = {
  primary: '#3b82f6',
  onPrimary: '#000000',
  primaryHover: '#2563eb',
  canvas: '#0f0f11',
  canvasSoft: '#18181b',
  ink: '#fafafa',
  inkMuted: '#a1a1aa',
  inkSubtle: '#818181',
  hairline: '#27272a',
  success: '#4ade80',
  warning: '#fbbf24',
  error: '#f87171',
  radiusSm: 4,
  radiusMd: 8,
  radiusLg: 12,
} as const

const fontFamily = '"Inter", system-ui, sans-serif'
const monoFamily = '"JetBrains Mono", ui-monospace, monospace'

/**
 * Skeuomorphic flourish purpose (R-01 / DESIGN.md uiStyle):
 * Primary buttons get a soft top highlight so the single accent action feels pressable.
 * Cards use a hairline + faint top edge on tonal layers (canvas on canvas-soft), not floating shadows.
 */
function skeuoPrimaryContained(isDark: boolean) {
  return {
    color: tokens.onPrimary,
    backgroundColor: tokens.primary,
    backgroundImage: isDark
      ? 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 42%)'
      : 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%)',
    boxShadow: isDark
      ? 'inset 0 1px 0 rgba(255,255,255,0.22), 0 1px 0 rgba(0,0,0,0.35)'
      : 'inset 0 1px 0 rgba(255,255,255,0.45), 0 1px 2px rgba(15,23,42,0.12)',
    '&:hover': {
      backgroundColor: tokens.primaryHover,
      backgroundImage: isDark
        ? 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 42%)'
        : 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 45%)',
    },
    '&:active': {
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.28)',
      backgroundImage: 'none',
    },
  }
}

export function createAppTheme(mode: 'light' | 'dark'): Theme {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.primary,
        dark: tokens.primaryHover,
        contrastText: tokens.onPrimary,
      },
      background: isDark
        ? { default: tokens.canvasSoft, paper: tokens.canvas }
        : { default: '#f4f4f5', paper: '#ffffff' },
      text: isDark
        ? { primary: tokens.ink, secondary: tokens.inkMuted, disabled: tokens.inkSubtle }
        : { primary: '#18181b', secondary: '#71717a', disabled: '#a1a1aa' },
      divider: isDark ? tokens.hairline : '#e4e4e7',
      success: { main: tokens.success },
      error: { main: tokens.error },
      warning: { main: tokens.warning },
      action: isDark
        ? { hover: 'rgba(250,250,250,0.06)' }
        : { hover: 'rgba(24,24,27,0.04)' },
    },
    typography: {
      fontFamily,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      h1: { fontFamily, fontWeight: 700, fontSize: '2.25rem', lineHeight: 1.15, letterSpacing: '-0.01em' },
      h2: { fontFamily, fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2, letterSpacing: '-0.01em' },
      h3: { fontFamily, fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.25 },
      h4: { fontFamily, fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.3 },
      h5: { fontFamily, fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.3 },
      h6: { fontFamily, fontWeight: 600, fontSize: '1rem', lineHeight: 1.35 },
      subtitle1: { fontFamily, fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.4 },
      subtitle2: { fontFamily, fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4 },
      body1: { fontFamily, fontWeight: 400, fontSize: '1rem', lineHeight: 1.5 },
      body2: { fontFamily, fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.4 },
      caption: { fontFamily, fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.4, color: undefined },
      overline: {
        fontFamily,
        fontWeight: 600,
        fontSize: '0.6875rem',
        lineHeight: 1.2,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      button: { fontFamily, fontWeight: 600, textTransform: 'none', fontSize: '0.875rem', lineHeight: 1.2 },
    },
    shape: { borderRadius: tokens.radiusMd },
    spacing: 8,
    breakpoints: {
      values: { xs: 0, sm: 480, md: 768, lg: 1024, xl: 1280 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { height: '100%' },
          body: {
            height: '100%',
            overflowY: 'auto',
            backgroundColor: isDark ? tokens.canvasSoft : '#f4f4f5',
            color: isDark ? tokens.ink : '#18181b',
          },
          '#root': { minHeight: '100%' },
          code: { fontFamily: monoFamily },
          pre: { fontFamily: monoFamily },
          '*::-webkit-scrollbar': { width: 10, height: 10 },
          '*::-webkit-scrollbar-track': {
            background: isDark ? tokens.canvasSoft : '#f4f4f5',
          },
          '*::-webkit-scrollbar-thumb': {
            background: isDark ? '#3f3f46' : '#d4d4d8',
            borderRadius: tokens.radiusMd,
            border: `2px solid ${isDark ? tokens.canvasSoft : '#f4f4f5'}`,
          },
          '*:focus-visible': {
            outline: `2px solid ${tokens.primary}`,
            outlineOffset: 2,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: tokens.radiusMd,
            minHeight: 40,
            padding: '8px 16px',
            fontWeight: 600,
          },
          sizeSmall: {
            minHeight: 40,
            fontSize: '0.8125rem',
            padding: '8px 14px',
          },
          sizeLarge: {
            minHeight: 48,
            fontSize: '1rem',
            padding: '12px 24px',
          },
          contained: {
            '&.MuiButton-colorPrimary': skeuoPrimaryContained(isDark),
          },
          outlined: {
            borderColor: isDark ? tokens.hairline : '#e4e4e7',
            backgroundColor: isDark ? tokens.canvas : '#ffffff',
            '&:hover': {
              borderColor: isDark ? '#3f3f46' : '#d4d4d8',
              backgroundColor: isDark ? 'rgba(250,250,250,0.04)' : 'rgba(24,24,27,0.03)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radiusMd,
            '&:focus-visible': {
              outline: `2px solid ${tokens.primary}`,
              outlineOffset: 2,
            },
          },
          sizeSmall: { minWidth: 40, minHeight: 40 },
        },
      },
      MuiTooltip: {
        defaultProps: {
          arrow: true,
          enterDelay: 200,
          slotProps: {
            popper: {
              modifiers: [{ name: 'offset', options: { offset: [0, -6] } }],
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radiusMd,
            backgroundColor: isDark ? tokens.canvas : '#ffffff',
            minHeight: 44,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#3f3f46' : '#d4d4d8',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.primary,
              borderWidth: 1,
            },
          },
          notchedOutline: {
            borderColor: isDark ? tokens.hairline : '#e4e4e7',
          },
          input: {
            padding: '12px 16px',
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: isDark
              ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 28%)'
              : 'none',
            backgroundColor: isDark ? tokens.canvas : '#ffffff',
            border: `1px solid ${isDark ? tokens.hairline : '#e4e4e7'}`,
            borderRadius: tokens.radiusLg,
            boxShadow: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: tokens.primary,
            color: '#ffffff',
            borderBottom: '1px solid rgba(0,0,0,0.12)',
            boxShadow: 'none',
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: '56px !important',
            paddingTop: 8,
            paddingBottom: 8,
          },
        },
      },
      MuiContainer: {
        defaultProps: {
          maxWidth: false,
          disableGutters: true,
        },
        styleOverrides: {
          root: {
            width: '100%',
            maxWidth: 'none',
            marginLeft: 0,
            marginRight: 0,
            paddingLeft: 24,
            paddingRight: 24,
            boxSizing: 'border-box',
            '@media (max-width:768px)': {
              paddingLeft: 16,
              paddingRight: 16,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radiusSm,
            fontWeight: 600,
          },
          sizeSmall: {
            height: 22,
            fontSize: '0.6875rem',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 44,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 44 },
          indicator: { height: 2 },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: tokens.radiusLg,
            border: `1px solid ${isDark ? tokens.hairline : '#e4e4e7'}`,
            backgroundImage: isDark
              ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 24%)'
              : 'none',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: tokens.radiusMd },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: tokens.primary,
            textUnderlineOffset: 2,
          },
        },
      },
    },
  })
}
