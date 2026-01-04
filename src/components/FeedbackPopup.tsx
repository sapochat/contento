'use client';

import { useState } from 'react';
import { InfoIcon } from './icons';

interface FeedbackPopupProps {
  feedback: string;
  onClose: () => void;
  onEdit: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function FeedbackPopup({ feedback, onClose, onEdit, onMouseEnter, onMouseLeave }: FeedbackPopupProps) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const isPolicyViolation = feedback.includes('⚠️ Policy Alert:');

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-1/2 right-[calc(100%+8px)] w-[380px] bg-surface-primary rounded-lg shadow-card z-10 -translate-y-1/2"
    >
      <div className="p-3">
        <div className="text-sm leading-relaxed text-text-secondary bg-surface-primary rounded">
          {isPolicyViolation ? (
            <PolicyViolationView
              feedback={feedback}
              showSuggestion={showSuggestion}
              onToggleSuggestion={() => setShowSuggestion(!showSuggestion)}
            />
          ) : (
            <SuggestionsView feedback={feedback} />
          )}
        </div>

        {showSuggestion && isPolicyViolation && (
          <div className="text-sm leading-relaxed text-text-secondary p-3 bg-surface-secondary rounded border border-gray-200 mt-2">
            {feedback.split('\n').slice(1).join('\n').trim()}
          </div>
        )}

        <div className="flex gap-2 justify-end mt-3">
          {isPolicyViolation ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-2xl border border-border-strong bg-transparent text-text-muted text-sm font-medium cursor-pointer transition-colors hover:bg-gray-100 hover:border-gray-500"
              >
                Post Anyway
              </button>
              <button
                onClick={onEdit}
                className="px-4 py-1.5 rounded-2xl border-none bg-linkedin-blue text-white text-sm font-medium cursor-pointer transition-colors hover:bg-linkedin-blue-hover"
              >
                Edit
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-2xl border-none bg-linkedin-blue text-white text-sm font-medium cursor-pointer transition-colors hover:bg-linkedin-blue-hover"
            >
              Got it
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface PolicyViolationViewProps {
  feedback: string;
  showSuggestion: boolean;
  onToggleSuggestion: () => void;
}

function PolicyViolationView({ feedback, showSuggestion, onToggleSuggestion }: PolicyViolationViewProps) {
  const alertMessage = feedback.split('⚠️ Policy Alert:')[1]?.split('\n')[0]?.trim() ?? '';

  return (
    <>
      <div className="p-3 text-text-primary text-sm leading-relaxed">
        <div className="text-linkedin-orange-dark font-semibold mb-2 text-sm">
          Community Policy Violation
        </div>
        {alertMessage}
      </div>
      <div className="border-t border-gray-200 py-2 px-3 flex items-center gap-1.5">
        <InfoIcon className="text-linkedin-blue" />
        <button
          onClick={onToggleSuggestion}
          className="p-0 border-none bg-transparent text-linkedin-blue text-sm font-medium cursor-pointer hover:underline"
        >
          {showSuggestion ? 'Hide suggestion' : 'See suggestion'}
        </button>
      </div>
    </>
  );
}

interface SuggestionsViewProps {
  feedback: string;
}

function SuggestionsView({ feedback }: SuggestionsViewProps) {
  const suggestions = feedback.replace('Here are some suggestions to improve this post:', '').trim();

  return (
    <div className="p-3 text-text-primary text-sm leading-relaxed">
      <div className="text-linkedin-green font-semibold mb-2 text-sm">Writing Suggestions</div>
      <div className="text-sm leading-relaxed bg-blue-50 p-3 rounded border border-gray-200">
        {suggestions.split('\n').map((line, index) => {
          const bulletMatch = line.match(/^[•-]\s*(.+)$/);
          if (bulletMatch) {
            return (
              <div key={index} className={`flex items-start gap-2 ${index > 0 ? 'mt-1' : ''}`}>
                <span className="text-text-muted">•</span>
                <span>{bulletMatch[1]}</span>
              </div>
            );
          }
          return (
            <p key={index} className={index > 0 ? 'mt-1' : ''}>
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}
