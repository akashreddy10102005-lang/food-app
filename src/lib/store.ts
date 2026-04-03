import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from './translations';

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female' | 'other';
  healthIssues?: string[];
  dietaryGoals?: 'weight_loss' | 'weight_gain' | 'maintenance';
  language: Language;
  allergies?: string[];
  calorieTarget?: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  voiceReminders?: boolean;
}

export interface FoodLog {
  id: string;
  userId: string;
  imageUrl?: string;
  foodName: string;
  foodItems: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
  healthRating: 'good' | 'moderate' | 'avoid';
  recommendation?: string;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  portionSize?: string;
  isRestaurant: boolean;
  loggedVia: 'image' | 'voice' | 'manual';
  createdAt: Date;
}

interface AppState {
  user: UserProfile | null;
  language: Language;
  currentView: 'onboarding' | 'home' | 'analysis' | 'dashboard' | 'profile' | 'diet-plan' | 'grocery' | 'transformation';
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setLanguage: (language: Language) => void;
  setCurrentView: (view: AppState['currentView']) => void;
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
