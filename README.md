# Contento

A modern, real-time content policy assistant built with Next.js and Claude 3. Contento helps content creators ensure their LinkedIn posts align with community guidelines while maintaining professional standards.

Did I streamline this? Absolutely not, do I know what I'm doing? Not really but it works. This version contains a key for my own Claude instance for the purposes of this demo so consider it an investment. It'll eventually hit its cap. You can replace/create the key in the .env, instructions below.

## Features

### Real-time Content Analysis
- Instant feedback as you type (debounced for performance)
- Clear distinction between policy violations and style suggestions
- Non-intrusive UI with hover-based feedback
- Smart analysis using Claude 3 Sonnet

### Policy Compliance
- Proactive detection of potential policy violations
- Clear warnings with specific guideline references
- Constructive suggestions for improvement
- Focus on maintaining professional standards

### Writing Enhancement
- Actionable suggestions for clarity and impact
- Professional tone recommendations
- Engagement optimization tips
- Bullet-pointed, concise feedback

### Interactive Examples
- Pre-generated example posts
- Demonstrates different content scenarios
- Real-time analysis of examples
- One-click content population

## Tech Stack

### Core Technologies
- **Next.js 14**: App Router, Server Components, API Routes
- **TypeScript**: Full type safety and enhanced developer experience
- **Anthropic Claude 3**: State-of-the-art AI for content analysis
- **React**: Modern hooks and state management

### Key Dependencies
```json
{
  "dependencies": {
    "next": "14.1.0",
    "react": "^18",
    "react-dom": "^18",
    "@anthropic-ai/sdk": "^0.18.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/lodash": "^4.14.202"
  }
}
```

## Getting Started

### Prerequisites
- Node.js 18.17.0 or later
- npm or yarn
- An Anthropic API key for Claude

### Installation
1. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

2. Create a \`.env.local\` file in the root directory:
\`\`\`env
CLAUDE_API_KEY=your-api-key-here
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

### Component Structure
\`\`\`
src/
├── app/
│   ├── api/
│   │   ├── analyze/     # Post analysis endpoint
│   │   └── examples/    # Example generation endpoint
│   ├── layout.tsx      # Root layout with metadata
│   └── page.tsx        # Main application page
├── components/
│   └── PostCreator.tsx # Core post creation component
\`\`\`

### API Endpoints

#### POST /api/analyze
Analyzes post content for policy compliance and provides writing suggestions.
- Input: Post content
- Output: Feedback with policy alerts or improvement suggestions
- Uses Claude 3 Sonnet for analysis
- 150 token limit for concise responses

#### GET /api/examples
Generates example posts showcasing different content types.
- Output: Three example posts (professional, policy alert, minor issues)
- Uses Claude 3 Sonnet for generation
- 500 token limit for comprehensive examples

## Design Decisions

### Why Next.js?
- **App Router**: Modern routing with built-in layouts
- **API Routes**: Serverless functions for AI integration
- **Server Components**: Optimal performance and SEO
- **TypeScript Support**: Robust type safety out of the box

### Why Claude 3?
- **Advanced Understanding**: Better grasp of context and nuance
- **Consistent Output**: Reliable, well-structured responses
- **Low Latency**: Quick response times for real-time analysis
- **Nuanced Feedback**: Balanced between helpful and cautious

### UI/UX Choices
- **Minimal Interface**: Focus on content creation
- **Hover-based Feedback**: Non-intrusive yet accessible
- **LinkedIn-inspired Design**: Familiar to target users
- **Real-time Analysis**: Immediate but debounced feedback