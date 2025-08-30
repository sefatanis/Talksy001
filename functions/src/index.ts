import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
import { TranslationServiceClient } from "@google-cloud/translate";

admin.initializeApp();

// Cloud Functions v2 callable: translateText
export const translateText = onCall(
  {
    region: "us-central1",
    cors: true,
    enforceAppCheck: false, // İstersen AppCheck ekleyebiliriz (true yapıp istemciyi hazırlarız)
    maxInstances: 20
  },
  async (request) => {
    const data = request.data as {
      text?: string;
      target?: string;
      source?: string | null;
      mimeType?: "text/plain" | "text/html";
    };

    const text = (data.text || "").trim();
    const target = (data.target || "").trim().toLowerCase();
    const source = (data.source || "")?.trim().toLowerCase() || undefined;
    const mimeType = data.mimeType || "text/plain";

    if (!text) {
      throw new Error("Missing 'text'");
    }
    if (!target) {
      throw new Error("Missing 'target' language code");
    }

    const client = new TranslationServiceClient();
    const parent = `projects/${process.env.GCLOUD_PROJECT}/locations/global`;

    const [resp] = await client.translateText({
      parent,
      contents: [text],
      targetLanguageCode: target,
      sourceLanguageCode: source,
      mimeType
    });

    const first = resp.translations?.[0];
    return {
      translatedText: first?.translatedText ?? text,
      detectedSourceLanguage: first?.detectedLanguageCode ?? null
    };
  }
);
