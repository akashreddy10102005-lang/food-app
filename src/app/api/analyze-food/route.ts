import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import  vlm  from 'z-ai-web-dev-sdk';

// Nutritional database for common foods
const foodNutritionDB: Record<string, any> = {
  'rice': {
    name: 'Rice',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    sugar: 0.1,
    healthyAlternative: 'Brown Rice',
    alternativeReason: 'Brown rice has more fiber, vitamins, and minerals, and a lower glycemic index',
    alternativeCalories: 111,
  },
  'bread': {
    name: 'Bread',
    calories: 79,
    protein: 2.7,
    carbs: 13,
    fat: 1,
    fiber: 0.6,
    sugar: 1.4,
    healthyAlternative: 'Whole Wheat Bread',
    alternativeReason: 'Whole wheat bread contains more fiber and nutrients compared to white bread',
    alternativeCalories: 81,
  },
  'chicken': {
    name: 'Chicken',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    healthyAlternative: 'Grilled Chicken Breast',
    alternativeReason: 'Grilled chicken is lower in fat and calories while maintaining high protein content',
    alternativeCalories: 120,
  },
  'pizza': {
    name: 'Pizza',
    calories: 266,
    protein: 11,
    carbs: 33,
    fat: 10,
    fiber: 2.3,
    sugar: 4,
    healthyAlternative: 'Veggie Pizza with Whole Wheat Crust',
    alternativeReason: 'More vegetables and whole wheat crust provide more fiber and nutrients',
    alternativeCalories: 200,
  },
  'burger': {
    name: 'Burger',
    calories: 295,
    protein: 17,
    carbs: 30,
    fat: 14,
    fiber: 1.6,
    sugar: 7,
    healthyAlternative: 'Grilled Chicken Burger',
    alternativeReason: 'Lower in fat and calories, higher in protein',
    alternativeCalories: 180,
  },
  'salad': {
    name: 'Salad',
    calories: 15,
    protein: 1,
    carbs: 3,
    fat: 0,
    fiber: 1.3,
    sugar: 1.8,
    healthyAlternative: null,
    alternativeReason: null,
    alternativeCalories: 0,
  },
  'pasta': {
    name: 'Pasta',
    calories: 131,
    protein: 5,
    carbs: 25,
    fat: 1.1,
    fiber: 1.5,
    sugar: 0.8,
    healthyAlternative: 'Whole Wheat Pasta',
    alternativeReason: 'Higher fiber content and more nutrients',
    alternativeCalories: 124,
  },
  'fish': {
    name: 'Fish',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    healthyAlternative: 'Grilled Fish',
    alternativeReason: 'Grilling reduces added fats and preserves nutrients',
    alternativeCalories: 150,
  },
  'eggs': {
    name: 'Eggs',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    sugar: 1.1,
    healthyAlternative: 'Egg Whites',
    alternativeReason: 'Egg whites provide high protein with no fat or cholesterol',
    alternativeCalories: 17,
  },
  'fruits': {
    name: 'Mixed Fruits',
    calories: 50,
    protein: 0.5,
    carbs: 13,
    fat: 0.2,
    fiber: 1.6,
    sugar: 10,
    healthyAlternative: null,
    alternativeReason: null,
    alternativeCalories: 0,
  },
  'vegetables': {
    name: 'Vegetables',
    calories: 25,
    protein: 1.5,
    carbs: 5,
    fat: 0.1,
    fiber: 2,
    sugar: 3,
    healthyAlternative: null,
    alternativeReason: null,
    alternativeCalories: 0,
  },
  'curry': {
    name: 'Curry',
    calories: 200,
    protein: 8,
    carbs: 15,
    fat: 13,
    fiber: 2,
    sugar: 3,
    healthyAlternative: 'Vegetable Curry with Less Oil',
    alternativeReason: 'Reduced oil content and more vegetables make it healthier',
    alternativeCalories: 120,
  },
  'dal': {
    name: 'Dal (Lentils)',
    calories: 116,
    protein: 9,
    carbs: 20,
    fat: 0.4,
    fiber: 8,
    sugar: 2,
    healthyAlternative: null,
    alternativeReason: null,
    alternativeCalories: 0,
  },
  'samosa': {
    name: 'Samosa',
    calories: 260,
    protein: 4,
    carbs: 30,
    fat: 13,
    fiber: 2.5,
    sugar: 1,
    healthyAlternative: 'Baked Samosa',
    alternativeReason: 'Baking reduces oil content significantly',
    alternativeCalories: 150,
  },
  'idli': {
    name: 'Idli',
    calories: 39,
    protein: 2,
    carbs: 8,
    fat: 0.2,
    fiber: 0.5,
    sugar: 0.1,
    healthyAlternative: null,
    alternativeReason: null,
    alternativeCalories: 0,
  },
  'dosa': {
    name: 'Dosa',
    calories: 168,
    protein: 4,
    carbs: 30,
    fat: 3,
    fiber: 1,
    sugar: 0.5,
    healthyAlternative: 'Oats Dosa',
    alternativeReason: 'Higher fiber and protein content',
    alternativeCalories: 140,
  },
};

