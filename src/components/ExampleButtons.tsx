'use client';

import { RefreshIcon } from './icons';
import type { ExampleType, ExamplesResponse } from '@/types';

interface ExampleButtonsProps {
  examples: ExamplesResponse | null;
  isLoading: boolean;
  onExampleClick: (type: ExampleType) => void;
  onRefresh: () => void;
}

const EXAMPLE_CONFIGS = [
  { type: 'policyAlert' as ExampleType, label: 'Policy Alert', colorClass: 'text-linkedin-orange hover:bg-linkedin-orange/10' },
  { type: 'minorIssues' as ExampleType, label: 'Minor Issues', colorClass: 'text-text-muted hover:bg-black/5' },
  { type: 'professional' as ExampleType, label: 'Professional Post', colorClass: 'text-linkedin-blue hover:bg-linkedin-blue/10' },
] as const;

export function ExampleButtons({ examples, isLoading, onExampleClick, onRefresh }: ExampleButtonsProps) {
  const isDisabled = isLoading || !examples;

  return (
    <div className="mb-4 flex items-center gap-2 px-1">
      <span className="text-sm text-text-muted">Try an example:</span>

      {EXAMPLE_CONFIGS.map(({ type, label, colorClass }) => (
        <button
          key={type}
          onClick={() => onExampleClick(type)}
          disabled={isDisabled}
          className={`text-sm px-3 py-1.5 rounded-2xl bg-transparent border-none cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${colorClass}`}
        >
          {isLoading ? 'Loading...' : label}
        </button>
      ))}

      <button
        onClick={onRefresh}
        disabled={isLoading}
        title="Generate new examples"
        className="p-1.5 bg-transparent border-none rounded-2xl text-text-muted cursor-pointer transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
      >
        <RefreshIcon className={isLoading ? 'animate-spin' : ''} />
      </button>
    </div>
  );
}
