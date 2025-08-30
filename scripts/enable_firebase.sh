#!/bin/bash

# Script to enable Firebase in the Talksy project
# Run this when you have google-services.json and GoogleService-Info.plist ready

echo "🚀 Enabling Firebase for Talksy..."

# 1. Uncomment Google Services plugin in Android
echo "📱 Updating Android build.gradle.kts..."
sed -i '' 's|// id("com.google.gms.google-services")|id("com.google.gms.google-services")|' android/app/build.gradle.kts

# 2. Verify configuration files exist
echo "🔍 Checking Firebase configuration files..."

if [ -f "android/app/google-services.json" ]; then
    echo "✅ android/app/google-services.json found"
else
    echo "❌ android/app/google-services.json missing"
    echo "   Download from Firebase Console and place in android/app/"
fi

if [ -f "ios/Runner/GoogleService-Info.plist" ]; then
    echo "✅ ios/Runner/GoogleService-Info.plist found"
else
    echo "❌ ios/Runner/GoogleService-Info.plist missing"
    echo "   Download from Firebase Console and place in ios/Runner/"
fi

echo ""
echo "🎯 To run with Firebase backend:"
echo "   flutter run --dart-define=USE_FAKE_BACKEND=false"
echo ""
echo "🎯 To run with fake backend (current):"
echo "   flutter run --dart-define=USE_FAKE_BACKEND=true"
echo ""
echo "📚 See FIREBASE_SETUP.md for complete configuration guide"