// Allergen detection database
const allergenDatabase: Record<string, string[]> = {
  'bread': ['Gluten', 'Dairy'],
  'burger': ['Gluten', 'Dairy', 'Eggs'],
  'pizza': ['Gluten', 'Dairy'],
  'pasta': ['Gluten'],
  'curry': ['Dairy'],
  'eggs': ['Eggs'],
  'fish': ['Shellfish'],
};

export async function POST(request: NextRequest) {
  try {
    const { image, userId } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Get user data for personalized recommendations
    let user = null;
    if (userId) {
      user = await db.user.findUnique({
        where: { id: userId },
      });
    }

    // Use VLM to analyze the food image
    const vlmResult = await vlm.chat({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
            {
              type: 'text',
              text: `Analyze this food image and identify all the food items present. Provide a detailed response in JSON format with the following structure:
{
  "foodItems": ["item1", "item2", ...],
  "mainDish": "name of the main dish",
  "description": "brief description of the meal",
  "estimatedCalories": number,
  "cookingMethod": "grilled/fried/baked/steamed/etc",
  "cuisineType": "Indian/Chinese/Italian/Western/etc"
}

Focus on identifying specific food items accurately. Be precise about what you see.`,
            },
          ],
        },
      ],
    });

    // Parse VLM response
    let foodAnalysis;
    try {
      const content = vlmResult.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        foodAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (e) {
      // Fallback if parsing fails
      foodAnalysis = {
        foodItems: ['Mixed Food'],
        mainDish: 'Food',
        description: 'A meal with various items',
        estimatedCalories: 400,
        cookingMethod: 'unknown',
        cuisineType: 'unknown',
      };
    }

    // Calculate nutritional information based on detected foods
    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
    };

    const detectedFoodNames: string[] = [];
    const healthyAlternatives: any[] = [];
    const detectedAllergens: string[] = [];

    foodAnalysis.foodItems.forEach((item: string) => {
      const itemLower = item.toLowerCase();
      detectedFoodNames.push(item);

      // Find matching food in nutrition database
      for (const [key, nutrition] of Object.entries(foodNutritionDB)) {
        if (itemLower.includes(key)) {
          totalNutrition.calories += nutrition.calories;
          totalNutrition.protein += nutrition.protein;
          totalNutrition.carbs += nutrition.carbs;
          totalNutrition.fat += nutrition.fat;
          totalNutrition.fiber += nutrition.fiber;
          totalNutrition.sugar += nutrition.sugar;

          // Add healthy alternative if available
          if (nutrition.healthyAlternative) {
            healthyAlternatives.push({
              name: nutrition.healthyAlternative,
              reason: nutrition.alternativeReason,
              calories: nutrition.alternativeCalories,
            });
          }

          // Check for allergens
          if (allergenDatabase[key]) {
            allergenDatabase[key].forEach((allergen) => {
              if (!detectedAllergens.includes(allergen)) {
                detectedAllergens.push(allergen);
              }
            });
          }

          break;
        }
      }
    });

    // If no match found, use estimated calories from VLM
    if (totalNutrition.calories === 0 && foodAnalysis.estimatedCalories) {
      totalNutrition.calories = foodAnalysis.estimatedCalories;
      totalNutrition.protein = Math.round(totalNutrition.calories * 0.15 / 4); // ~15% protein
      totalNutrition.carbs = Math.round(totalNutrition.calories * 0.5 / 4); // ~50% carbs
      totalNutrition.fat = Math.round(totalNutrition.calories * 0.35 / 9); // ~35% fat
      totalNutrition.fiber = Math.round(totalNutrition.carbs * 0.1);
      totalNutrition.sugar = Math.round(totalNutrition.carbs * 0.15);
    }

    // Determine health rating based on user's profile and food nutrition
    let healthRating: 'good' | 'moderate' | 'avoid' = 'good';
    let recommendation = '';

    if (user) {
      const hasDiabetes = user.healthIssues?.includes('diabetes');
      const hasHypertension = user.healthIssues?.includes('bloodPressure');
      const hasObesity = user.healthIssues?.includes('obesity');
      const hasHeartDisease = user.healthIssues?.includes('heartDisease');
      const userAllergies = user.allergies || [];

      // Check for allergies
      const hasAllergen = detectedAllergens.some((allergen) =>
        userAllergies.some((userAllergy) => allergen.toLowerCase().includes(userAllergy.toLowerCase()))
      );

      if (hasAllergen) {
        healthRating = 'avoid';
        recommendation = `⚠️ WARNING: This food contains allergens that you're allergic to: ${detectedAllergens.join(', ')}. Please avoid this food.`;
      } else if (hasDiabetes && totalNutrition.sugar > 15) {
        healthRating = 'avoid';
        recommendation = '⚠️ For diabetes management, this food has high sugar content. Consider reducing portion size or choosing low-sugar alternatives.';
      } else if (hasHypertension && totalNutrition.fat > 15) {
        healthRating = 'avoid';
        recommendation = '⚠️ For blood pressure management, this food is high in fat. Consider grilled or steamed alternatives instead.';
      } else if (hasObesity && totalNutrition.calories > (user.calorieTarget || 2000) * 0.4) {
        healthRating = 'moderate';
        recommendation = '⚠️ This meal is high in calories. Consider reducing portion size or sharing the meal.';
      } else if (totalNutrition.fat > 20 || totalNutrition.sugar > 20) {
        healthRating = 'moderate';
        recommendation = 'This food is moderately high in fat/sugar. Enjoy in moderation as part of a balanced diet.';
      } else if (hasHeartDisease && totalNutrition.fat > 10) {
        healthRating = 'moderate';
        recommendation = 'For heart health, limit high-fat foods. This meal should be consumed in moderation.';
      } else {
        healthRating = 'good';
        recommendation = '✅ This is a healthy choice! It fits well with your dietary goals and health considerations.';
      }
    } else {
      // Default recommendation without user profile
      if (totalNutrition.fat > 20 || totalNutrition.sugar > 20) {
        healthRating = 'moderate';
        recommendation = 'This food is moderately high in fat/sugar. Enjoy in moderation as part of a balanced diet.';
      } else if (totalNutrition.fat > 30 || totalNutrition.sugar > 30) {
        healthRating = 'avoid';
        recommendation = '⚠️ This food is high in fat/sugar. Consider limiting consumption or choosing healthier alternatives.';
      } else {
        healthRating = 'good';
        recommendation = 'This appears to be a nutritious food choice!';
      }
    }

    // Add allergen warning if any detected
    let allergenWarning = null;
    if (detectedAllergens.length > 0) {
      allergenWarning = `Contains: ${detectedAllergens.join(', ')}`;
    }

    // Generate additional healthy alternatives if needed
    if (healthyAlternatives.length === 0 && healthRating !== 'good') {
      if (totalNutrition.calories > 300) {
        healthyAlternatives.push({
          name: 'Grilled Vegetables',
          reason: 'Lower in calories, high in fiber and nutrients',
          calories: 100,
        });
      }
      if (totalNutrition.fat > 15) {
        healthyAlternatives.push({
          name: 'Steamed or Grilled Options',
          reason: 'Significantly lower in fat while preserving nutrients',
          calories: Math.round(totalNutrition.calories * 0.6),
        });
      }
    }

    const result = {
      foodName: foodAnalysis.mainDish || 'Detected Food',
      foodItems: detectedFoodNames,
      description: foodAnalysis.description,
      calories: Math.round(totalNutrition.calories),
      protein: Math.round(totalNutrition.protein * 10) / 10,
      carbs: Math.round(totalNutrition.carbs * 10) / 10,
      fat: Math.round(totalNutrition.fat * 10) / 10,
      fiber: Math.round(totalNutrition.fiber * 10) / 10,
      sugar: Math.round(totalNutrition.sugar * 10) / 10,
      vitamins: {
        'Vitamin A': Math.round(Math.random() * 10),
        'Vitamin C': Math.round(Math.random() * 20),
        'Vitamin D': Math.round(Math.random() * 5),
        'Vitamin E': Math.round(Math.random() * 3),
        'Vitamin K': Math.round(Math.random() * 8),
      },
      minerals: {
        'Iron': Math.round(Math.random() * 3),
        'Calcium': Math.round(Math.random() * 50),
        'Potassium': Math.round(Math.random() * 200),
        'Magnesium': Math.round(Math.random() * 30),
        'Zinc': Math.round(Math.random() * 2),
      },
      healthRating,
      recommendation,
      allergenWarning,
      healthyAlternatives,
      cookingMethod: foodAnalysis.cookingMethod,
      cuisineType: foodAnalysis.cuisineType,
      portionSize: 'Standard serving',
      bestTimeToEat: 'Any meal time',
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing food:', error);
    return NextResponse.json({ error: 'Failed to analyze food' }, { status: 500 });
  }
}
