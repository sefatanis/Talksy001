import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { TranslationServiceClient } from "@google-cloud/translate";
initializeApp();
const REGION = "europe-west1";
const LOCATION = "global"; // Cloud Translation v3 genellikle "global" kullanır
export const translateText = onCall({
    region: REGION,
    cors: true,
    memory: "256MiB",
    timeoutSeconds: 10
}, async (request) => {
    // Auth zorunlu (anon da olur)
    if (!request.auth || !request.auth.uid) {
        throw new HttpsError("unauthenticated", "Authentication required.");
    }
    const data = request.data ?? {};
    const text = (data.text ?? "").toString();
    const target = (data.target ?? "").toString().toLowerCase();
    const source = data.source ? data.source.toString().toLowerCase() : undefined;
    // Basit doğrulamalar
    if (!text || !text.trim()) {
        throw new HttpsError("invalid-argument", "Text is empty.");
    }
    if (!/^[a-z]{2}(-[A-Za-z]{2})?$/.test(target)) {
        throw new HttpsError("invalid-argument", "Invalid target language code.");
    }
    if (source && !/^[a-z]{2}(-[A-Za-z]{2})?$/.test(source)) {
        throw new HttpsError("invalid-argument", "Invalid source language code.");
    }
    if (text.length > 4000) {
        throw new HttpsError("invalid-argument", "Text is too long (max 4000 chars).");
    }
    const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;
    if (!projectId) {
        logger.error("Missing project ID env");
        throw new HttpsError("internal", "Configuration error: projectId.");
    }
    try {
        const client = new TranslationServiceClient();
        const [response] = await client.translateText({
            parent: `projects/${projectId}/locations/${LOCATION}`,
            contents: [text],
            targetLanguageCode: target,
            sourceLanguageCode: source, // undefined ise auto-detect
            mimeType: "text/plain"
        });
        const translation = response.translations?.[0];
        const translatedText = translation?.translatedText ?? text;
        const detectedSourceLanguage = translation?.detectedLanguageCode ?? source ?? null;
        return {
            translatedText,
            detectedSourceLanguage
        };
    }
    catch (err) {
        logger.error("translateText error", err);
        // Fail-open tercih edilebilir; fakat burada hatayı client'a bildiriyoruz
        throw new HttpsError("internal", `Translation failed: ${err?.message ?? err}`);
    }
});
