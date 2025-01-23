import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
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

export async function GET() {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: 'Generate three example LinkedIn posts in the specified JSON format.'
      }],
    });

    // Parse the JSON response
    const content = message.content[0]?.type === 'text' 
      ? message.content[0].text.trim()
      : '{}';
    
    let examples;
    try {
      examples = JSON.parse(content);
      
      // Validate the response has all required fields and they're strings
      if (!examples.professional || typeof examples.professional !== 'string' ||
          !examples.policyAlert || typeof examples.policyAlert !== 'string' ||
          !examples.minorIssues || typeof examples.minorIssues !== 'string') {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      console.error('Error parsing response:', content);
      throw new Error('Failed to parse response');
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