# Firebase Setup Guide for Talksy

## Prerequisites
- Firebase project created in [Firebase Console](https://console.firebase.google.com/)
- Flutter project configured with Firebase dependencies

## 1. Firebase Console Configuration

### Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Anonymous** authentication
3. Save changes

### Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Choose **Production mode** (not test mode)
3. Select your preferred location
4. Upload the security rules from `firestore.rules`

### Firestore Indexes
1. Go to **Firestore Database** → **Indexes**
2. Import the indexes from `firestore.indexes.json`
3. Wait for indexes to build (may take a few minutes)

### Crashlytics (Optional)
1. Go to **Crashlytics** → **Get started**
2. Follow the setup wizard
3. Enable crash reporting

### Performance (Optional)
1. Go to **Performance** → **Get started**
2. Follow the setup wizard
3. Enable performance monitoring

## 2. Platform Configuration Files

### Android
1. Download `google-services.json` from Firebase Console
2. Place it in `android/app/google-services.json`
3. The Google Services plugin is already configured in build files

### iOS
1. Download `GoogleService-Info.plist` from Firebase Console
2. Place it in `ios/Runner/GoogleService-Info.plist`
3. Add to Xcode project if not automatically added

## 3. Running the App

### Development Mode (Fake Backend)
```bash
flutter run --dart-define=USE_FAKE_BACKEND=true
```

### Production Mode (Firebase Backend)
```bash
flutter run --dart-define=USE_FAKE_BACKEND=false
```

### With Monitoring Enabled
```bash
flutter run --dart-define=USE_FAKE_BACKEND=false \
  --dart-define=ENABLE_CRASHLYTICS=true \
  --dart-define=ENABLE_PERFORMANCE=true
```

### With Auth Upgrade Enabled
```bash
flutter run --dart-define=USE_FAKE_BACKEND=false \
  --dart-define=ENABLE_AUTH_UPGRADE=true
```

### Release Build
```bash
flutter build apk --release --dart-define=USE_FAKE_BACKEND=false
```

## 4. Enhanced Data Model

### Users Collection
```
users/{uid}
├── displayName (string, optional)
├── createdAt (serverTimestamp)
└── lastSeenAt (serverTimestamp)
```

### Conversations Collection
```
conversations/{conversationId}
├── memberIds (array<string>)
├── createdAt (serverTimestamp)
├── lastMessage (map: text, ts, senderId, clientId)
└── typing (map<uid,bool>)
```

### Messages Subcollection
```
conversations/{conversationId}/messages/{messageId}
├── clientId (string) - Idempotency key
├── senderId (string)
├── text (string)
├── createdAt (serverTimestamp)
├── status (string: sent|delivered|read)
├── deliveredAt (serverTimestamp, optional)
├── readAt (serverTimestamp, optional)
├── translated (map<lang, text>) - Future feature
```

## 5. Enhanced Security Rules

The security rules provide:
- User isolation (users can only access their own data)
- Conversation access control (only members can read/write)
- Message validation (sender must be authenticated user)
- Status update permissions (only message sender or recipient can update status)
- Typing indicator permissions (conversation members only)
- Audit trail (no deletion allowed)

## 6. Performance & Offline

- Firestore offline persistence is enabled by default
- Use `limit(n)` and `startAfterDocument` for pagination
- All timestamps use `serverTimestamp()` for consistency
- Idempotent message sending with clientId
- Retry policy with exponential backoff for auth

## 7. Monitoring & Observability

### Crashlytics
- Automatic crash reporting
- Custom event logging
- User identification for crash reports

### Performance
- Automatic performance traces
- Custom trace recording
- Network request monitoring

### Logging
- Tag-based logging system
- No-op in production
- Performance timing logs

## 8. Feature Flags

### Current Flags
- `USE_FAKE_BACKEND` - Controls backend selection
- `ENABLE_CRASHLYTICS` - Enables crash reporting
- `ENABLE_PERFORMANCE` - Enables performance monitoring
- `ENABLE_AUTH_UPGRADE` - Enables auth upgrade flow

### Usage Examples
```bash
# Development with monitoring
flutter run --dart-define=USE_FAKE_BACKEND=false \
  --dart-define=ENABLE_CRASHLYTICS=true \
  --dart-define=ENABLE_PERFORMANCE=true

# Production with auth upgrade
flutter run --dart-define=USE_FAKE_BACKEND=false \
  --dart-define=ENABLE_AUTH_UPGRADE=true
```

## 9. Troubleshooting

### Common Issues
1. **"Failed to load FirebaseOptions"** - Missing configuration files
2. **"Permission denied"** - Check security rules
3. **"Index not built"** - Wait for Firestore indexes to complete
4. **"Crashlytics not working"** - Check ENABLE_CRASHLYTICS flag

### Debug Commands
```bash
# Check Firebase initialization
flutter run --dart-define=USE_FAKE_BACKEND=false

# Verify Android build
flutter build apk --debug --dart-define=USE_FAKE_BACKEND=false

# Check iOS build
flutter build ios --debug --dart-define=USE_FAKE_BACKEND=false
```

## 10. Next Steps

- [x] Add Crashlytics for crash reporting
- [x] Implement Performance monitoring
- [x] Add feature flags for monitoring
- [ ] Set up Firebase Analytics
- [ ] Configure push notifications
- [ ] Implement auth upgrade flows
- [ ] Add translation support
- [ ] Implement offline queue management
