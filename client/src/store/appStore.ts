import { create } from 'zustand'
import { Settings } from '../types'

interface AppState {
  language: 'en' | 'sw'
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  settings: Settings | null
  setLanguage: (lang: 'en' | 'sw') => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setSettings: (settings: Settings) => void
}

export const useAppStore = create<AppState>((set) => ({
  language: (localStorage.getItem('jihesabu_lang') as 'en' | 'sw') || 'en',
  theme: (localStorage.getItem('jihesabu_theme') as 'light' | 'dark' | 'system') || 'dark',
  sidebarOpen: true,
  settings: null,

  setLanguage: (lang) => {
    localStorage.setItem('jihesabu_lang', lang)
    set({ language: lang })
  },

  setTheme: (theme) => {
    localStorage.setItem('jihesabu_theme', theme)
    set({ theme })
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else if (theme === 'light') document.documentElement.classList.remove('dark')
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  setSettings: (settings) => set({ settings }),
}))
