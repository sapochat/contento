import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { AnalyzeRequest, AnalyzeResponse, ApiError } from '@/types';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

if (!CLAUDE_API_KEY) {
  console.error('Missing CLAUDE_API_KEY environment variable');
}

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY ?? '',
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

const MAX_TOKENS = 150;
const MODEL = 'claude-3-sonnet-20240229';

export async function POST(
  request: Request
): Promise<NextResponse<AnalyzeResponse | ApiError>> {
  try {
    if (!CLAUDE_API_KEY) {
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    const body = (await request.json()) as AnalyzeRequest;

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Review this LinkedIn post for policy compliance:\n\n${body.content}`,
        },
      ],
    });

    const textContent = message.content[0];
    const feedback =
      textContent?.type === 'text'
        ? textContent.text
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
