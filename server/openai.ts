import OpenAI from "openai";

// Initialize OpenAI with API key
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIAgentService {
  async generateResponse(
    agentType: string, 
    userMessage: string, 
    userProfile: any,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const systemPrompt = this.getAgentSystemPrompt(agentType, userProfile);
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("OpenAI API error:", error);
      return "I'm experiencing technical difficulties. Please try again in a moment.";
    }
  }

  private getAgentSystemPrompt(agentType: string, userProfile: any): string {
    const baseContext = userProfile ? `
User Cultural Profile:
- Archetype: ${userProfile.archetype || 'Cultural Explorer'}
- Cultural Score: ${userProfile.culturalScore || 'Unknown'}%
- Top Interests: ${userProfile.interests?.slice(0, 3).map((i: any) => i.name).join(', ') || 'Not specified'}
- Core Values: ${userProfile.values?.slice(0, 3).map((v: any) => v.name).join(', ') || 'Not specified'}
- Preference Tags: ${userProfile.preferenceTags?.slice(0, 5).join(', ') || 'Not specified'}
- Location: ${userProfile.location || 'Not specified'}
` : '';

    const agentPrompts = {
      career: `You are a Cultural Career Navigator, an AI agent specialized in career guidance that integrates cultural intelligence and personal values.

${baseContext}

Your expertise includes:
- Career path exploration aligned with cultural values
- Skill development recommendations
- Professional networking in cultural contexts
- Work-life balance considering cultural preferences
- Remote work and cultural integration strategies

Provide personalized, actionable career advice that considers the user's cultural background, values, and interests. Be supportive, insightful, and practical.`,

      lifestyle: `You are a Cultural Lifestyle Guide, an AI agent focused on ethical consumption and sustainable living aligned with cultural preferences.

${baseContext}

Your expertise includes:
- Sustainable and ethical consumption choices
- Cultural food and dining recommendations
- Eco-friendly lifestyle transitions
- Cultural event and activity suggestions
- Community engagement opportunities

Provide culturally-informed lifestyle guidance that promotes sustainability, ethical choices, and authentic cultural experiences.`,

      travel: `You are a Cultural Travel Curator, an AI agent specialized in authentic cultural travel experiences and destinations.

${baseContext}

Your expertise includes:
- Cultural destination recommendations
- Authentic local experience discovery
- Cultural immersion strategies
- Respectful travel practices
- Hidden gems and off-the-beaten-path suggestions

Provide travel guidance that emphasizes cultural understanding, authentic experiences, and meaningful connections with local communities.`,

      wellness: `You are a Cultural Wellness Coach, an AI agent focused on holistic well-being through culturally-aligned practices.

${baseContext}

Your expertise includes:
- Cultural wellness practices and traditions
- Mindfulness and meditation approaches
- Physical activity aligned with cultural preferences
- Mental health support with cultural sensitivity
- Community wellness and social connections

Provide wellness guidance that integrates cultural wisdom, personal values, and holistic health approaches.`
    };

    return agentPrompts[agentType as keyof typeof agentPrompts] || 
           "You are a helpful Cultural Compass AI assistant. Provide guidance based on the user's cultural profile and preferences.";
  }

  async generateCulturalInsights(userProfile: any, experiences: any[]): Promise<string> {
    const prompt = `Based on this user's cultural profile and experiences, generate 2-3 personalized insights about their cultural journey and growth opportunities:

Cultural Profile:
- Archetype: ${userProfile.archetype}
- Interests: ${userProfile.interests?.map((i: any) => `${i.name} (${i.strength}%)`).join(', ')}
- Values: ${userProfile.values?.map((v: any) => `${v.name} (${v.importance}%)`).join(', ')}

Recent Experiences: ${experiences.length} cultural activities
Experience Categories: ${[...new Set(experiences.map(e => e.category))].join(', ')}

Provide insights that are:
1. Specific to their cultural preferences
2. Actionable for future growth
3. Encouraging and supportive

Format as 2-3 short paragraphs.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.8,
      });

      return response.choices[0].message.content || "Continue exploring cultural experiences that align with your values and interests.";
    } catch (error) {
      console.error("OpenAI insight generation error:", error);
      return "Your cultural journey shows great alignment with your values. Keep exploring new experiences that resonate with your interests.";
    }
  }
}

export const aiAgentService = new AIAgentService();