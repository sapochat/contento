'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import debounce from 'lodash.debounce';

// Base64 encoded placeholder avatar (light gray with slightly darker user silhouette)
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiNmM2YyZWYiLz48cGF0aCBkPSJNMzYgMzZ2LTNjMC0yLjIxLTEuNzktNC00LTRIMTZjLTIuMjEgMC00IDEuNzktNCA0djMiIHN0cm9rZT0iI2Q5ZDlkOSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48Y2lyY2xlIGN4PSIyNCIgY3k9IjE4IiByPSI2IiBzdHJva2U9IiNkOWQ5ZDkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+";

export default function PostCreator() {
  const [content, setContent] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasAcknowledgedFeedback, setHasAcknowledgedFeedback] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [examples, setExamples] = useState<{
    professional: string;
    policyAlert: string;
    minorIssues: string;
  } | null>(null);
  const [isLoadingExamples, setIsLoadingExamples] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const loadExamples = async () => {
    setIsLoadingExamples(true);
    try {
      const response = await fetch('/api/examples');
      const data = await response.json();
      if (data.error) {
        console.error('Error loading examples:', data.error);
        return;
      }
      // Validate the response has all required fields
      if (data.professional && data.policyAlert && data.minorIssues) {
        setExamples(data);
      }
    } catch (error) {
      console.error('Error loading examples:', error);
    } finally {
      setIsLoadingExamples(false);
    }
  };

  useEffect(() => {
    loadExamples();
  }, []);

  const handleExampleClick = (example: 'professional' | 'policyAlert' | 'minorIssues') => {
    if (!examples || !examples[example]) return;
    
    const exampleContent = examples[example];
    if (typeof exampleContent !== 'string') return;

    setContent(exampleContent);
    setFeedback(null);
    setShowFeedback(false);
    setHasAcknowledgedFeedback(false);
    // Trigger analysis immediately for the example
    analyzePost(exampleContent);
  };

  const analyzePost = async (text: string) => {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: text }),
      });
      
      const data = await response.json();
      setFeedback(data.feedback);
      if (!data.feedback?.includes('⚠️ Policy Alert:')) {
        setHasAcknowledgedFeedback(true);
      }
    } catch (error) {
      setFeedback('Error analyzing post. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    setHasAcknowledgedFeedback(true);
  };

  const handleEditFeedback = () => {
    setShowFeedback(false);
  };

  const handlePost = () => {
    setContent('');
    setFeedback(null);
    setShowFeedback(false);
    setHasAcknowledgedFeedback(false);
    setIsAnalyzing(false);
  };

  const debouncedAnalyze = useCallback(
    debounce((text: string) => analyzePost(text), 1000),
    []
  );

  useEffect(() => {
    debouncedAnalyze(content);
    return () => {
      debouncedAnalyze.cancel();
    };
  }, [content, debouncedAnalyze]);

  const handleShowFeedback = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setShowFeedback(true);
  };

  const handleHideFeedback = () => {
    const timeout = setTimeout(() => {
      setShowFeedback(false);
    }, 300);
    setHideTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      {/* Examples Section */}
      <div style={{ 
        marginBottom: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        padding: '0 4px'
      }}>
        <span style={{ fontSize: '13px', color: '#666666' }}>Try an example:</span>
        <button 
          onClick={() => handleExampleClick('policyAlert')}
          style={{
            fontSize: '13px',
            color: '#FE6D4C',
            padding: '6px 12px',
            borderRadius: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: isLoadingExamples || !examples ? 'not-allowed' : 'pointer',
            opacity: isLoadingExamples || !examples ? 0.5 : 1,
            transition: 'background-color 0.2s'
          }}
          disabled={isLoadingExamples || !examples}
          onMouseEnter={e => {
            if (!isLoadingExamples && examples) {
              e.currentTarget.style.backgroundColor = 'rgba(254, 109, 76, 0.08)';
            }
          }}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isLoadingExamples ? 'Loading...' : 'Policy Alert'}
        </button>
        <button 
          onClick={() => handleExampleClick('minorIssues')}
          style={{
            fontSize: '13px',
            color: '#666666',
            padding: '6px 12px',
            borderRadius: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: isLoadingExamples || !examples ? 'not-allowed' : 'pointer',
            opacity: isLoadingExamples || !examples ? 0.5 : 1,
            transition: 'background-color 0.2s'
          }}
          disabled={isLoadingExamples || !examples}
          onMouseEnter={e => {
            if (!isLoadingExamples && examples) {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            }
          }}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isLoadingExamples ? 'Loading...' : 'Minor Issues'}
        </button>
        <button 
          onClick={() => handleExampleClick('professional')}
          style={{
            fontSize: '13px',
            color: '#0A66C2',
            padding: '6px 12px',
            borderRadius: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: isLoadingExamples || !examples ? 'not-allowed' : 'pointer',
            opacity: isLoadingExamples || !examples ? 0.5 : 1,
            transition: 'background-color 0.2s'
          }}
          disabled={isLoadingExamples || !examples}
          onMouseEnter={e => {
            if (!isLoadingExamples && examples) {
              e.currentTarget.style.backgroundColor = 'rgba(10, 102, 194, 0.08)';
            }
          }}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isLoadingExamples ? 'Loading...' : 'Professional Post'}
        </button>
        <button
          onClick={loadExamples}
          style={{
            padding: '6px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '16px',
            color: '#666666',
            cursor: isLoadingExamples ? 'not-allowed' : 'pointer',
            opacity: isLoadingExamples ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          disabled={isLoadingExamples}
          title="Generate new examples"
          onMouseEnter={e => {
            if (!isLoadingExamples) {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            }
          }}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg 
            className={isLoadingExamples ? 'animate-spin' : ''} 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Post Creation Box */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.12)',
        position: 'relative'
      }}>
        {/* Dark Header */}
        <div style={{ 
          backgroundColor: '#282828',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={DEFAULT_AVATAR}
              alt="Profile"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ 
                color: 'white', 
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: '1.2'
              }}>
                John Doe
              </span>
              <span style={{ 
                color: '#B1B1B1', 
                fontSize: '13px',
                fontWeight: 400
              }}>
                Post to Anyone
              </span>
            </div>
          </div>
        </div>

        {/* Post Content Area */}
        <div style={{ padding: '20px 24px' }}>
          <textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              minHeight: '180px',
              border: 'none',
              padding: '0',
              fontSize: '20px',
              color: '#333333',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: '1.5'
            }}
          />
        </div>

        {/* Footer Section */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          {/* Left side buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Emoji button */}
            <button style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#666666',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EEF3F8'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm3.5-9c.828 0 1.5-.672 1.5-1.5S16.328 8 15.5 8 14 8.672 14 9.5s.672 1.5 1.5 1.5zm-7 0c.828 0 1.5-.672 1.5-1.5S9.328 8 8.5 8 7 8.672 7 9.5 7.672 11 8.5 11zm3.5 7c2.33 0 4.32-1.45 5.12-3.5H7.38c.9 2.05 2.89 3.5 5.12 3.5z"/>
              </svg>
            </button>

            {/* Media button */}
            <button style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#666666',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EEF3F8'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Right side - Feedback icon and Post button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            {/* Analyzing Indicator or Feedback Icon */}
            {(isAnalyzing && content) ? (
              <div style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666666'
              }}>
                <svg 
                  style={{ animation: 'spin 1s linear infinite' }} 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            ) : feedback && (
              <div style={{ position: 'relative' }}>
                <button
                  onMouseEnter={handleShowFeedback}
                  onMouseLeave={handleHideFeedback}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: feedback.includes('⚠️') ? '#B24020' : '#057642',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#EEF3F8'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  title={feedback.includes('⚠️') ? 'Policy Alert - Click for details' : 'Writing Suggestions Available'}
                >
                  {feedback.includes('⚠️') ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  )}
                </button>

                {/* Feedback Popup */}
                {showFeedback && feedback && (
                  <div 
                    onMouseEnter={handleShowFeedback}
                    onMouseLeave={handleHideFeedback}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: 'calc(100% + 8px)',
                      width: '380px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.12)',
                      zIndex: 10,
                      transform: 'translateY(-50%)'
                    }}
                  >
                    <div style={{
                      padding: '12px'
                    }}>
                      {feedback && (
                        <>
                          <div style={{
                            fontSize: '13px',
                            lineHeight: '1.4',
                            color: '#333333',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '4px'
                          }}>
                            {feedback.includes('⚠️ Policy Alert:') ? (
                              // Policy Violation View
                              <>
                                <div style={{
                                  padding: '12px',
                                  color: '#1F1F1F',
                                  fontSize: '14px',
                                  lineHeight: '1.4'
                                }}>
                                  <div style={{
                                    color: '#B24020',
                                    fontWeight: 600,
                                    marginBottom: '8px',
                                    fontSize: '14px'
                                  }}>
                                    Community Policy Violation
                                  </div>
                                  {feedback.split('⚠️ Policy Alert:')[1].split('\n')[0].trim()}
                                </div>
                                <div style={{
                                  borderTop: '1px solid #E5E7EB',
                                  padding: '8px 12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#0a66c2' }}>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                  </svg>
                                  <button
                                    onClick={() => setShowSuggestion(!showSuggestion)}
                                    style={{
                                      display: 'inline',
                                      padding: '0',
                                      border: 'none',
                                      background: 'none',
                                      color: '#0a66c2',
                                      fontSize: '13px',
                                      fontWeight: 500,
                                      cursor: 'pointer',
                                      textDecoration: 'none'
                                    }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.textDecoration = 'underline';
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.textDecoration = 'none';
                                    }}
                                  >
                                    {showSuggestion ? 'Hide suggestion' : 'See suggestion'}
                                  </button>
                                </div>
                              </>
                            ) : (
                              // Regular Suggestions View
                              <>
                                <div style={{
                                  padding: '12px',
                                  color: '#1F1F1F',
                                  fontSize: '14px',
                                  lineHeight: '1.4'
                                }}>
                                  <div style={{
                                    color: '#057642',
                                    fontWeight: 600,
                                    marginBottom: '8px',
                                    fontSize: '14px'
                                  }}>
                                    Writing Suggestions
                                  </div>
                                  <div style={{
                                    fontSize: '13px',
                                    lineHeight: '1.4',
                                    backgroundColor: '#F5F9FF',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    border: '1px solid #E5E7EB'
                                  }}>
                                    {feedback.replace('Here are some suggestions to improve this post:', '').trim().split('\n').map((line, index) => {
                                      const bulletMatch = line.match(/^[•-]\s*(.+)$/);
                                      if (bulletMatch) {
                                        return (
                                          <div key={index} style={{ 
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '8px',
                                            marginTop: index > 0 ? '4px' : 0
                                          }}>
                                            <span style={{ color: '#666666' }}>•</span>
                                            <span>{bulletMatch[1]}</span>
                                          </div>
                                        );
                                      }
                                      return <p key={index} style={{ margin: index > 0 ? '4px 0 0 0' : 0 }}>{line}</p>;
                                    })}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {showSuggestion && feedback.includes('⚠️ Policy Alert:') && (
                            <div style={{
                              fontSize: '13px',
                              lineHeight: '1.4',
                              color: '#333333',
                              padding: '12px',
                              backgroundColor: '#F9FAFB',
                              borderRadius: '4px',
                              border: '1px solid #E5E7EB',
                              marginTop: '8px'
                            }}>
                              {feedback.split('\n').slice(1).join('\n').trim()}
                            </div>
                          )}

                          <div style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'flex-end',
                            marginTop: '12px'
                          }}>
                            {feedback.includes('⚠️ Policy Alert:') ? (
                              <>
                                <button
                                  onClick={handleFeedbackClose}
                                  style={{
                                    padding: '6px 16px',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(0,0,0,0.3)',
                                    backgroundColor: 'transparent',
                                    color: '#666666',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = '#EEF3F8';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.6)';
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.3)';
                                  }}
                                >
                                  Post Anyway
                                </button>
                                <button
                                  onClick={handleEditFeedback}
                                  style={{
                                    padding: '6px 16px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    backgroundColor: '#0a66c2',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                  }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = '#004182';
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '#0a66c2';
                                  }}
                                >
                                  Edit
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={handleFeedbackClose}
                                style={{
                                  padding: '6px 16px',
                                  borderRadius: '16px',
                                  border: 'none',
                                  backgroundColor: '#0a66c2',
                                  color: 'white',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.backgroundColor = '#004182';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.backgroundColor = '#0a66c2';
                                }}
                              >
                                Got it
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Post button */}
            <button
              onClick={handlePost}
              disabled={!content.trim() || (feedback?.includes('⚠️') && !hasAcknowledgedFeedback)}
              style={{
                padding: '6px 16px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: !content.trim() || (feedback?.includes('⚠️') && !hasAcknowledgedFeedback) ? '#e0e0e0' : '#0a66c2',
                color: !content.trim() || (feedback?.includes('⚠️') && !hasAcknowledgedFeedback) ? '#666666' : 'white',
                fontSize: '16px',
                fontWeight: 500,
                cursor: !content.trim() || (feedback?.includes('⚠️') && !hasAcknowledgedFeedback) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => {
                if (content.trim() && (!feedback?.includes('⚠️') || hasAcknowledgedFeedback)) {
                  e.currentTarget.style.backgroundColor = '#004182';
                }
              }}
              onMouseLeave={e => {
                if (content.trim() && (!feedback?.includes('⚠️') || hasAcknowledgedFeedback)) {
                  e.currentTarget.style.backgroundColor = '#0a66c2';
                }
              }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 