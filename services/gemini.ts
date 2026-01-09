import { IdeaResult, CaptionResult, AuditResult, CampaignResult } from "../types";

// Groq API Configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Models to try (in order of preference)
const MODELS = ["llama-3.3-70b-versatile", "llama3-70b-8192", "mixtral-8x7b-32768"];

/**
 * Make a request to the Groq API using fetch (browser-compatible)
 */
async function callGroqAPI(messages: { role: string; content: string }[], model: string): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Generate content using Groq API with model fallback
 */
async function generateWithGroq(prompt: string, specificModel?: string): Promise<string> {
  const messages = [
    {
      role: "system",
      content: "You are an expert social media strategist and content creator. Always return valid JSON when requested. Be creative, engaging, and trend-aware."
    },
    { role: "user", content: prompt }
  ];

  // If a specific model is requested (e.g. for Pro users), use it first
  const modelsToTry = specificModel ? [specificModel, ...MODELS] : MODELS;

  for (const model of modelsToTry) {
    try {
      console.log(`[Groq] Trying model: ${model}`);
      const result = await callGroqAPI(messages, model);
      console.log(`[Groq] Success with model: ${model}`);
      return result;
    } catch (error: any) {
      console.warn(`[Groq] Model ${model} failed:`, error?.message || error);
      // Continue to next model
    }
  }
  throw new Error("AI generation failed. Please check your internet connection or API key.");
}

/**
 * Parse JSON from LLM response, handling various edge cases
 */
function parseJSONResponse<T>(response: string): T {
  // Remove markdown code blocks if present
  let cleaned = response
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
  
  // Find the first { and last } to extract JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return JSON.parse(cleaned) as T;
}

/**
 * Generate viral content ideas based on topic and parameters
 */
export const generateIdeas = async (
  topic: string, 
  tone: string, 
  platform: string, 
  postType: string,
  audience?: string,
  goal?: string,
  framework: string = 'standard',
  isPro: boolean = false
): Promise<any> => {
  // Priority processing for Pro users
  const model = isPro ? 'llama-3.3-70b-versatile' : 'llama3-8b-8192';
  const audienceStr = audience ? `targeting ${audience}` : '';
  const goalStr = goal ? `with the goal of ${goal}` : '';
  const frameworkStr = framework !== 'standard' ? `using the ${framework.toUpperCase()} copywriting framework` : '';
  
  const prompt = `Generate 7 viral content ideas for ${platform} ${postType} about "${topic}" with a ${tone} tone ${audienceStr} ${goalStr} ${frameworkStr}.

You are an expert content strategist. Create ideas that are:
- Highly engaging and shareable
- Tailored specifically to ${platform}'s audience and algorithm
- Using current trends and best practices for ${postType} format
- Each idea should have a detailed blueprint with hook, body structure, and CTA

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "ideas": [
    {
      "title": "Compelling idea title that makes people want to create this content",
      "blueprint": {
        "hook": "Attention-grabbing opening (first 2-3 seconds for video or first line for text)",
        "body": "Main content structure with specific talking points or slides",
        "cta": "Clear call-to-action that drives engagement"
      },
      "viral_score": 95,
      "why_it_works": "Brief explanation of why this will perform well"
    }
  ],
  "overall_strategy": {
    "bestTime": "Specific best posting time",
    "postingTips": ["tip1", "tip2", "tip3"],
    "visualAdvice": "Visual content recommendations"
  }
}

Generate exactly 7 unique ideas with viral_score between 75-99, sorted by score descending.`;

  try {
    const result = await generateWithGroq(prompt, model);
    const parsed = parseJSONResponse<any>(result);
    
    // Sort ideas by viral score descending
    if (parsed.ideas && Array.isArray(parsed.ideas)) {
      parsed.ideas.sort((a: any, b: any) => (b.viral_score || 0) - (a.viral_score || 0));
    }
    
    return parsed;
  } catch (error) {
    console.error("Generate ideas error:", error);
    throw new Error("Failed to generate ideas. Please try again.");
  }
};

/**
 * Generate engaging captions for social media posts
 */
export const generateCaptions = async (
  topic: string, 
  tone: string, 
  platform: string, 
  postType: string,
  audience?: string,
  images: string[] = [],
  isPro: boolean = false
): Promise<CaptionResult> => {
  // Priority processing for Pro users
  const model = isPro ? 'llama-3.3-70b-versatile' : 'llama3-8b-8192';
  const imageContext = images.length > 0 ? ` The post includes ${images.length} image(s).` : '';
  const audienceStr = audience ? ` for ${audience}` : '';
  
  const prompt = `Create 7 social media captions for ${platform} ${postType} about "${topic}"${audienceStr}.${imageContext}

Tone: ${tone}

You are an expert copywriter. Create captions that are:
- Optimized for ${platform}'s algorithm
- Designed to maximize engagement (likes, comments, shares)
- Using platform-appropriate language and emoji usage

Create 7 different caption variations ranging from:
1. SHORT & PUNCHY (1-2 lines, high impact)
2. QUESTION-BASED (drives comments)
3. STORYTELLING (emotional connection)
4. VALUE-DRIVEN (educational/tips)
5. CONTROVERSIAL (bold takes)
6. PERSONAL (authentic, relatable)
7. CTA-FOCUSED (action-oriented)

Also provide 15 highly relevant hashtags (mix of popular and niche-specific).

Return ONLY valid JSON (no markdown, no extra text):
{
  "captions": ["caption 1", "caption 2", "caption 3", "caption 4", "caption 5", "caption 6", "caption 7"],
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10", "hashtag11", "hashtag12", "hashtag13", "hashtag14", "hashtag15"],
  "strategy": {
    "bestTime": "specific best posting time for this content type",
    "postingTips": ["tip 1", "tip 2", "tip 3"],
    "visualAdvice": "advice for visual content"
  }
}`;

  try {
    const result = await generateWithGroq(prompt);
    return parseJSONResponse<CaptionResult>(result);
  } catch (error) {
    console.error("Generate captions error:", error);
    throw new Error("Failed to generate captions. Please try again.");
  }
};

