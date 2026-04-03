import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from './translations';
import type { UserProfile, FoodLog, AppView } from '@/types';

interface AppState {
  user: UserProfile | null;
  language: Language;
  currentView: AppView;
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setLanguage: (language: Language) => void;
  setCurrentView: (view: AppView) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      language: 'english',
      currentView: 'onboarding',
      setUser: (user) => set({ user, currentView: 'home' }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      setLanguage: (language) => set({ language }),
      setCurrentView: (currentView) => set({ currentView }),
      logout: () => set({ user: null, currentView: 'onboarding' }),
    }),
    {
      name: 'nutriscan-storage',
    }
  )
);
