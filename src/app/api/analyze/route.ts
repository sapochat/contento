import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
});

const SYSTEM_PROMPT = `You are Contento, a specialized AI for LinkedIn post compliance and improvement suggestions.

Review posts and respond in one of two ways:

1. IF SERIOUS POLICY CONCERNS FOUND (hate speech, harmful misinformation, harassment, inappropriate content):
"⚠️ Policy Alert: This content may violate [policy type] guidelines and may result in an account strike."

[blank line]
[One sentence suggestion for improvement without bullet points or lists]
[blank line]

2. FOR ALL OTHER POSTS: 
Provide 2-3 brief, actionable bullet points to enhance:
- Clarity
- Impact
- Engagement

Important guidelines:
- Only raise policy concerns for clear issues, using hedging language ("may", "could", "potentially")
- Never analyze content through the lens of immigration status or nationality
- Focus on general policy violations like misinformation, spam, or inappropriate content
- Keep all suggestions brief, specific, and actionable
- For non-policy-violation posts, skip any preamble and go straight to bullet points
- Format suggestions with bullet points (•) at the start of each line
- For policy violations, provide exactly one sentence suggestion without any bullet points or lists
- Always include a blank line between policy alert and suggestion`;

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Review this LinkedIn post for policy compliance:\n\n${content}`
      }],
    });

    // Access the content safely
    const feedback = message.content[0]?.type === 'text' 
      ? message.content[0].text 
      : 'Unable to generate feedback';

    return NextResponse.json({ feedback });

  } catch (error) {
    console.error('Error analyzing post:', error);
    return NextResponse.json(
      { error: 'Failed to analyze post' },
      { status: 500 }
    );
  }
} 