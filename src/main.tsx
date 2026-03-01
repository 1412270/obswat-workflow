import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0b1f3a',
      dark: '#061225',
      light: '#1f3553',
    },
    secondary: {
      main: '#00a7b8',
      dark: '#007887',
      light: '#4fd0da',
    },
    info: {
      main: '#1f5ea8',
      light: '#4f88d1',
      dark: '#153d6e',
    },
    warning: {
      main: '#f4b740',
    },
    error: {
      main: '#e15050',
    },
    success: {
      main: '#00a36c',
    },
    background: {
      default: '#f5f8fc',
      paper: '#ffffff',
    },
    divider: '#e6edf5',
    text: {
      primary: '#0b1f3a',
      secondary: '#5c6f82',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #e6edf5',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
