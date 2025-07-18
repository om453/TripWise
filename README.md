# TripWise

TripWise is a modern, full-stack travel itinerary planner built with Next.js, React, and Firebase. It allows users to create, manage, and explore travel itineraries with a beautiful, intuitive interface and AI-powered trip recommendations.

## ✨ Features

- **User Authentication**: Secure signup and login with Firebase Auth. Only authenticated users can create and manage itineraries.
- **Personal Itineraries**: Create, view, edit, and delete your own travel itineraries. Each user sees only their own data.
- **Image Upload**: Upload a custom image for each itinerary (stored as Base64 for free-tier compatibility).
- **Favorites**: Mark itineraries as favorites for quick access.
- **AI Trip Recommendations**: Get personalized, human-like travel suggestions for each itinerary, with highlighted places and attractions.
- **Attractive UI/UX**: Modern, responsive design with accent colors, beautiful cards, and engaging empty states.
- **Dynamic Place Highlighting**: Important places in AI suggestions are automatically highlighted for every trip.
- **No Demo Data**: The app starts clean—users only see their own created itineraries.
- **Mobile Friendly**: Responsive layout for all devices.

## 🛠️ Tech Stack
- **Next.js 14** (App Router)
- **React 18**
- **Firebase Auth & Firestore** (per-user data)
- **Tailwind CSS** (custom theme)
- **TypeScript**
- **Framer Motion** (animations)
- **OpenAI/Genkit** (AI trip suggestions)

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/tripwise.git
cd tripwise
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Firebase
- Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
- Enable **Authentication** (Email/Password)
- Enable **Firestore Database**
- (Optional) Enable **Firebase Storage** if you want to use cloud image uploads
- Add your Firebase config to a `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Run the app
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

## 📝 Usage
- **Sign up** to create your account
- **Create a new itinerary** with title, destination, dates, category, description, and a custom image
- **View and manage** your itineraries from the home page
- **Mark favorites** for quick access
- **Get AI trip recommendations** for each itinerary
- **Log out** securely from the profile menu

## 💡 Customization
- Update the logo in `/public/mountain-logo.png`
- Change accent colors in `tailwind.config.ts`
- Edit AI prompt logic in `src/components/itineraries/ai-suggestions.tsx`


## 📄 License
[MIT](LICENSE)

---

**TripWise** — Plan smarter, travel better.
