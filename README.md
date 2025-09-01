# Uyghurly - React Native iOS App

A React Native iOS application for learning the Uyghur language through interactive lessons, quizzes, and a comprehensive dictionary.

## Features

- **Interactive Lessons**: Step-by-step Uyghur language learning
- **Quiz System**: Test your knowledge with multiple-choice questions
- **Dictionary**: Search and browse Uyghur words with translations
- **User Authentication**: Login, signup, and guest mode
- **Progress Tracking**: Monitor your learning journey
- **Dark/Light Theme**: Customizable appearance
- **Font Size Options**: Adjustable text sizing for accessibility
- **Responsive Design**: Optimized for iOS devices

## Tech Stack

- **React Native**: 0.73.6
- **TypeScript**: For type safety
- **React Navigation**: For app navigation
- **Firebase**: For authentication and data storage
- **AsyncStorage**: For local data persistence
- **Vector Icons**: For UI icons

## Prerequisites

- Node.js (v16 or higher)
- Xcode (latest version for iOS development)
- iOS Simulator or physical iOS device
- React Native CLI

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uyghurly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   ```

5. **Run on iOS Simulator**
   ```bash
   npm run ios
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TabBarIcon.tsx  # Tab navigation icons
│   └── ui/             # UI component library
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── ThemeContext.tsx # Theme management
│   └── FontSizeContext.tsx # Font size preferences
├── screens/            # App screens
│   ├── LoginScreen.tsx # User authentication
│   ├── HomeScreen.tsx  # Main dashboard
│   ├── LessonsScreen.tsx # Lesson selection
│   ├── LessonDetailScreen.tsx # Individual lessons
│   ├── DictionaryScreen.tsx # Word dictionary
│   ├── QuizScreen.tsx  # Quiz interface
│   ├── ProfileScreen.tsx # User profile
│   ├── SettingsScreen.tsx # App settings
│   └── AdminScreen.tsx # Admin panel
├── lib/                # Utility libraries
│   ├── firebase.ts     # Firebase configuration
│   └── userService.ts  # User management service
└── types/              # TypeScript type definitions
```

## Navigation Structure

- **Stack Navigator**: Handles screen transitions
- **Tab Navigator**: Bottom tab navigation for main app sections
- **Screen Flow**: Login → Main Tabs → Individual Screens

## Key Components

### Authentication
- User registration and login
- Google authentication support
- Guest mode for quick access
- Secure token management

### Theme System
- Light, dark, and auto themes
- System preference detection
- Persistent theme storage

### Font Size Management
- Small, medium, and large options
- Dynamic text sizing
- Accessibility-focused design

### Learning Features
- Progressive lesson structure
- Interactive quiz system
- Comprehensive dictionary
- Progress tracking

## Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication and Firestore
3. Update `src/lib/firebase.ts` with your config
4. Configure iOS bundle ID in Firebase console

### iOS Configuration
- Update bundle identifier in Xcode
- Configure signing certificates
- Set up app icons and launch screen

## Development

### Adding New Screens
1. Create screen component in `src/screens/`
2. Add to navigation in `src/App.tsx`
3. Update tab icons if needed

### Styling
- Use StyleSheet for component styles
- Follow theme-aware color scheme
- Implement responsive design patterns

### State Management
- Use React Context for global state
- Local state for component-specific data
- AsyncStorage for persistent preferences

## Building for Production

1. **Update version in package.json**
2. **Configure signing in Xcode**
3. **Build archive**
   ```bash
   npm run ios:build
   ```
4. **Upload to App Store Connect**

## Troubleshooting

### Common Issues
- **Metro bundler issues**: Clear cache with `npm start -- --reset-cache`
- **iOS build errors**: Clean build folder in Xcode
- **Pod install issues**: Delete `ios/Pods` and reinstall

### Debug Mode
- Enable React Native debugger
- Use console.log for debugging
- Check Metro bundler logs

## Contributing

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests if applicable
5. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and solutions

## Roadmap

- [ ] Audio pronunciation support
- [ ] Offline mode
- [ ] Social features
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Apple Watch companion app
