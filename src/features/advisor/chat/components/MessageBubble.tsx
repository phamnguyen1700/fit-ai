import React from 'react';
import { Icon } from '@/shared/ui/icon';
import type { ChatMessage, ExercisePlanData, MealPlanData } from '../types';
import { ExerciseMessage } from './ExerciseMessage';
import { MealMessage } from './MealMessage';

interface MessageBubbleProps {
  message: ChatMessage;
  isAdvisor: boolean;
  senderLabel: string;
}

const formatMessageTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isAdvisor, senderLabel }) => {
  const alignment = isAdvisor ? 'items-end' : 'items-start';
  const bubbleColor = isAdvisor 
    ? 'bg-primary text-white shadow-md' 
    : 'bg-gradient-to-br from-slate-100 to-slate-50 text-slate-900 border border-slate-200';
  
  // Check if message has planData (exercise or meal)
  const messageType = parseInt(message.messageType, 10);
  const hasExerciseData = messageType === 4 && message.planData && typeof message.planData === 'object' && 'Name' in message.planData;
  const hasMealData = messageType === 5 && message.planData && typeof message.planData === 'object' && 'MealType' in message.planData;
  
  return (
    <div className={`flex w-full flex-col gap-1.5 ${alignment} mb-3`}>
      <span className="text-xs font-medium text-[var(--text-tertiary)] px-1">{senderLabel}</span>
      <div className={`flex max-w-[75%] flex-col gap-2 rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md ${bubbleColor}`}>
        {/* Show title/content */}
        <span className={`whitespace-pre-wrap text-sm leading-relaxed font-medium ${isAdvisor ? 'text-white' : 'text-slate-800'}`}>
          {message.content}
        </span>
        
        {/* Show exercise details if messageType is 4 */}
        {hasExerciseData && (
          <div className="mt-2">
            <ExerciseMessage exerciseData={message.planData as ExercisePlanData} />
          </div>
        )}
        
        {/* Show meal details if messageType is 5 */}
        {hasMealData && (
          <div className="mt-2">
            <MealMessage mealData={message.planData as MealPlanData} />
          </div>
        )}
        
        {/* Show attachment if exists */}
        {message.attachmentUrl && (
          <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2">
            <a
              href={message.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
            >
              <Icon name="mdi:attachment" size={16} />
              <span>{message.attachmentName || 'Xem file đính kèm'}</span>
            </a>
          </div>
        )}
        
        <div className={`flex items-center gap-2 text-[11px] ${isAdvisor ? 'text-white/70' : 'text-slate-500'}`}>
          {isAdvisor && (
            <Icon
              name={message.isRead ? 'mdi:check-all' : 'mdi:check'}
              size={14}
              className={message.isRead ? 'text-orange-200' : 'text-white/70'}
            />
          )}
          <span className="font-medium">{formatMessageTimestamp(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
