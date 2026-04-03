/**
 * Type definitions for NutriScan AI application
 * This file contains all shared TypeScript interfaces and types
 */

import type { Language } from '@/lib/translations';

// ============================================================
// User Types
// ============================================================

export type Gender = 'male' | 'female' | 'other';
export type DietaryGoal = 'weight_loss' | 'weight_gain' | 'maintenance';
export type HealthIssue = 'diabetes' | 'bloodPressure' | 'thyroid' | 'allergies' | 'heartDisease' | 'obesity';
export type Allergen = 'Nuts' | 'Gluten' | 'Dairy' | 'Eggs' | 'Soy' | 'Shellfish' | 'Peanuts';

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
  weight?: number;       // in kg
  height?: number;       // in cm
  gender?: Gender;
  healthIssues?: HealthIssue[];
  otherHealthIssues?: string;
  dietaryGoals?: DietaryGoal;
  language: Language;
  allergies?: Allergen[];
  calorieTarget?: number;
  proteinTarget?: number; // in grams
  carbsTarget?: number;   // in grams
  fatTarget?: number;     // in grams
  voiceReminders?: boolean;
}

export interface OnboardingFormData {
  name: string;
  age: string;
  weight: string;
  height: string;
  gender: string;
  healthIssues: HealthIssue[];
  otherHealthIssues: string;
  dietaryGoals: string;
  allergies: Allergen[];
}

// ============================================================
// Food Types
// ============================================================

export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';
export type HealthRating = 'good' | 'moderate' | 'avoid';
export type LoggedVia = 'image' | 'voice' | 'manual';

export interface FoodAnalysisResult {
  foodName: string;
  foodItems: string[];
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
  healthRating: HealthRating;
  recommendation: string;
  allergenWarning?: string;
  healthyAlternatives?: HealthyAlternative[];
  cookingMethod?: string;
  cuisineType?: string;
  portionSize?: string;
  bestTimeToEat?: string;
}

export interface HealthyAlternative {
  name: string;
  reason: string;
  calories: number;
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
  healthRating: HealthRating;
  recommendation?: string;
  mealType: MealType;
  portionSize?: string;
  isRestaurant: boolean;
  loggedVia: LoggedVia;
  createdAt: Date;
}

// ============================================================
// Diet Plan Types
// ============================================================

export interface Meal {
  type: MealType;
  time: string;
  items: string[];
  calories: number;
}

export interface DietPlan {
  date: Date;
  breakfast?: Meal;
  lunch?: Meal;
  snacks?: Meal;
  dinner?: Meal;
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
}

// ============================================================
// Reminder Types
// ============================================================

export interface Reminder {
  id: string;
  userId: string;
  mealType: MealType;
  time: string; // HH:MM format
  message?: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Body Transformation Types
// ============================================================

export interface BodyTransformation {
  id: string;
  userId: string;
  beforeImage?: string;
  afterImage?: string;
  weight?: number;
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Grocery Types
// ============================================================

export interface GroceryItem {
  name: string;
  category: string;
  checked: boolean;
}

export interface GroceryList {
  id: string;
  userId: string;
  items: GroceryItem[];
  date: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// App View Types
// ============================================================

export type AppView =
  | 'onboarding'
  | 'home'
  | 'analysis'
  | 'dashboard'
  | 'profile'
  | 'diet-plan'
  | 'grocery'
  | 'transformation';

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AnalyzeFoodRequest {
  image: string;
  userId?: string;
}

export interface VoiceReminderRequest {
  mealType: MealType;
  language: Language;
}

// ============================================================
// Validation Types
// ============================================================

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ============================================================
// Nutrition Target Types
// ============================================================

export interface NutritionTargets {
  calories: number;
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
}

export interface DailyNutritionSummary {
  date: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: FoodLog[];
}
