# Google Cloud Translation API Integration

## Overview
This project now includes Google Cloud Translation API v3 integration through Firebase Functions, providing real translation capabilities for the Flutter app.

## Architecture
- **Firebase Functions**: `translateText` function in `europe-west1` region
- **Flutter Client**: `GoogleTranslator` adapter implementing the `Translator` interface
- **Provider Switch**: Configurable via `--dart-define=TRANSLATOR=google`

## Usage

### 1. Enable Google Cloud Translation API
```bash
gcloud services enable translate.googleapis.com --project talksy-fb2c2
```

### 2. Deploy Firebase Functions
```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

### 3. Run Flutter with Google Translator
```bash
# Enable Google translator
flutter run --dart-define=TRANSLATOR=google

# Use default noop translator
flutter run
```

### 4. In Code
```dart
// The translator is automatically selected based on dart-define
final translator = ref.read(activeTranslatorProvider);

final result = await translator.translate(
  text: "Hello world",
  to: "es", // Spanish
);

print(result.translatedText); // "Hola mundo"
```

## Configuration

### Environment Variables
- `TRANSLATOR`: Set to `google` to enable Google Cloud Translation
- Default: `noop` (no translation, returns original text)

### Firebase Functions Configuration
- **Region**: `europe-west1`
- **Memory**: `256MiB`
- **Timeout**: `10 seconds`
- **Authentication**: Required (any authenticated user)

## Error Handling
- **Fail-open**: If translation fails, original text is returned
- **Input Validation**: Empty text, invalid language codes, and text > 4000 chars are rejected
- **Logging**: All errors are logged to Firebase Functions logs

## Language Codes
- Use ISO 639-1 language codes (e.g., `en`, `es`, `fr`)
- Regional variants supported (e.g., `en-US`, `es-ES`)
- Auto-detection when source language is not specified

## Testing
```bash
# Run translation tests
flutter test test/translator_google_test.dart

# Run all tests
flutter test

# Analyze code
flutter analyze
```

## Deployment
1. Ensure Google Cloud Translation API is enabled
2. Deploy Firebase Functions: `firebase deploy --only functions`
3. Build and run Flutter app with appropriate dart-define

## Monitoring
- Check Firebase Functions logs for translation errors
- Monitor Google Cloud Translation API usage in Google Cloud Console
- Function metrics available in Firebase Console
