import { create } from 'zustand'
import { User } from '../types'
import api from '../services/api'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  initialized: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  googleLogin: (credential: string) => Promise<void>
  guestLogin: () => Promise<void>
  logout: () => void
  loadUser: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('jihesabu_token'),
  loading: false,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('jihesabu_token', data.token)
      set({ user: data.user, token: data.token, loading: false })
    } catch (error: any) {
      set({ loading: false })
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  register: async (email, password, name) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/register', { email, password, name })
      localStorage.setItem('jihesabu_token', data.token)
      set({ user: data.user, token: data.token, loading: false })
    } catch (error: any) {
      set({ loading: false })
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  googleLogin: async (credential) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/google', { credential })
      localStorage.setItem('jihesabu_token', data.token)
      set({ user: data.user, token: data.token, loading: false })
    } catch (error: any) {
      set({ loading: false })
      throw new Error(error.response?.data?.message || 'Google login failed')
    }
  },

  guestLogin: async () => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/guest')
      localStorage.setItem('jihesabu_token', data.token)
      set({ user: data.user, token: data.token, loading: false })
    } catch (error: any) {
      set({ loading: false })
      throw new Error(error.response?.data?.message || 'Guest login failed')
    }
  },

  logout: () => {
    localStorage.removeItem('jihesabu_token')
    set({ user: null, token: null })
  },

  loadUser: async () => {
    const token = get().token
    if (!token) {
      set({ initialized: true })
      return
    }
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data.user, initialized: true })
    } catch {
      localStorage.removeItem('jihesabu_token')
      set({ user: null, token: null, initialized: true })
    }
  },

  updateProfile: async (profileData) => {
    try {
      const { data } = await api.put('/auth/profile', profileData)
      set({ user: data.user })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Update failed')
    }
  },
}))
