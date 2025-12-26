# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Local development and CLI commands

This is a Vite + React + TypeScript single-page app with npm scripts defined in `package.json`.

### Prerequisites and first run

- Install dependencies:
  - `npm install`
- Configure environment variables in `.env.local`:
  - `GEMINI_API_KEY` – used in `vite.config.ts` to expose `process.env.GEMINI_API_KEY` and `process.env.API_KEY` to the frontend.
  - `GROQ_API_KEY` or `VITE_GROQ_API_KEY` – used by `services/gemini.ts` (via `import.meta.env.VITE_GROQ_API_KEY`) and also wired in `vite.config.ts`.
  - `VITE_PAYSTACK_PUBLIC_KEY` – public key for Paystack, read in `services/paystack.ts`.
- Start the dev server (from repo root):
  - `npm run dev`

The dev server is configured in `vite.config.ts` to listen on `http://0.0.0.0:3000`.

### Build and preview

- Production build (used for both web deploys and the Capacitor web bundle):
  - `npm run build`
- Preview a built app locally:
  - `npm run preview`

### Linting and formatting

- Run ESLint on the React/TS codebase:
  - `npm run lint` (runs `eslint src --ext .tsx,.ts,.js`)
- Auto-format the project with Prettier:
  - `npm run format`

### Tests (Vitest)

Vitest is configured as the test runner (see the `test` script in `package.json`).

- Run the full test suite:
  - `npm test`
- Run a subset or a single test file by pattern (Vitest standard usage):
  - `npm test -- path/to/file.test.tsx`
  - or directly: `npx vitest path/to/file.test.tsx`

Future tests should live alongside components/pages (e.g. `components/Button.test.tsx`) or in a conventional `__tests__` layout.

### Mobile / Android (Capacitor)

This project is configured for Capacitor with an Android shell:

- Capacitor config: `capacitor.config.ts` (uses `webDir: "dist"`).
- Native Android project: `android/` (Gradle wrapper, `app` module, etc.).

Typical workflow when changing web code and syncing to Android:

1. Build web assets:
   - `npm run build`
2. Sync Capacitor (from repo root):
   - `npx cap sync`
3. Open / build the Android project using Android Studio or the Gradle wrapper in `android/`.

## High-level architecture

### Entry point and app shell

- `index.tsx` is the browser entry: it creates the React root on `#root` and renders `<App />` inside `React.StrictMode`.
- `App.tsx` is the main application component. It:
  - Wraps the UI in `ErrorBoundary` and `AuthProvider` (Firebase-backed auth context).
  - Manages:
    - The active navigation tab (`NavTab` union from `types.ts`, values like `home`, `signin`, `pricing`, `analytics`, etc.).
    - Global theme (`light` / `dark`) persisted in `localStorage` and mirrored to `document.documentElement.classList`.
    - Upgrade UI state (`UpgradeModal`, `UpgradeBanner`).
    - Global toast state, driven by a `window` event listener.
  - Derives a simple `User` object (from `types.ts`) from the Firebase user + profile, with a fallback `DEFAULT_USER` so generation features can work even before sign-in.

Navigation is currently driven by tab state in `App.tsx` (not by `react-router-dom`), with each tab rendering a page component from `pages/`.

### Auth, profiles, and usage limits

- `context/AuthContext.tsx` owns Firebase authentication and the canonical user profile:
  - Uses `firebase/auth` and `firebase/firestore` with the configuration in `services/firebase.ts`.
  - On auth state change, it loads or creates a `UserProfile` document in the `users` collection.
  - Tracks subscription tier (`free`, `pro`, `business`) and per-day usage counters for ideas and captions.
  - Enforces simple daily limits for free users (`DAILY_LIMITS`), with helper methods:
    - `canGenerate(type)` – checks remaining quota.
    - `incrementUsage(type)` – persists and updates counts for Firestore-backed users.
  - Exposes high-level methods for sign-in, sign-up, Google OAuth, password reset, logout, and profile updates.
- `services/firebase.ts` initializes the Firebase app and exports `auth`, `db`, and a `GoogleAuthProvider`.
- `services/guestUsage.ts` implements a localStorage-based fallback for non-logged-in visitors, tracking guest idea/caption generations per day and determining whether signup prompts should be shown.
- `components/SignupPrompt.tsx` and `components/UpgradeBanner.tsx` encapsulate the main guest/upgrade CTAs and visualizations of remaining usage.
- `pages/Profile.tsx` and `pages/Analytics.tsx` are the primary consumers of the profile and usage information, surfacing:
  - Subscription status and plan-specific styling.
  - Lifetime and daily idea/caption counts.
  - Simple derived metrics like average generations per day.

There is also a legacy/local auth helper in `services/db.ts` that stores a lightweight `User` object in `localStorage` (including a `loginAsGuest` flow and last-login tracking). New work should treat Firebase + `AuthContext` as the source of truth and use `db.auth` only when explicitly working on the local-only flows that still depend on it.

### AI generation pipeline

All AI generation logic is centralized in `services/gemini.ts` (despite the filename, this file currently calls the Groq API):

