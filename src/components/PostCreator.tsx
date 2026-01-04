'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { ExampleButtons } from './ExampleButtons';
import { PostHeader } from './PostHeader';
import { PostFooter } from './PostFooter';
import type { ExampleType, ExamplesResponse, AnalyzeResponse } from '@/types';

const DEBOUNCE_DELAY = 1000;

export default function PostCreator() {
  const [content, setContent] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAcknowledgedFeedback, setHasAcknowledgedFeedback] = useState(false);
  const [examples, setExamples] = useState<ExamplesResponse | null>(null);
  const [isLoadingExamples, setIsLoadingExamples] = useState(false);

  const loadExamples = useCallback(async () => {
    setIsLoadingExamples(true);
    try {
      const response = await fetch('/api/examples');
      const data = (await response.json()) as ExamplesResponse | { error: string };

      if ('error' in data) {
        console.error('Error loading examples:', data.error);
        return;
      }

      if (data.professional && data.policyAlert && data.minorIssues) {
        setExamples(data);
      }
    } catch (error) {
      console.error('Error loading examples:', error);
    } finally {
      setIsLoadingExamples(false);
    }
  }, []);

  useEffect(() => {
    loadExamples();
  }, [loadExamples]);

  const analyzePost = useCallback(async (text: string) => {
    if (!text.trim()) {
      setFeedback(null);
      setHasAcknowledgedFeedback(false);
      return;
    }

    setIsAnalyzing(true);
    setHasAcknowledgedFeedback(false);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });

      const data = (await response.json()) as AnalyzeResponse | { error: string };

      if ('error' in data) {
        setFeedback('Error analyzing post. Please try again.');
        return;
      }

      setFeedback(data.feedback);

      // Auto-acknowledge if not a policy violation
      if (!data.feedback?.includes('⚠️ Policy Alert:')) {
        setHasAcknowledgedFeedback(true);
      }
    } catch {
      setFeedback('Error analyzing post. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const debouncedAnalyze = useDebounce(analyzePost, DEBOUNCE_DELAY);

  useEffect(() => {
    debouncedAnalyze(content);
  }, [content, debouncedAnalyze]);

  const handleExampleClick = useCallback(
    (type: ExampleType) => {
      const exampleContent = examples?.[type];
      if (!exampleContent) return;

      setContent(exampleContent);
      setFeedback(null);
      setHasAcknowledgedFeedback(false);
      analyzePost(exampleContent);
    },
    [examples, analyzePost]
  );

  const handlePost = useCallback(() => {
    setContent('');
    setFeedback(null);
    setHasAcknowledgedFeedback(false);
    setIsAnalyzing(false);
  }, []);

  const handleAcknowledge = useCallback(() => {
    setHasAcknowledgedFeedback(true);
  }, []);

  return (
    <div className="max-w-[600px] mx-auto w-full">
      <ExampleButtons
        examples={examples}
        isLoading={isLoadingExamples}
        onExampleClick={handleExampleClick}
        onRefresh={loadExamples}
      />

      <div className="bg-surface-primary rounded-lg shadow-card relative">
        <PostHeader />

        <div className="p-5 px-6">
          <textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[180px] border-none p-0 text-xl text-text-secondary resize-none outline-none font-inherit leading-relaxed bg-transparent"
          />
        </div>

        <PostFooter
          content={content}
          feedback={feedback}
          isAnalyzing={isAnalyzing}
          hasAcknowledgedFeedback={hasAcknowledgedFeedback}
          onPost={handlePost}
          onAcknowledge={handleAcknowledge}
        />
      </div>
    </div>
  );
}
