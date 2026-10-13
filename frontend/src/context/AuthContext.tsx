import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import api, { getToken, setToken } from '../api/client'
import type { AuthUser } from '../types'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  login: (login: string, password: string) => Promise<void>
  register: (input: {
    username: string
    email: string
    password: string
    displayName?: string
  }) => Promise<void>
  signOut: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      return
    }
    const { data } = await api.get<{ user: AuthUser }>('/auth/me')
    setUser(data.user)
  }, [])

  useEffect(() => {
    refreshUser()
      .catch(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [refreshUser])

  const login = async (loginValue: string, password: string) => {
    const { data } = await api.post<{ token: string; user: AuthUser }>('/auth/login', {
      login: loginValue,
      password,
    })
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (input: {
    username: string
    email: string
    password: string
    displayName?: string
  }) => {
    const { data } = await api.post<{ token: string; user: AuthUser }>('/auth/register', input)
    setToken(data.token)
    setUser(data.user)
  }

  const signOut = () => {
    setToken(null)
    setUser(null)
    window.location.replace(`/login?signed_out=${Date.now()}`)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
