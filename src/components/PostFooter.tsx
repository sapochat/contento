'use client';

import { useRef, useState, useCallback } from 'react';
import { EmojiIcon, MediaIcon, SpinnerIcon, WarningIcon, EditIcon } from './icons';
import { FeedbackPopup } from './FeedbackPopup';

interface PostFooterProps {
  content: string;
  feedback: string | null;
  isAnalyzing: boolean;
  hasAcknowledgedFeedback: boolean;
  onPost: () => void;
  onAcknowledge: () => void;
}

export function PostFooter({
  content,
  feedback,
  isAnalyzing,
  hasAcknowledgedFeedback,
  onPost,
  onAcknowledge,
}: PostFooterProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleShowFeedback = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowFeedback(true);
  }, []);

  const handleHideFeedback = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowFeedback(false);
    }, 300);
  }, []);

  const handleFeedbackClose = useCallback(() => {
    setShowFeedback(false);
    onAcknowledge();
  }, [onAcknowledge]);

  const handleEditFeedback = useCallback(() => {
    setShowFeedback(false);
  }, []);

  const isPolicyViolation = feedback?.includes('⚠️') ?? false;
  const isPostDisabled = !content.trim() || (isPolicyViolation && !hasAcknowledgedFeedback);

  return (
    <div className="py-3 px-6 border-t border-border flex items-center justify-between bg-surface-primary">
      {/* Left side buttons */}
      <div className="flex items-center gap-4">
        <IconButton icon={<EmojiIcon />} title="Add emoji" />
        <IconButton icon={<MediaIcon />} title="Add media" />
      </div>

      {/* Right side - Feedback icon and Post button */}
      <div className="flex items-center gap-3 relative">
        {isAnalyzing && content ? (
          <div className="w-9 h-9 flex items-center justify-center text-text-muted">
            <SpinnerIcon className="animate-spin" />
          </div>
        ) : feedback ? (
          <div className="relative">
            <button
              onMouseEnter={handleShowFeedback}
              onMouseLeave={handleHideFeedback}
              className={`w-9 h-9 flex items-center justify-center rounded-full border-none bg-transparent cursor-pointer transition-colors hover:bg-gray-100 ${
                isPolicyViolation ? 'text-linkedin-orange-dark' : 'text-linkedin-green'
              }`}
              title={isPolicyViolation ? 'Policy Alert - Click for details' : 'Writing Suggestions Available'}
            >
              {isPolicyViolation ? <WarningIcon /> : <EditIcon />}
            </button>

            {showFeedback && (
              <FeedbackPopup
                feedback={feedback}
                onClose={handleFeedbackClose}
                onEdit={handleEditFeedback}
                onMouseEnter={handleShowFeedback}
                onMouseLeave={handleHideFeedback}
              />
            )}
          </div>
        ) : null}

        {/* Post button */}
        <button
          onClick={onPost}
          disabled={isPostDisabled}
          className={`px-4 py-1.5 rounded-2xl border-none text-base font-medium transition-colors ${
            isPostDisabled
              ? 'bg-gray-200 text-text-muted cursor-not-allowed'
              : 'bg-linkedin-blue text-white cursor-pointer hover:bg-linkedin-blue-hover'
          }`}
        >
          Post
        </button>
      </div>
    </div>
  );
}

interface IconButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

function IconButton({ icon, title, onClick }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 flex items-center justify-center rounded-full border-none bg-transparent text-text-muted cursor-pointer transition-colors hover:bg-gray-100"
    >
      {icon}
    </button>
  );
}
