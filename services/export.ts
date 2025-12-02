import { CaptionResult, IdeaResult } from '../types';

export const exportToInstagram = (result: CaptionResult, topic: string): string => {
  const caption = result.captions[0]; // Use the first caption
  const hashtags = result.hashtags.join(' ');
  
  return `${caption}\n\n・・・\n\n${hashtags}\n\n📌 Topic: ${topic}\n⏰ Best time: ${result.strategy.bestTime}`;
};

export const exportAllCaptions = (result: CaptionResult): string => {
  let output = '📝 GENERATED CAPTIONS\n\n';
  
  result.captions.forEach((caption, idx) => {
    const style = idx === 0 ? 'Short & Punchy' : idx === 1 ? 'Engaging' : 'Storytelling';
    output += `━━━━━━━━━━━━━━━━━━━━\n`;
    output += `${idx + 1}. ${style}\n\n`;
    output += `${caption}\n\n`;
  });
  
  output += `━━━━━━━━━━━━━━━━━━━━\n`;
  output += `\n📌 HASHTAGS:\n${result.hashtags.join(' ')}\n\n`;
  output += `⏰ BEST TIME TO POST:\n${result.strategy.bestTime}\n\n`;
  output += `💡 POSTING TIPS:\n`;
  result.strategy.postingTips.forEach((tip, idx) => {
    output += `${idx + 1}. ${tip}\n`;
  });
  
  return output;
};

// Export Ideas as formatted text
export const exportAllIdeas = (result: IdeaResult, topic: string, platform: string): string => {
  let output = `💡 VIRAL IDEAS FOR: ${topic}\n`;
  output += `📱 Platform: ${platform}\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  output += `🎯 THE GOLDEN HOOK:\n"${result.hook}"\n\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  output += `✨ IDEAS:\n\n`;
  result.ideas.forEach((idea, idx) => {
    output += `${idx + 1}. ${idea}\n\n`;
  });
  
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  output += `⏰ BEST TIME TO POST:\n${result.strategy.bestTime}\n\n`;
  output += `💡 POSTING TIPS:\n`;
  result.strategy.postingTips.forEach((tip, idx) => {
    output += `${idx + 1}. ${tip}\n`;
  });
  
  return output;
};

// Download as file
export const downloadAsFile = (content: string, filename: string, type: 'txt' | 'json' | 'csv' | 'md') => {
  const mimeTypes = {
    txt: 'text/plain',
    json: 'application/json',
    csv: 'text/csv',
    md: 'text/markdown'
  };

  const blob = new Blob([content], { type: mimeTypes[type] });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${type}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export ideas as JSON
export const exportIdeasAsJSON = (result: IdeaResult, topic: string, platform: string): string => {
  return JSON.stringify({
    topic,
    platform,
    hook: result.hook,
    ideas: result.ideas,
    strategy: result.strategy,
    generatedAt: new Date().toISOString()
  }, null, 2);
};

// Export ideas as Markdown
export const exportIdeasAsMarkdown = (result: IdeaResult, topic: string, platform: string): string => {
  let md = `# 💡 Viral Ideas: ${topic}\n\n`;
  md += `**Platform:** ${platform}\n\n`;
  md += `---\n\n`;
  md += `## 🎯 The Golden Hook\n\n`;
  md += `> "${result.hook}"\n\n`;
  md += `---\n\n`;
  md += `## ✨ Ideas\n\n`;
  result.ideas.forEach((idea, idx) => {
    md += `### ${idx + 1}. Idea\n\n${idea}\n\n`;
  });
  md += `---\n\n`;
  md += `## 📊 Strategy\n\n`;
  md += `**Best Time to Post:** ${result.strategy.bestTime}\n\n`;
  md += `### Posting Tips:\n\n`;
  result.strategy.postingTips.forEach((tip, idx) => {
    md += `${idx + 1}. ${tip}\n`;
  });
  return md;
};

// Export captions as JSON
export const exportCaptionsAsJSON = (result: CaptionResult): string => {
  return JSON.stringify({
    captions: result.captions,
    hashtags: result.hashtags,
    strategy: result.strategy,
    generatedAt: new Date().toISOString()
  }, null, 2);
};

// Export captions as Markdown
export const exportCaptionsAsMarkdown = (result: CaptionResult): string => {
  let md = `# 📝 Generated Captions\n\n`;
  md += `---\n\n`;
  result.captions.forEach((caption, idx) => {
    const style = idx === 0 ? 'Short & Punchy' : idx === 1 ? 'Engaging' : 'Storytelling';
    md += `## ${idx + 1}. ${style}\n\n${caption}\n\n`;
  });
  md += `---\n\n`;
  md += `## 📌 Hashtags\n\n`;
  md += result.hashtags.join(' ') + '\n\n';
  md += `---\n\n`;
  md += `## 📊 Strategy\n\n`;
  md += `**Best Time to Post:** ${result.strategy.bestTime}\n\n`;
  md += `### Posting Tips:\n\n`;
  result.strategy.postingTips.forEach((tip, idx) => {
    md += `${idx + 1}. ${tip}\n`;
  });
  return md;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Failed to copy:', e);
    return false;
  }
};
