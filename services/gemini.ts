
import Groq from "groq-sdk";
import { IdeaResult, CaptionResult, CampaignResult, AuditResult } from "../types";


const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

const groq = new Groq({ 
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Fast models for quick responses, with fallback
const MODELS = ["mixtral-8x7b-32768", "llama3-70b-8192", "gemma-7b-it"];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateWithGroq(prompt: string): Promise<string> {
  for (const model of MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: model,
          temperature: 0.7,
          max_tokens: 2048,
        });
        return completion.choices[0]?.message?.content || "";
      } catch (error) {
        console.warn(`Groq Model ${model} failed:`, error);
        // Continue to next model
      }
  }
  throw new Error("AI generation failed. Please check your internet connection or API key.");
}

export const enhanceText = async (input: string, context: 'idea' | 'caption' | 'business' | 'agency'): Promise<string> => {
    if (!input.trim()) return "";
    
    const prompt = `You are a creative assistant. Rewrite this input to be more descriptive and professional for ${context} generation: "${input}". Keep it concise (max 2 sentences). Return ONLY the rewritten text, no explanations.`;

    try {
        const result = await generateWithGroq(prompt);
        return result.trim() || input;
    } catch (e) {
        console.error("Enhance error", e);
        return input;
    }
}

export const generateSuggestion = async (context: 'idea' | 'caption' | 'business' | 'agency', user: any): Promise<string> => {
    const niche = user.niche || 'General';
    const bio = user.bio || 'Content Creator';
    const role = user.role || 'creator';
    let prompt = "";

    if (context === 'idea') {
        prompt = `Suggest a trending content topic for a ${role} in the "${niche}" niche. Bio: "${bio}". Return ONLY the topic sentence, nothing else.`;
    } else if (context === 'caption') {
        prompt = `Write a short, engaging caption starter for a ${role} in the "${niche}" niche. Bio: "${bio}". Return ONLY the text, nothing else.`;
    } else if (context === 'business') {
        prompt = `Suggest a product name or campaign goal for a business in the "${niche}" niche. Return ONLY the text.`;
    } else if (context === 'agency') {
        prompt = `Suggest a potential client niche or industry for a marketing agency. Return ONLY the text.`;
    } else if (context === 'bio') {
        prompt = `Write a short, professional bio (under 150 chars) for a ${role} in the "${niche}" niche. Platforms: ${user.platforms?.join(', ')}. Return ONLY the bio text.`;
    }

    try {
        const result = await generateWithGroq(prompt);
        return result.trim();
    } catch (e) {
        console.error("Suggestion error", e);
        return "";
    }
}

export const rewriteViral = async (text: string): Promise<string> => {
    const prompt = `Rewrite this social media caption to be extremely viral and engaging. Use modern slang but keep it readable. Add emojis tastefully. Return ONLY the new caption:\n\n"${text}"`;

    try {
        const result = await generateWithGroq(prompt);
        return result.trim() || text;
    } catch (e) {
        return text;
    }
}

export const generateIdeas = async (topic: string, tone: string, platform: string, postType: string): Promise<IdeaResult> => {
  const prompt = `Generate 3 viral content ideas for ${platform} ${postType} about "${topic}" with a ${tone} tone.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "ideas": ["idea 1", "idea 2", "idea 3"],
  "hook": "a catchy hook sentence",
  "strategy": {
    "bestTime": "best posting time",
    "postingTips": ["tip 1", "tip 2", "tip 3"],
    "visualAdvice": "visual content advice"
  }
}`;

  try {
    const result = await generateWithGroq(prompt);
    // Clean any markdown formatting
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as IdeaResult;
  } catch (error) {
    console.error("Generate ideas error:", error);
    throw new Error("Failed to generate ideas. Please try again.");
  }
};

export const generateCaptions = async (
  topic: string, 
  tone: string, 
  platform: string, 
  postType: string,
  images: string[] = []
): Promise<CaptionResult> => {
  const imageContext = images.length > 0 ? ` (with ${images.length} image(s))` : '';
  
  const prompt = `Create 3 social media captions for ${platform} ${postType} about "${topic}"${imageContext} with ${tone} tone.

1. Short & Punchy (1-2 lines)
2. Medium & Engaging with question/CTA
3. Long storytelling caption with value

Also provide 15 relevant hashtags and posting strategy.

Return ONLY valid JSON (no markdown):
{
  "captions": ["caption 1", "caption 2", "caption 3"],
  "hashtags": ["hashtag1", "hashtag2", ...15 total],
  "strategy": {
    "bestTime": "best time to post",
    "postingTips": ["tip 1", "tip 2", "tip 3"],
    "visualAdvice": "advice for visual content"
  }
}`;

  try {
    const result = await generateWithGroq(prompt);
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as CaptionResult;
  } catch (error) {
    console.error("Generate captions error:", error);
    throw new Error("Failed to generate captions. Please try again.");
  }
};

export const generateCampaign = async (productName: string, goal: string): Promise<CampaignResult> => {
    const prompt = `Create a 5-day social media campaign for product "${productName}" with goal: "${goal}".

Return ONLY valid JSON (no markdown):
{
  "campaignName": "catchy campaign name",
  "targetAudience": "target audience description",
  "kpi": "key performance indicator",
  "weeklyPlan": [
    {"day": "Day 1", "focus": "focus area", "contentIdea": "specific content idea"},
    {"day": "Day 2", "focus": "focus area", "contentIdea": "specific content idea"},
    {"day": "Day 3", "focus": "focus area", "contentIdea": "specific content idea"},
    {"day": "Day 4", "focus": "focus area", "contentIdea": "specific content idea"},
    {"day": "Day 5", "focus": "focus area", "contentIdea": "specific content idea"}
  ]
}`;

    try {
        const result = await generateWithGroq(prompt);
        const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned) as CampaignResult;
    } catch(e) {
        console.error(e);
        throw new Error("Failed to generate campaign.");
    }
};

export const generateAudit = async (clientNiche: string): Promise<AuditResult> => {
    const prompt = `Perform a social media audit for "${clientNiche}" niche.

Return ONLY valid JSON (no markdown):
{
  "clientNiche": "${clientNiche}",
  "contentGaps": ["gap 1", "gap 2", "gap 3"],
  "competitorAnalysis": "brief competitor analysis",
  "recommendedPillars": ["pillar 1", "pillar 2", "pillar 3", "pillar 4"]
}`;

    try {
        const result = await generateWithGroq(prompt);
        const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned) as AuditResult;
    } catch(e) {
        console.error(e);
        throw new Error("Failed to generate audit.");
    }
};

