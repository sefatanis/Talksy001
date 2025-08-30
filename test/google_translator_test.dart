import 'package:flutter_test/flutter_test.dart';
import 'package:talksy/core/translation/google_rest_translator.dart';

void main() {
  group('GoogleRestTranslator', () {
    test('should return original text when no API key is provided', () async {
      final translator = GoogleRestTranslator(apiKey: '');
      
      final result = await translator.translate(
        text: 'Hello World',
        to: 'tr',
      );
      
      expect(result.originalText, 'Hello World');
      expect(result.translatedText, 'Hello World');
      expect(result.toLang, 'tr');
    });

    test('should handle null API key gracefully', () async {
      final translator = GoogleRestTranslator();
      
      final result = await translator.translate(
        text: 'Test message',
        to: 'es',
      );
      
      expect(result.originalText, 'Test message');
      expect(result.translatedText, 'Test message');
      expect(result.toLang, 'es');
    });

    test('should preserve detected source language when provided', () async {
      final translator = GoogleRestTranslator(apiKey: 'test-key');
      
      final result = await translator.translate(
        text: 'Hello',
        from: 'en',
        to: 'tr',
      );
      
      expect(result.detectedSourceLang, 'en');
      expect(result.toLang, 'tr');
    });
  });
}
