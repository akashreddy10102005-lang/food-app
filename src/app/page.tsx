'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useTranslation, type Language } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Camera,
  Upload,
  Mic,
  Home,
  BarChart3,
  User,
  Calendar,
  ShoppingCart,
  Scale,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Utensils,
  Settings,
  LogOut,
  Play,
  BookOpen,
  Plus,
  Minus,
} from 'lucide-react';

export default function NutriScanApp() {
  const { user, language, currentView, setUser, updateUser, setLanguage, setCurrentView, logout } = useAppStore();
  const t = useTranslation(language);
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [todayMeals, setTodayMeals] = useState<any[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    healthIssues: [] as string[],
    dietaryGoals: '',
    allergies: [] as string[],
  });

  // Initialize on mount
  useEffect(() => {
    if (user) {
      setCurrentView('home');
    } else {
      setCurrentView('onboarding');
    }
  }, [user, setCurrentView]);

  const healthOptions = [
    { id: 'diabetes', label: t.diabetes },
    { id: 'bloodPressure', label: t.bloodPressure },
    { id: 'thyroid', label: t.thyroid },
    { id: 'allergies', label: t.allergies },
    { id: 'heartDisease', label: t.heartDisease },
    { id: 'obesity', label: t.obesity },
  ];

  const allergenOptions = [
    'Nuts',
    'Gluten',
    'Dairy',
    'Eggs',
    'Soy',
    'Shellfish',
    'Peanuts',
  ];

  const handleProfileSubmit = () => {
    if (!formData.name || !formData.age || !formData.weight || !formData.height || !formData.gender || !formData.dietaryGoals) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: `${formData.name.toLowerCase().replace(/\s/g, '')}@example.com`,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      gender: formData.gender as 'male' | 'female' | 'other',
      healthIssues: formData.healthIssues,
      dietaryGoals: formData.dietaryGoals as 'weight_loss' | 'weight_gain' | 'maintenance',
      language,
      allergies: formData.allergies,
      calorieTarget: formData.dietaryGoals === 'weight_loss' ? 1800 : formData.dietaryGoals === 'weight_gain' ? 2500 : 2000,
      proteinTarget: 50,
      carbsTarget: 250,
      fatTarget: 65,
      voiceReminders: true,
    };

    setUser(newUser);
    toast.success('Profile saved successfully!');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      analyzeFoodImage(file);
    }
  };

  const analyzeFoodImage = async (file: File) => {
    setIsAnalyzing(true);
    setCurrentView('analysis');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result?.toString().split(',')[1];

        const response = await fetch('/api/analyze-food', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image, userId: user?.id }),
        });

        if (!response.ok) throw new Error('Analysis failed');

        const result = await response.json();
        setAnalysisResult(result);
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error('Error analyzing food:', error);
      toast.error('Failed to analyze food. Please try again.');
      setIsAnalyzing(false);
      setCurrentView('home');
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    toast.info('Listening... Please say what you ate.');

    setTimeout(() => {
      setIsRecording(false);
      toast.success('Voice recorded! Processing...');
      // Mock voice input result
      const mockResult = {
        foodName: 'Rice and Dal',
        foodItems: ['White Rice', 'Dal (Lentils)'],
        calories: 320,
        protein: 12,
        carbs: 55,
        fat: 5,
        fiber: 4,
        sugar: 2,
        healthRating: 'moderate' as const,
        recommendation: 'Good source of protein. Consider brown rice instead of white rice for more fiber.',
        healthyAlternatives: [
          { name: 'Brown Rice', reason: 'Higher fiber and nutrients, lower glycemic index', calories: 216 },
          { name: 'Quinoa', reason: 'Complete protein with all essential amino acids', calories: 222 },
        ],
      };
      setAnalysisResult(mockResult);
      setCurrentView('analysis');
    }, 3000);
  };

  const logMeal = () => {
    if (!analysisResult || !user) return;

    const newMeal = {
      ...analysisResult,
      id: `meal-${Date.now()}`,
      userId: user.id,
      loggedVia: analysisResult.imageUrl ? 'image' : 'voice',
      mealType: 'lunch',
      isRestaurant: false,
      createdAt: new Date(),
    };

    setTodayMeals([...todayMeals, newMeal]);
    toast.success('Meal logged successfully!');
    setAnalysisResult(null);
    setCurrentView('home');
  };

  // Onboarding Screen
  const renderOnboarding = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-purple-900">{t.appName}</CardTitle>
          <CardDescription className="text-purple-700 text-lg">{t.welcome}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div>
            <Label className="text-purple-900 font-semibold">Language / భాష / மொழி / ಭಾಷೆ</Label>
            <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-purple-900">{t.name} *</Label>
              <Input
                className="mt-2"
                placeholder={t.name}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-purple-900">{t.age} *</Label>
              <Input
                className="mt-2"
                type="number"
                placeholder={t.age}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-purple-900">{t.weight} *</Label>
              <Input
                className="mt-2"
                type="number"
                placeholder={t.weight}
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-purple-900">{t.height} *</Label>
              <Input
                className="mt-2"
                type="number"
                placeholder={t.height}
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <Label className="text-purple-900">{t.gender} *</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder={t.gender} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t.male}</SelectItem>
                <SelectItem value="female">{t.female}</SelectItem>
                <SelectItem value="other">{t.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Health Issues */}
          <div>
            <Label className="text-purple-900">{t.healthIssues}</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
              {healthOptions.map((issue) => (
                <div key={issue.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={issue.id}
                    checked={formData.healthIssues.includes(issue.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({ ...formData, healthIssues: [...formData.healthIssues, issue.id] });
                      } else {
                        setFormData({
                          ...formData,
                          healthIssues: formData.healthIssues.filter((i) => i !== issue.id),
                        });
                      }
                    }}
                  />
                  <label htmlFor={issue.id} className="text-sm text-purple-800 cursor-pointer">
                    {issue.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Goals */}
          <div>
            <Label className="text-purple-900">{t.dietaryGoals} *</Label>
            <Select value={formData.dietaryGoals} onValueChange={(value) => setFormData({ ...formData, dietaryGoals: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder={t.dietaryGoals} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">{t.weightLoss}</SelectItem>
                <SelectItem value="weight_gain">{t.weightGain}</SelectItem>
                <SelectItem value="maintenance">{t.maintenance}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Allergies */}
          <div>
            <Label className="text-purple-900">{t.allergies}</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {allergenOptions.map((allergen) => (
                <div key={allergen} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergen}
                    checked={formData.allergies.includes(allergen)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({ ...formData, allergies: [...formData.allergies, allergen] });
                      } else {
                        setFormData({
                          ...formData,
                          allergies: formData.allergies.filter((a) => a !== allergen),
                        });
                      }
                    }}
                  />
                  <label htmlFor={allergen} className="text-sm text-purple-800 cursor-pointer">
                    {allergen}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleProfileSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg"
          >
            {t.saveProfile}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Home Screen
  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-purple-900">{t.appName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="telugu">తెలుగు</SelectItem>
                <SelectItem value="tamil">தமிழ்</SelectItem>
                <SelectItem value="kannada">ಕನ್ನಡ</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-5 h-5 text-purple-700" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-900">
            {t.welcome}, {user?.name}! 👋
          </h2>
          <p className="text-purple-700">{t.setupProfile}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-purple-600">{t.totalCalories}</p>
              <p className="text-2xl font-bold text-purple-900">
                {todayMeals.reduce((sum, meal) => sum + meal.calories, 0)}
              </p>
              <p className="text-xs text-gray-500">/ {user?.calorieTarget || 2000} kcal</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-purple-600">{t.totalProtein}</p>
              <p className="text-2xl font-bold text-purple-900">
                {todayMeals.reduce((sum, meal) => sum + meal.protein, 0).toFixed(1)}g
              </p>
              <p className="text-xs text-gray-500">/ {user?.proteinTarget || 50}g</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-purple-600">{t.totalCarbs}</p>
              <p className="text-2xl font-bold text-purple-900">
                {todayMeals.reduce((sum, meal) => sum + meal.carbs, 0).toFixed(1)}g
              </p>
              <p className="text-xs text-gray-500">/ {user?.carbsTarget || 250}g</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-purple-600">{t.totalFat}</p>
              <p className="text-2xl font-bold text-purple-900">
                {todayMeals.reduce((sum, meal) => sum + meal.fat, 0).toFixed(1)}g
              </p>
              <p className="text-xs text-gray-500">/ {user?.fatTarget || 65}g</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card
            className="bg-gradient-to-br from-blue-500 to-blue-600 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <CardContent className="p-6 text-center text-white">
              <Camera className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold">{t.scanFood}</p>
            </CardContent>
          </Card>
          <Card
            className="bg-gradient-to-br from-purple-500 to-purple-600 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <CardContent className="p-6 text-center text-white">
              <Upload className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold">{t.uploadPhoto}</p>
            </CardContent>
          </Card>
          <Card
            className="bg-gradient-to-br from-pink-500 to-pink-600 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleVoiceInput}
          >
            <CardContent className="p-6 text-center text-white">
              <Mic className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold">{t.voiceInput}</p>
            </CardContent>
          </Card>
          <Card
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('dashboard')}
          >
            <CardContent className="p-6 text-center text-white">
              <BarChart3 className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold">{t.dashboard}</p>
            </CardContent>
          </Card>
        </div>

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          ref={(ref) => setFileInput(ref)}
          onChange={handleFileSelect}
        />

        {/* Today's Meals */}
        <Card className="bg-white shadow-md mb-6">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              {t.todayMeals}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayMeals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No meals logged yet. Start by scanning your food!</p>
            ) : (
              <div className="space-y-3">
                {todayMeals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-purple-900">{meal.foodName}</p>
                      <p className="text-sm text-purple-600">{meal.calories} kcal • {meal.protein}g protein</p>
                    </div>
                    <Badge
                      className={
                        meal.healthRating === 'good'
                          ? 'bg-green-500'
                          : meal.healthRating === 'moderate'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }
                    >
                      {meal.healthRating}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="bg-gradient-to-br from-green-500 to-green-600 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('diet-plan')}
          >
            <CardContent className="p-6 text-center text-white">
              <Calendar className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold">{t.aiDietPlanner}</p>
            </CardContent>
          </Card>
          <Card
            className="bg-gradient-to-br from-orange-500 to-orange-600 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('grocery')}
          >
            <CardContent className="p-6 text-center text-white">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold">{t.groceryList}</p>
            </CardContent>
          </Card>
          <Card
            className="bg-gradient-to-br from-teal-500 to-teal-600 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView('transformation')}
          >
            <CardContent className="p-6 text-center text-white">
              <Scale className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold">{t.bodyTransformation}</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-purple-600' : 'text-gray-500'}`}
              onClick={() => setCurrentView('home')}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">{t.home}</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-purple-600' : 'text-gray-500'}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs">{t.dashboard}</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-1 ${currentView === 'profile' ? 'text-purple-600' : 'text-gray-500'}`}
              onClick={() => setCurrentView('profile')}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">{t.profile}</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-1 ${currentView === 'transformation' ? 'text-purple-600' : 'text-gray-500'}`}
              onClick={() => setCurrentView('transformation')}
            >
              <Scale className="w-6 h-6" />
              <span className="text-xs">{t.bodyTransformation}</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );

  // Analysis Screen
  const renderAnalysis = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}>
            <span className="text-2xl text-purple-700">←</span>
          </Button>
          <h1 className="text-xl font-bold text-purple-900">{t.foodDetected}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {isAnalyzing ? (
          <Card className="bg-white shadow-lg p-12 text-center">
            <div className="animate-pulse">
              <Sparkles className="w-20 h-20 mx-auto mb-4 text-purple-600" />
              <h2 className="text-2xl font-bold text-purple-900 mb-2">{t.analyzing}</h2>
              <p className="text-purple-600">Please wait while we analyze your food...</p>
            </div>
          </Card>
        ) : analysisResult ? (
          <div className="space-y-6">
            {/* Food Name */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-900">{analysisResult.foodName}</CardTitle>
                <CardDescription className="text-purple-600">
                  Detected: {analysisResult.foodItems?.join(', ') || 'Food items'}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Health Rating */}
            <Card className={`shadow-lg ${
              analysisResult.healthRating === 'good' ? 'bg-green-50 border-green-200' :
              analysisResult.healthRating === 'moderate' ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {analysisResult.healthRating === 'good' && <CheckCircle2 className="w-8 h-8 text-green-600" />}
                  {analysisResult.healthRating === 'moderate' && <AlertTriangle className="w-8 h-8 text-yellow-600" />}
                  {analysisResult.healthRating === 'avoid' && <XCircle className="w-8 h-8 text-red-600" />}
                  <div>
                    <h3 className="text-lg font-bold text-purple-900">{t.healthRating}</h3>
                    <Badge
                      className={
                        analysisResult.healthRating === 'good'
                          ? 'bg-green-500'
                          : analysisResult.healthRating === 'moderate'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }
                    >
                      {analysisResult.healthRating.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                {analysisResult.recommendation && (
                  <p className="text-purple-700 bg-white p-4 rounded-lg">{analysisResult.recommendation}</p>
                )}
              </CardContent>
            </Card>

            {/* Nutritional Information */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-900">{t.nutritionalInfo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-purple-600">{t.calories}</p>
                    <p className="text-2xl font-bold text-purple-900">{analysisResult.calories}</p>
                    <p className="text-xs text-gray-500">kcal</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <p className="text-sm text-purple-600">{t.protein}</p>
                    <p className="text-2xl font-bold text-purple-900">{analysisResult.protein}g</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-sm text-purple-600">{t.carbohydrates}</p>
                    <p className="text-2xl font-bold text-purple-900">{analysisResult.carbs}g</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg text-center">
                    <p className="text-sm text-purple-600">{t.fats}</p>
                    <p className="text-2xl font-bold text-purple-900">{analysisResult.fat}g</p>
                  </div>
                  {analysisResult.fiber !== undefined && (
                    <div className="p-4 bg-pink-50 rounded-lg text-center">
                      <p className="text-sm text-purple-600">{t.fiber}</p>
                      <p className="text-2xl font-bold text-purple-900">{analysisResult.fiber}g</p>
                    </div>
                  )}
                  {analysisResult.sugar !== undefined && (
                    <div className="p-4 bg-red-50 rounded-lg text-center">
                      <p className="text-sm text-purple-600">{t.sugar}</p>
                      <p className="text-2xl font-bold text-purple-900">{analysisResult.sugar}g</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Healthy Alternatives */}
            {analysisResult.healthyAlternatives && analysisResult.healthyAlternatives.length > 0 && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {t.healthyAlternatives}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.healthyAlternatives.map((alt: any, index: number) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-purple-900">{alt.name}</h4>
                          <Badge variant="outline">{alt.calories} kcal</Badge>
                        </div>
                        <p className="text-sm text-purple-700 mb-2">{alt.reason}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-purple-600 border-purple-300"
                          onClick={() => {
                            const query = encodeURIComponent(`${alt.name} recipe cooking`);
                            window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {t.watchRecipe}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Log Meal Button */}
            <Button
              onClick={logMeal}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg"
            >
              <Utensils className="w-5 h-5 mr-2" />
              {t.logThisMeal}
            </Button>
          </div>
        ) : null}
      </main>
    </div>
  );

  // Dashboard Screen
  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}>
            <span className="text-2xl text-purple-700">←</span>
          </Button>
          <h1 className="text-xl font-bold text-purple-900">{t.dashboard}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="weekly">{t.weeklyAnalytics}</TabsTrigger>
            <TabsTrigger value="monthly">{t.monthlyAnalytics}</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-900">{t.calorieIntake}</CardTitle>
                  <CardDescription>{t.last7Days}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="text-sm text-purple-600 w-16">Day {day}</span>
                        <div className="flex-1 bg-purple-100 rounded-full h-4 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full"
                            style={{ width: `${Math.random() * 60 + 40}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-purple-900 w-16 text-right">
                          {Math.floor(Math.random() * 500 + 1500)} kcal
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-900">{t.proteinConsumption}</CardTitle>
                  <CardDescription>{t.last7Days}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="text-sm text-purple-600 w-16">Day {day}</span>
                        <div className="flex-1 bg-purple-100 rounded-full h-4 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-teal-600 h-full rounded-full"
                            style={{ width: `${Math.random() * 60 + 40}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-purple-900 w-16 text-right">
                          {Math.floor(Math.random() * 30 + 40)}g
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <Card className="bg-white shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="text-purple-900">{t.weightTrends}</CardTitle>
                <CardDescription>{t.last30Days}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 px-4">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-4 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t"
                        style={{ height: `${Math.random() * 100 + 50}px` }}
                      />
                      <span className="text-xs text-gray-500">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-900">{t.calorieIntake}</CardTitle>
                <CardDescription>{t.last30Days}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((week) => (
                    <div key={week} className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-purple-600">Week {week}</p>
                      <p className="text-xl font-bold text-purple-900">
                        {Math.floor(Math.random() * 2000 + 12000)}
                      </p>
                      <p className="text-xs text-gray-500">kcal</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Smart Alerts */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              {t.highSugarWarning}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700">{t.sugarIntakeHigh}</p>
            <p className="text-sm text-purple-600 mt-2">{t.stayHealthy}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );

  // Diet Plan Screen
  const renderDietPlan = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}>
            <span className="text-2xl text-purple-700">←</span>
          </Button>
          <h1 className="text-xl font-bold text-purple-900">{t.aiDietPlanner}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{t.mealPlan} - {t.forToday}</h2>
            <p className="text-blue-100">Personalized based on your {user?.dietaryGoals?.replace('_', ' ')} goal</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {[
            { type: 'breakfast', time: '7:00 AM', items: ['Oatmeal with fruits', 'Green tea', 'Almonds (5)'], calories: 350 },
            { type: 'lunch', time: '12:30 PM', items: ['Grilled chicken salad', 'Brown rice (1 cup)', 'Vegetables'], calories: 550 },
            { type: 'snacks', time: '4:00 PM', items: ['Greek yogurt', 'Mixed nuts', 'Apple'], calories: 200 },
            { type: 'dinner', time: '7:30 PM', items: ['Grilled fish', 'Quinoa', 'Steamed vegetables'], calories: 450 },
          ].map((meal) => (
            <Card key={meal.type} className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} - {meal.time}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {meal.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-purple-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-purple-600 font-semibold">{meal.calories} kcal</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-purple-900 font-semibold mb-2">Total Daily Intake:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-900">1550</p>
              <p className="text-sm text-purple-600">Calories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">65g</p>
              <p className="text-sm text-purple-600">Protein</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">180g</p>
              <p className="text-sm text-purple-600">Carbs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">45g</p>
              <p className="text-sm text-purple-600">Fat</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // Grocery List Screen
  const renderGrocery = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}>
            <span className="text-2xl text-purple-700">←</span>
          </Button>
          <h1 className="text-xl font-bold text-purple-900">{t.groceryList}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{t.groceriesBasedOnPlan}</h2>
            <p className="text-orange-100">Based on your weekly meal plan</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { category: 'Vegetables', items: ['Spinach', 'Broccoli', 'Carrots', 'Tomatoes', 'Onions', 'Garlic'] },
            { category: 'Fruits', items: ['Apples', 'Bananas', 'Berries', 'Oranges', 'Avocados'] },
            { category: 'Proteins', items: ['Chicken breast', 'Fish', 'Eggs', 'Greek yogurt', 'Tofu'] },
            { category: 'Grains', items: ['Brown rice', 'Quinoa', 'Oats', 'Whole wheat bread'] },
            { category: 'Nuts & Seeds', items: ['Almonds', 'Walnuts', 'Chia seeds', 'Flax seeds'] },
            { category: 'Dairy', items: ['Milk', 'Cheese', 'Butter', 'Curd/Yogurt'] },
          ].map((category) => (
            <Card key={category.category} className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-900">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Checkbox id={item} />
                      <label htmlFor={item} className="text-purple-700 cursor-pointer">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );

  // Body Transformation Screen
  const renderTransformation = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}>
            <span className="text-2xl text-purple-700">←</span>
          </Button>
          <h1 className="text-xl font-bold text-purple-900">{t.bodyTransformation}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{t.trackProgress}</h2>
            <p className="text-teal-100">Upload before and after photos to see your transformation</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-900">{t.beforePhoto}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  {t.uploadBefore}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-900">{t.afterPhoto}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  {t.uploadAfter}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-purple-900">{t.currentWeight}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Minus className="w-4 h-4" />
              </Button>
              <Input type="number" className="text-center text-2xl font-bold" defaultValue={user?.weight || 70} />
              <Button variant="outline" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
              <span className="text-purple-600">kg</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-900">{t.notes}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Add your progress notes here..." className="min-h-32" />
            <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600">
              {t.save}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );

  // Profile Screen
  const renderProfile = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}>
            <span className="text-2xl text-purple-700">←</span>
          </Button>
          <h1 className="text-xl font-bold text-purple-900">{t.profile}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <Card className="bg-white shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-900">{user?.name}</h2>
                <p className="text-purple-600">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-purple-600">Age</p>
                <p className="text-xl font-bold text-purple-900">{user?.age} years</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <p className="text-sm text-purple-600">Weight</p>
                <p className="text-xl font-bold text-purple-900">{user?.weight} kg</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-purple-600">Height</p>
                <p className="text-xl font-bold text-purple-900">{user?.height} cm</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <p className="text-sm text-purple-600">Goal</p>
                <p className="text-xl font-bold text-purple-900 capitalize">
                  {user?.dietaryGoals?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {t.reminderSettings}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <p className="font-semibold text-purple-900">{t.voiceReminder}</p>
                <p className="text-sm text-purple-600">Get voice notifications at meal times</p>
              </div>
              <Switch
                checked={user?.voiceReminders || false}
                onCheckedChange={(checked) => updateUser({ voiceReminders: checked })}
              />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-semibold text-purple-900">Language</p>
                <p className="text-sm text-purple-600">App display language</p>
              </div>
              <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="telugu">తెలుగు</SelectItem>
                  <SelectItem value="tamil">தமிழ்</SelectItem>
                  <SelectItem value="kannada">ಕನ್ನಡ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-900">Meal Reminder Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'breakfast', time: '7:00 AM' },
                { type: 'lunch', time: '12:30 PM' },
                { type: 'snacks', time: '4:00 PM' },
                { type: 'dinner', time: '7:30 PM' },
              ].map((meal) => (
                <div key={meal.type} className="flex items-center justify-between py-2 border-b">
                  <p className="font-semibold text-purple-900 capitalize">{meal.type}</p>
                  <Input type="time" defaultValue={meal.time} className="w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );

  // Recording Overlay
  if (isRecording) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="bg-white p-8 text-center">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Mic className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-xl font-bold text-purple-900 mb-2">Listening...</h2>
            <p className="text-purple-600">Please say what you ate</p>
          </div>
        </Card>
      </div>
    );
  }

  // Render current view
  switch (currentView) {
    case 'onboarding':
      return renderOnboarding();
    case 'home':
      return renderHome();
    case 'analysis':
      return renderAnalysis();
    case 'dashboard':
      return renderDashboard();
    case 'diet-plan':
      return renderDietPlan();
    case 'grocery':
      return renderGrocery();
    case 'transformation':
      return renderTransformation();
    case 'profile':
      return renderProfile();
    default:
      return renderHome();
  }
}
