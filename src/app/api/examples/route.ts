import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { ExamplesResponse, ApiError } from '@/types';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

if (!CLAUDE_API_KEY) {
  console.error('Missing CLAUDE_API_KEY environment variable');
}

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY ?? '',
});

const SYSTEM_PROMPT = `You are a LinkedIn post example generator. Generate three concise LinkedIn posts (max 200 characters each):

1. Professional Post: A brief, impactful post about career growth, industry insights, or leadership.
   - Focus on one key point
   - Include specific metrics or results
   - Keep it under 200 characters

2. Policy Alert Post: A short post that may trigger policy concerns.
   - Focus on one of these potential violations:
     • Content that could be considered hate speech
     • Potentially misleading claims
     • Excessive self-promotion that may be spam-like
     • Content that may be inappropriate
   - Keep it under 200 characters
   - Make it realistic but clearly questionable
   - IMPORTANT: Never generate content that targets immigrants, promotes xenophobia, or discriminates based on nationality or immigration status
   - Focus on general policy issues like misinformation or spam

3. Minor Issues Post: A brief post with common writing issues:
   - 1-2 typos or grammar errors
   - Run-on sentence
   - Unclear message
   - Keep it under 200 characters

Return the posts in this exact JSON format:
{
  "professional": "...",
  "policyAlert": "...",
  "minorIssues": "..."
}

Important: Each post MUST be under 200 characters. Shorter is better.`;

const MAX_TOKENS = 500;
const MODEL = 'claude-3-sonnet-20240229';

export async function GET(): Promise<NextResponse<ExamplesResponse | ApiError>> {
  try {
    if (!CLAUDE_API_KEY) {
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: 'Generate three example LinkedIn posts in the specified JSON format.',
        },
      ],
    });

    const textContent = message.content[0];
    const content =
      textContent?.type === 'text' ? textContent.text.trim() : '{}';

    let examples: ExamplesResponse;
    try {
      examples = JSON.parse(content) as ExamplesResponse;

      if (
        !examples.professional ||
        typeof examples.professional !== 'string' ||
        !examples.policyAlert ||
        typeof examples.policyAlert !== 'string' ||
        !examples.minorIssues ||
        typeof examples.minorIssues !== 'string'
      ) {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      console.error('Error parsing response:', content);
      return NextResponse.json(
        { error: 'Failed to parse response' },
        { status: 500 }
      );
    }

    return NextResponse.json(examples);
  } catch (error) {
    console.error('Error generating examples:', error);
    return NextResponse.json(
      { error: 'Failed to generate examples. Please try again.' },
      { status: 500 }
    );
  }
}
