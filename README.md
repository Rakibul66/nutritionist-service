<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `VITE_GOOGLE_GENAI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firebase configuration

The ebook/store/admin workflows now rely on Firebase Auth and Firestore. Create a `.env.local` (or `.env`) file with:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

Only the emails listed in `VITE_ADMIN_EMAILS` (or anyone under `@nutritionistprobal.com` by default) can publish ebooks and view admin widgets. Leaving Firebase variables empty keeps the local fallback data running but disables write operations.

## Routes

- `/` — Public user homepage (services, ebook catalog, reviews, order modal).
- `/admin` — Admin module with Google login, ebook publish form, and order/review snapshots. The link is already available in the navbar.
