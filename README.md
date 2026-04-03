# 🥗 NutriScan AI - AI-Powered Nutrition Assistant

A modern, intelligent nutrition tracking application that analyzes food from images and provides personalized health insights and recommendations.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 Core Features
- **📸 AI Food Analysis** - Upload or capture food images for instant nutritional analysis
- **🎤 Voice Input** - Log meals using voice commands
- **📊 Health Dashboard** - Track daily, weekly, and monthly nutrition analytics
- **🥘 AI Diet Planner** - Get personalized meal plans based on health goals
- **🛒 Smart Grocery Lists** - Auto-generated shopping lists based on diet plans
- **⏰ Meal Reminders** - Voice notifications for meal times (multi-language)
- **📈 Body Transformation Tracker** - Monitor progress with before/after photos

### 🌍 Multi-Language Support
- 🇬🇧 English
- 🇮🇳 తెలుగు (Telugu)
- 🇮🇳 தமிழ் (Tamil)
- 🇮🇳 ಕನ್ನಡ (Kannada)

### 🩺 Health Features
- **Personalized Recommendations** - Based on user's health conditions
- **Allergen Detection** - Automatic warnings for allergens
- **Health Rating System** - Good / Moderate / Avoid ratings
- **Healthy Alternatives** - Suggest healthier food options
- **YouTube Recipe Integration** - One-click recipe videos
- **Restaurant Mode** - Specialized recommendations for eating out

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Bun (recommended) or npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nutriscan-ai

# Install dependencies
bun install

# Set up database
bun run db:push

# Run development server
bun run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
bun run build
bun run start
```

## 📁 Project Structure

```
nutriscan-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx         # Root layout
│   │   ├── api/               # API routes
│   │   │   └── analyze-food/  # Food analysis endpoint
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utility functions
│   │   ├── db.ts             # Prisma client
│   │   ├── store.ts          # Zustand state management
│   │   ├── translations.ts   # Multi-language support
│   │   └── offline-cache.ts  # Offline functionality
│   └── types/                # TypeScript types
│       └── index.ts
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
└── package.json
```

## 🗄️ Database Schema

The application uses Prisma ORM with SQLite for data persistence.

### Models
- **User** - User profile and health information
- **FoodLog** - Food entries with nutritional data
- **MealPlan** - AI-generated meal plans
- **Reminder** - Meal time reminders
- **BodyTransformation** - Progress tracking
- **GroceryList** - Shopping lists

## 🔧 Tech Stack

### Core Framework
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4

### UI Components
- **Component Library**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Animations**: Framer Motion

### State Management
- **Client State**: Zustand with persistence
- **Server State**: TanStack Query

### Database
- **ORM**: Prisma
- **Database**: SQLite (client only)

### AI & Services
- **Food Analysis**: z-ai-web-dev-sdk (VLM)
- **Voice Recognition**: z-ai-web-dev-sdk (ASR)
- **Text-to-Speech**: z-ai-web-dev-sdk (TTS)
- **Notifications**: Sonner

## 🎨 UI/UX Design

- **Color Scheme**: Light blue background with dark purple text
- **Design Style**: Clean, modern, mobile-first
- **Responsive**: Fully responsive design
- **Accessibility**: WCAG 2.1 AA compliant

## 📱 Screens

1. **Onboarding Screen** - User profile setup
2. **Home Screen** - Main dashboard with quick actions
3. **Analysis Screen** - Food analysis results
4. **Dashboard** - Analytics and trends
5. **Diet Plan** - AI meal planning
6. **Grocery List** - Shopping suggestions
7. **Body Transformation** - Progress tracking
8. **Profile** - Settings and preferences

## 🔐 Health Issues Supported

- Diabetes (డయాబెటీస் / நீரிழிவு / ಡಯಾಬಿಟೀಸ್)
- Blood Pressure (రక్తపోటు / இரத்த அழுத்தம் / ರಕ್ತದೊತ್ತಡ)
- Thyroid (థైరాయిడ్ / தைராய்டு / ಥೈರಾಯ್ಡ್)
- Heart Disease (గుండె జబ్బు / இதய நோய் / ಹೃದಯ ರೋಗ)
- Obesity (స్థూలకాయం / தொப்பை / ಸ್ಥೂಲತೆ)
- **Custom Health Issues** - Users can type any other health problems

## 🛡️ Allergens Tracked

- Nuts
- Gluten
- Dairy
- Eggs
- Soy
- Shellfish
- Peanuts

## 🌐 API Endpoints

### POST `/api/analyze-food`
Analyzes food images and provides nutritional information.

**Request:**
```json
{
  "image": "base64_encoded_image",
  "userId": "user-id"
}
```

**Response:**
```json
{
  "foodName": "Food Name",
  "foodItems": ["Item 1", "Item 2"],
  "calories": 300,
  "protein": 15,
  "carbs": 45,
  "fat": 8,
  "healthRating": "good",
  "recommendation": "Recommendation text",
  "healthyAlternatives": [...]
}
```

### POST `/api/voice-reminder`
Generates voice reminders for meal times.

**Request:**
```json
{
  "mealType": "breakfast",
  "language": "telugu"
}
```

**Response:** Audio file (audio/mpeg)

## 🔒 Privacy & Data

- All user data is stored locally
- No external analytics without consent
- Images are processed securely
- GDPR compliant

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@nutriscan-ai.com or create an issue in the repository.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- z-ai-web-dev-sdk for AI capabilities
- All contributors and users

---

**Made with ❤️ for healthier living**
