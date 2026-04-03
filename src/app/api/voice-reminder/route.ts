import { NextRequest, NextResponse } from 'next/server';
import  tts  from 'z-ai-web-dev-sdk';
import { translations, type Language } from '@/lib/translations';

export async function POST(request: NextRequest) {
  try {
    const { mealType, language = 'english' } = await request.json();

    if (!mealType) {
      return NextResponse.json({ error: 'Meal type is required' }, { status: 400 });
    }

    // Get translation based on language
    const t = translations[language as Language] || translations.english;

    // Generate message based on meal type
    let message = '';
    switch (mealType) {
      case 'breakfast':
        message = t.breakfastTime || 'It\'s breakfast time! Have a healthy breakfast.';
        break;
      case 'lunch':
        message = t.lunchTime || 'It\'s lunch time! Enjoy a nutritious meal.';
        break;
      case 'snacks':
        message = t.snackTime || 'Time for a healthy snack!';
        break;
      case 'dinner':
        message = t.dinnerTime || 'It\'s dinner time! Have a light and healthy dinner.';
        break;
      default:
        message = 'It\'s time to eat! Stay healthy.';
    }

    // Generate audio using TTS
    const audioResult = await (tts as any).speech({
      input: message,
      voice: language === 'telugu' ? 'te-IN-Standard-A' :
             language === 'tamil' ? 'ta-IN-Standard-A' :
             language === 'kannada' ? 'kn-IN-Standard-A' :
             'en-US-Standard-A',
    });

    // Return audio content
    return new NextResponse(audioResult, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${mealType}-reminder.mp3"`,
      },
    });
  } catch (error) {
    console.error('Error generating voice reminder:', error);
    return NextResponse.json({ error: 'Failed to generate voice reminder' }, { status: 500 });
  }
}
