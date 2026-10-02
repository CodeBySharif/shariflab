import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline } from '@mui/material'
import { AuthProvider } from './context/AuthContext'
import { ColorModeProvider } from './context/ColorModeContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectAnalyticsPage from './pages/ProjectAnalyticsPage'
import ProjectFormPage from './pages/ProjectFormPage'
import { queryClient } from './lib/queryClient'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeProvider>
        <CssBaseline />
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/" element={<ProjectsPage />} />
                  <Route path="/projects/:id" element={<ProjectAnalyticsPage />} />
                  <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ColorModeProvider>
    </QueryClientProvider>
  )
}
