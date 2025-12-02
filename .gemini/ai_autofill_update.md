# AI Auto-Fill Implementation

## 🧠 Contextual AI Suggestions

I've implemented a "Smart Auto-fill" feature across the application. This feature uses the user's profile data (Niche, Bio, Role) to intelligently suggest content for input fields, reducing user effort.

### 🛠️ Technical Implementation

#### 1. **New Service: `generateSuggestion`**
**File:** `services/gemini.ts`
*   Takes `context` (idea, caption, business, agency) and `user` object.
*   Constructs a personalized prompt based on:
    *   `user.niche`: The user's industry.
    *   `user.bio`: The user's brand voice/description.
    *   `user.role`: The user's account type.
*   Returns a concise suggestion string.

#### 2. **Enhanced Component: `MagicTextArea`**
**File:** `components/MagicTextArea.tsx`
*   **New Prop:** `user` (optional).
*   **New Button:** `✨ Auto-fill`.
*   **Logic:**
    *   If `user` prop is provided AND the text area is empty: Show "Auto-fill" button.
    *   On click: Calls `generateSuggestion` and populates the field.
    *   If text area has content: Shows standard "AI Enhance" button.

#### 3. **Page Integration**
Updated the following pages to pass user context to inputs:
*   `pages/IdeaGenerator.tsx` - Auto-fills "Topic or Niche".
*   `pages/CaptionGenerator.tsx` - Auto-fills "What is your post about?".
*   `pages/BusinessHub.tsx` - Auto-fills "Product Name" and "Campaign Goal".
*   `pages/AgencyDashboard.tsx` - Replaced standard Input with MagicTextArea to auto-fill "Client Niche".

## 🚀 User Benefit
*   **Zero Friction:** Users don't need to think of a topic to test the app. They just click "Auto-fill".
*   **Personalization:** Suggestions are relevant to *their* specific niche (e.g., a "Fitness" user gets fitness topics, not generic ones).
*   **Speed:** Reduces time-to-value significantly.

## 📝 Example Scenarios

| User Niche | Context | Auto-fill Result (Example) |
|------------|---------|----------------------------|
| **Fitness** | Idea | "5 Common Mistakes People Make When Starting Weight Training" |
| **Real Estate** | Caption | "Just listed! 🏡 Check out this stunning modern kitchen..." |
| **SaaS** | Business | "Launch a referral program for our CRM software" |
| **Marketing** | Agency | "Dental Practices in Chicago" |