/**
 * Rewrite a caption to make it more viral
 */
export const rewriteViral = async (text: string, isPro: boolean = false): Promise<string> => {
  const model = isPro ? 'llama3-70b-8192' : 'llama3-8b-8192';
  
  const prompt = `You are a viral content expert. Rewrite this social media caption to be extremely viral and engaging:

"${text}"

Rules:
- Make it scroll-stopping and highly shareable
- Use conversational, authentic language
- Add appropriate emojis (not too many)
- Keep the core message but amplify the emotion
- Make it feel personal and relatable
- Use extreme viral hooks

Return ONLY the rewritten caption, nothing else.`;

  try {
    const result = await generateWithGroq(prompt, model);
    return result.trim() || text;
  } catch (e) {
    console.error("Rewrite viral error:", e);
    return text;
  }
};

/**
 * Enhance user input text to be more descriptive
 */
export const enhanceText = async (
  input: string, 
  context: 'idea' | 'caption'
): Promise<string> => {
  if (!input.trim()) return "";
  
  const prompt = `You are a creative assistant. Rewrite this input to be more descriptive and compelling for ${context} generation:

"${input}"

Rules:
- Keep it concise (max 2 sentences)
- Make it more specific and actionable
- Preserve the original intent

Return ONLY the rewritten text, no explanations.`;

  try {
    const result = await generateWithGroq(prompt);
    return result.trim() || input;
  } catch (e) {
    console.error("Enhance error", e);
    return input;
  }
};

/**
 * Generate a suggestion for the user based on context
 */
export const generateSuggestion = async (
  context: 'idea' | 'caption', 
  user: any
): Promise<string> => {
  const niche = user.niche || 'General';
  const bio = user.bio || 'Content Creator';
  const role = user.role || 'creator';
  
  let prompt = "";

  if (context === 'idea') {
    prompt = `Suggest ONE trending content topic for a ${role} in the "${niche}" niche. Bio: "${bio}". 
    
The topic should be:
- Currently trending or evergreen
- Specific and actionable
- Engaging for social media

Return ONLY the topic sentence, nothing else.`;
  } else if (context === 'caption') {
    prompt = `Write ONE short, engaging caption starter for a ${role} in the "${niche}" niche. Bio: "${bio}".

The caption should be:
- Attention-grabbing opening line
- Authentic and relatable
- Ready to be expanded

Return ONLY the text, nothing else.`;
  }

  try {
    const result = await generateWithGroq(prompt);
    return result.trim();
  } catch (e) {
    console.error("Suggestion error", e);
    return "";
  }
};
/**
 * Generate a client audit for agencies
 */
export const generateAudit = async (niche: string): Promise<AuditResult> => {
  const prompt = `Perform a comprehensive social media audit for a client in the "${niche}" industry.
  
  You are an expert agency strategist. Analyze the current landscape and provide:
  1. Competitor Analysis: What are top competitors doing well? (Max 2 sentences)
  2. Content Gaps: 3 specific opportunities mist competitors are missing.
  3. Recommended Pillars: 3 strategic content pillars to dominate this niche.

  Return ONLY valid JSON in this format:
  {
    "competitorAnalysis": "insight",
    "contentGaps": ["gap 1", "gap 2", "gap 3"],
    "recommendedPillars": ["pillar 1", "pillar 2", "pillar 3"]
  }`;

  try {
    const result = await generateWithGroq(prompt);
    return parseJSONResponse<AuditResult>(result);
  } catch (error) {
    console.error("Audit error:", error);
    throw new Error("Failed to generate audit.");
  }
};

/**
 * Generate a business campaign strategy
 */
export const generateCampaign = async (product: string, goal: string): Promise<CampaignResult> => {
  const prompt = `Create a 5-day social media campaign for "${product}" to achieve "${goal}".

  Return ONLY valid JSON in this format:
  {
    "campaignName": "Creative Campaign Title",
    "targetAudience": "Specific Audience Persona",
    "kpi": "Primary Metric to Track",
    "weeklyPlan": [
      { "day": "Day 1", "focus": "Tease", "contentIdea": "Specific content idea" },
      { "day": "Day 2", "focus": "Educate", "contentIdea": "Specific content idea" },
      { "day": "Day 3", "focus": "Offer", "contentIdea": "Specific content idea" },
      { "day": "Day 4", "focus": "Proof", "contentIdea": "Specific content idea" },
      { "day": "Day 5", "focus": "Close", "contentIdea": "Specific content idea" }
    ]
  }`;

  try {
    const result = await generateWithGroq(prompt);
    return parseJSONResponse<CampaignResult>(result);
  } catch (error) {
    console.error("Campaign error:", error);
    throw new Error("Failed to generate campaign.");
  }
};
