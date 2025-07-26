# Summer Fitness Quest 🏃‍♂️☀️

A gamified mobile fitness adventure app that transforms outdoor activities into exciting summer-themed quests and challenges. Built with React Native and Expo, featuring real-time location tracking, weather integration, and social sharing capabilities.

## 🌟 Features

### 🎮 Gamified Fitness Experience
- **XP & Leveling System**: Earn experience points and level up through activities
- **Quest System**: Complete summer-themed challenges like "Beach Run Challenge" and "Sunrise Yoga Walk"
- **Achievements & Badges**: Unlock digital badges and milestone trophies
- **Coin Economy**: Earn coins through activities to spend in the reward store

### 📍 Location-Based Activities
- **Real-time GPS Tracking**: Track running, walking, and cycling activities with precise geolocation
- **Distance & Speed Calculation**: Monitor your performance with accurate metrics
- **Route Mapping**: Record your activity paths and view detailed statistics
- **Safety Alerts**: Weather-based notifications for heat warnings and unsafe conditions

### 🌤️ Weather Integration
- **Live Weather Data**: Real-time weather information for your location
- **Safety Notifications**: Heat wave alerts and weather-based activity recommendations
- **Condition-based UI**: Dynamic weather icons and temperature displays

### 📱 Social Features
- **Activity Feed**: Share workout photos, route maps, and achievements
- **Sweat Points System**: Earn points through emoji reactions (💪, 🔥, 👏, etc.)
- **Photo Sharing**: Capture and share your fitness journey with camera integration
- **Comments & Reactions**: Engage with the fitness community

### 🏪 Reward Store
- **Avatar Customization**: Unlock summer-themed avatars and gear
- **Discount Coupons**: Redeem coins for gym memberships and protein supplements
- **Digital Collectibles**: Earn rare NFT badges and medals
- **Performance Gear**: Purchase items that provide in-game benefits

### 📊 Health Tracking
- **Daily Progress**: Monitor steps, calories, and activity goals
- **Weekly Statistics**: View your fitness trends and improvements
- **Activity History**: Track completed quests and achievements
- **Performance Metrics**: Detailed stats for each workout session

## 🛠️ Technology Stack

- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand for global state
- **Location Services**: Expo Location with background tracking
- **Camera**: Expo Camera with image picker integration
- **UI Components**: Custom components with Lucide React Native icons
- **Styling**: React Native StyleSheet with Linear Gradients
- **TypeScript**: Full type safety throughout the application

## 📱 Supported Platforms

- **iOS**: Full native functionality with background location tracking
- **Android**: Complete feature set with foreground service location
- **Web**: React Native Web compatible with fallbacks for native features

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Bun package manager
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd summer-fitness-quest
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   bun run start
   ```

4. **Run on specific platforms**
   ```bash
   # Web development
   bun run start-web
   
   # Web with debug logs
   bun run start-web-dev
   ```

### 📱 Testing on Device

1. Install Expo Go app on your mobile device
2. Scan the QR code displayed in the terminal
3. Grant location and camera permissions when prompted

## 🏗️ Project Structure

```
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen with activity tracking
│   │   ├── quests.tsx     # Available quests and challenges
│   │   ├── social.tsx     # Social feed and photo sharing
│   │   ├── profile.tsx    # User profile and achievements
│   │   └── store.tsx      # Reward store and purchases
│   ├── _layout.tsx        # Root layout with providers
│   └── modal.tsx          # Modal screens
├── store/                 # Zustand state management
│   ├── gameStore.ts       # Game state and user data
│   └── socialStore.ts     # Social features and posts
├── types/                 # TypeScript type definitions
│   ├── game.ts           # Game-related interfaces
│   ├── social.ts         # Social feature types
│   └── weather.ts        # Weather data types
├── services/             # External API services
│   └── weatherService.ts # Weather data integration
├── constants/            # App constants and configuration
│   └── colors.ts         # Color palette
└── assets/              # Static assets and images
```

## 🔧 Key Components

### Home Screen (`app/(tabs)/index.tsx`)
- Real-time activity tracking with GPS
- Weather display with safety alerts
- Quick action buttons for different activities
- Progress tracking and statistics

### Social Feed (`app/(tabs)/social.tsx`)
- Photo sharing with camera integration
- Emoji reaction system for "sweat points"
- Activity post creation and sharing
- Community engagement features

### Quest System (`app/(tabs)/quests.tsx`)
- Browse available challenges
- Track quest progress
- Difficulty-based rewards
- Seasonal and themed content

### Reward Store (`app/(tabs)/store.tsx`)
- Avatar and gear customization
- Coupon redemption system
- NFT collectibles
- Coin and step-based purchases

## 🔐 Permissions Required

### iOS
- Location (Always/When in Use)
- Camera Access
- Photo Library Access
- Background Location Updates

### Android
- Fine/Coarse Location
- Camera Permission
- External Storage Access
- Foreground Service Location

## 🌐 API Integration

### Weather Service
- Real-time weather data fetching
- Location-based weather alerts
- Temperature and condition monitoring
- Safety notification system

### Location Tracking
- High-accuracy GPS positioning
- Background location updates
- Distance and speed calculations
- Route path recording

## 🎨 Design Philosophy

- **Summer Theme**: Bright, energetic colors with beach and outdoor vibes
- **Gamification**: RPG-style progression with levels, XP, and rewards
- **Social First**: Community-driven features with sharing and reactions
- **Safety Focused**: Weather alerts and health-conscious notifications
- **Mobile Optimized**: Touch-friendly interface with smooth animations

## 🔄 State Management

The app uses Zustand for efficient state management:

- **Game Store**: User progress, quests, achievements, and store items
- **Social Store**: Posts, reactions, comments, and social interactions
- **Persistent Storage**: AsyncStorage for user preferences and data

## 🚨 Safety Features

- **Heat Wave Alerts**: Automatic notifications when temperature exceeds safe levels
- **Weather Monitoring**: Real-time weather condition tracking
- **Activity Recommendations**: Weather-based exercise suggestions
- **Hydration Reminders**: Built into the gamification system

## 🏆 Gamification Elements

- **XP System**: 20 XP per kilometer with activity type multipliers
- **Level Progression**: Level up every 1000 XP
- **Coin Economy**: 1 coin per 10 XP earned
- **Achievement System**: Distance, streak, quest, and social achievements
- **Leaderboards**: Community ranking and competition

## 🔮 Future Enhancements

- **Health Kit Integration**: Apple Health and Google Fit synchronization
- **Multiplayer Challenges**: Team-based quests and competitions
- **AR Features**: Augmented reality quest elements
- **Wearable Support**: Smartwatch integration for heart rate monitoring
- **Advanced Analytics**: Detailed performance insights and trends

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the excellent React Native framework
- **Lucide Icons**: Beautiful icon library
- **OpenWeatherMap**: Weather data API
- **React Native Community**: For continuous support and contributions

---

**Ready to turn your summer fitness journey into an adventure? Download Summer Fitness Quest and start your quest today!** 🏃‍♂️🌞🏆