- Core helpers:
  - `generateIdeas(...)` → returns an `IdeaResult` object for a given topic/tone/platform/post type.
  - `generateCaptions(...)` → returns a `CaptionResult` with three caption variants, hashtags, and strategy metadata.
  - `rewriteViral(text)` → rewrites a caption to be more "viral".
  - `enhanceText(input, context)` → rewrites input text to be more descriptive, used by the UI as an "AI Enhance" feature.
  - `generateSuggestion(context, user)` → generates contextual suggestions (topic or caption starter) based on the user profile.
- Implementation details:
  - Uses `import.meta.env.VITE_GROQ_API_KEY` (or `GROQ_API_KEY` via Vite `define`) to talk to Groq's `chat/completions` endpoint, with a small list of fallback models.
  - `parseJSONResponse` strips markdown fences and extracts the JSON object from model responses before parsing.

Key UI integration points:

- `components/MagicTextArea.tsx` wraps a `<textarea>` with two AI-enhanced actions:
  - Auto-fill using `generateSuggestion(context, user)` when the field is empty and a `User` is available.
  - "AI Enhance" using `enhanceText(input, context)` when there is existing value.
- Business / agency flows:
  - `pages/BusinessHub.tsx` ("Growth Launchpad") uses `generateCampaign(...)` from `services/gemini.ts` to produce campaign strategies for a product/goal pair and render a weekly plan.
  - `pages/AgencyDashboard.tsx` ("Client Success Hub") uses `generateAudit(...)` to generate client audits for a niche/industry.
- Social content flows (ideas/captions) are wired through the same service; UI components for these live in `pages/` and `components/` and generally follow a pattern of:
  - Form inputs → call into `services/gemini.ts` → render result object → pass result into export/share helpers.

### Exporting and sharing generated content

- `services/export.ts` provides pure helpers for formatting and downloading results:
  - Text export helpers (`exportToInstagram`, `exportAllCaptions`, `exportAllIdeas`).
  - JSON and Markdown exporters for ideas and captions.
  - A generic `downloadAsFile(content, filename, type)` utility that builds a `Blob`, attaches a temporary `<a>` element, and triggers a download.
  - `copyToClipboard(text)` wraps `navigator.clipboard.writeText` and returns a success boolean.
- `components/ShareButton.tsx` uses these exported strings (and direct `navigator.share`/clipboard usage) to allow users to quickly share or copy content (see `BusinessHub` and `AgencyDashboard` for usage examples).

### Monetization and payments

There are two overlapping monetization mechanisms in the codebase:

1. **Credit-based system (largely deprecated but still present):**
   - `services/credits.ts` defines credit packages, pro features, and price constants.
   - `pages/CreditsPage.tsx` and `pages/CreditStore.tsx` implement UI to earn and buy credits and to upgrade to a Pro tier.
   - Many of the actual credit checks/deductions in the content generators have been commented out or removed (with notes like "app is now free"), leaving these as mostly UI/logic scaffolding.

2. **Subscription / Paystack-based system:**
   - `services/paystack.ts` defines named `PRICE_PLANS` (Free, Pro, Business) for NGN billing and wraps the Paystack JavaScript SDK.
   - `initializePayment`, `createSubscription`, and `makePayment` encapsulate the details of loading the Paystack script, wiring callbacks, and creating one-time or subscription-like payments.
   - `VITE_PAYSTACK_PUBLIC_KEY` must be set for these flows to work.
   - The `Pricing` page (notably imported in `App.tsx`) and subscription-related CTAs (`UpgradeBanner`, `UpgradeModal`, Profile/Analytics actions) are expected to build on these helpers.

When extending or refactoring monetization, treat `services/paystack.ts` + `AuthContext` subscription fields as the primary integration points and be careful to remove or reconcile legacy credit-based logic in `services/credits.ts` / `pages/CreditsPage.tsx`.

### UI components and pages

- Shared UI components live in `components/` and include reusable primitives (`Button`, `Card`, `Input`, `Modal`, `Skeleton`, `TextExpander`) and feature-specific pieces (`SignupPrompt`, `UpgradeBanner`, `UpgradeModal`, `DownloadModal`, `ImageUploader`, `Toast`, etc.).
- Page-level experiences live in `pages/` and are typically thin compositions of shared components + service calls:
  - `SignIn.tsx`, `SignUp.tsx` – authentication flows on top of `AuthContext`.
  - `Profile.tsx`, `Analytics.tsx` – account, usage, and subscription views.
  - `BusinessHub.tsx`, `AgencyDashboard.tsx` – business/agency-focused AI tools built on the same generation service.
  - `Contact.tsx`, `Info.tsx` – support and legal/policy content.

Most styling is done via Tailwind-style utility classes applied directly to JSX, with dark mode controlled globally by the `dark` class on the `<html>` element (managed in `App.tsx`).

### Android shell

- `android/` contains a standard Capacitor-generated Android app (Gradle wrapper, `app` module, etc.) that hosts the built web app from `dist/`.
- Use this project when working on native Android packaging, permissions, or platform-specific integrations. Web app changes must be rebuilt (`npm run build`) and synced via Capacitor before they appear in the native shell.
