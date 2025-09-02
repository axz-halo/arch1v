# 🎵 Arch1ve - Music Curation Platform

A real-time music sharing and community-driven music discovery platform built with Next.js, Firebase, and Spotify integration.

![Arch1ve Platform](https://img.shields.io/badge/Arch1ve-Music%20Curation%20Platform-orange)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-yellow)
![Spotify](https://img.shields.io/badge/Spotify-API-green)

## ✨ Features

### 🎧 Core Features
- **Music Wave Feed**: Real-time music sharing with reactions (like, love, fire)
- **Radio Station Management**: YouTube playlist integration and management
- **Community Chart Voting**: Weekly themed playlists with community voting
- **Music DNA Analytics**: Personalized music taste visualization
- **Search & Discovery**: Find music, artists, and stations

### 🔐 Authentication
- **Google OAuth**: One-click authentication with Google
- **Spotify Integration**: Connect Spotify account for enhanced features
- **Profile Management**: User profiles with music preferences

### 🎨 Design Philosophy
- **Minimalism**: Clean, distraction-free interface
- **Turntable Metaphor**: Circular music cards like LP records
- **Neumorphism**: Soft shadows and depth for physical metaphors
- **Korean Localization**: Full Korean UI/UX

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Spotify Developer account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/arch1ve.git
   cd arch1ve
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Spotify API Configuration
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/spotify/callback
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── spotify/       # Spotify API endpoints
│   ├── auth/              # Authentication pages
│   │   └── spotify/       # Spotify OAuth flow
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Context providers
├── components/            # React components
│   ├── features/          # Feature components
│   │   ├── ChartCard.tsx  # Chart voting cards
│   │   ├── StationCard.tsx # Radio station cards
│   │   └── WaveCard.tsx   # Music wave cards
│   ├── layout/            # Layout components
│   │   ├── BottomNavigation.tsx
│   │   └── MainLayout.tsx
│   └── ui/                # UI components
│       ├── Button.tsx
│       └── Card.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── hooks/                 # Custom hooks
│   └── useAuth.ts         # Authentication hook
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   ├── mockData.ts        # Demo data
│   ├── spotify.ts         # Spotify API utilities
│   └── utils.ts           # General utilities
└── types/                 # TypeScript types
    └── index.ts           # Type definitions
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Copy your Firebase config to `.env.local`

### Spotify Setup
1. Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Add `http://localhost:3000/auth/spotify/callback` to redirect URIs
3. Copy your Client ID and Secret to `.env.local`

## 🧪 Testing

### Authentication Flow
1. Visit [http://localhost:3000](http://localhost:3000)
2. Click "Google로 시작하기" (Start with Google)
3. Complete Google OAuth
4. Click "Spotify 계정 연결" (Connect Spotify Account)
5. Authorize Spotify access

### Features Testing
- **Wave Feed**: Browse music waves, try reactions
- **Station Management**: Browse stations, test subscribe buttons
- **Chart Voting**: Vote on tracks in weekly charts
- **Search**: Try searching for music or artists

## 📱 Mobile Experience

The app is fully responsive with:
- Bottom navigation tabs
- Touch-friendly interfaces
- Mobile-optimized layouts
- Progressive Web App ready

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - Music data
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons

## 📞 Support

For support, email support@arch1ve.com or join our Discord community.

---

**Arch1ve** - Where music meets community 🎵
