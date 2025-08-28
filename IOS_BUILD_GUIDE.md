# iOS Build Guide for Uyghur Language App

This guide explains how to build and deploy the iOS version of the Uyghur Language App using Capacitor.

## Prerequisites

1. **macOS**: iOS development requires macOS and Xcode
2. **Xcode**: Install the latest version from the Mac App Store
3. **Node.js**: Version 18 or higher
4. **Capacitor CLI**: Already installed in the project

## Environment Setup

### 1. Environment Variables for iOS

Create a `.env.local` file in the root directory with your Firebase configuration:

```bash
# Firebase Configuration (for web builds)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Configuration (for iOS builds - fallback)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

## Build Commands

### 1. Build for iOS (Static Export)

```bash
# Build the app for iOS (creates static export)
npm run build:ios

# Sync with Capacitor iOS project
npm run ios:sync

# Open in Xcode
npm run ios:open

# Build and run on simulator/device
npm run ios:run
```

### 2. Build for Web (Normal)

```bash
# Build for web (normal Next.js build)
npm run build

# Start production server
npm run start
```

## Build Process Details

### iOS Build (`npm run build:ios`)

1. Sets `BUILD_TARGET=ios` environment variable
2. Enables static export (`output: 'export'`)
3. Disables image optimization for static export
4. Adds trailing slashes for static hosting
5. Configures webpack for iOS compatibility
6. Generates static files in the `out/` directory

### Web Build (`npm run build`)

1. Normal Next.js build process
2. Server-side rendering enabled
3. Full interactive functionality
4. Firebase integration active

## Platform Detection

The app automatically detects the platform and renders appropriate components:

- **Web**: Full interactive client-side components with Firebase
- **iOS**: Static pre-rendered components without client-side state

### Key Differences

| Feature             | Web Version             | iOS Version               |
| ------------------- | ----------------------- | ------------------------- |
| Authentication      | Full Firebase Auth      | Read-only (no auth)       |
| Progress Tracking   | localStorage + Firebase | Read-only                 |
| Interactive Lessons | Full exercises          | Vocabulary reference only |
| Quizzes             | Interactive             | Preview only              |
| Offline Support     | Limited                 | Full (static content)     |

## Capacitor Configuration

The `capacitor.config.ts` file is configured for iOS:

- **webDir**: Set to `"out"` for static export
- **iOS-specific settings**: Content inset, navigation limits, etc.
- **Plugins**: Splash screen and status bar configuration

## File Structure

```
src/app/lessons/
├── page.tsx              # Main lessons page (platform-aware)
├── static-page.tsx       # iOS static version
└── [slug]/
    ├── page.tsx          # Lesson detail (platform-aware)
    └── static-page.tsx   # iOS static version

src/app/quiz/
└── [unitId]/
    ├── page.tsx          # Quiz page (platform-aware)
    └── static-page.tsx   # iOS static version
```

## Troubleshooting

### Common Issues

1. **Build fails with static export**

   - Ensure all dynamic routes have static alternatives
   - Check for client-side only code in static components

2. **Capacitor sync issues**

   - Run `npx cap sync ios` manually
   - Check that `webDir` points to `"out"` in capacitor.config.ts

3. **Firebase not working on iOS**

   - iOS version disables Firebase for static export
   - This is intentional - use web version for full functionality

4. **Images not loading**
   - iOS build disables image optimization
   - Ensure images are in the `public/` directory

### Performance Optimization

- **iOS**: Static content loads instantly, no JavaScript execution
- **Web**: Full interactive experience with dynamic loading
- **Bundle size**: iOS version is significantly smaller due to static export

## Deployment

### iOS App Store

1. Build the iOS version: `npm run build:ios`
2. Sync with Capacitor: `npm run ios:sync`
3. Open in Xcode: `npm run ios:open`
4. Archive and upload to App Store Connect

### Web Deployment

1. Build for web: `npm run build`
2. Deploy to your hosting platform (Vercel, Netlify, etc.)

## Development Workflow

1. **Web Development**: Use `npm run dev` for normal development
2. **iOS Testing**: Use `npm run ios:sync` after making changes
3. **Cross-platform**: Test both versions before deploying

## Notes

- The iOS version is designed as a reference/learning tool
- Full interactive features are available in the web version
- Both versions share the same UI components and styling
- Platform detection is automatic and transparent to users
