import React, { useState } from 'react';
import { TextArea } from '@/shared/ui/core/Input';
import { Button } from '@/shared/ui/core/Button';
import { Icon } from '@/shared/ui/icon';

interface ChatComposerProps {
  onSend: (message: string) => void;
  onTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ onSend, onTyping, disabled = false, placeholder = 'Nhập tin nhắn...' }) => {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    onTyping?.();
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[var(--border)] bg-gradient-to-t from-white via-white to-slate-50/50 px-6 py-4 shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:bg-[rgba(79,70,229,0.05)] hover:text-[var(--primary)] active:scale-95"
          >
            <Icon name="mdi:paperclip" size={16} />
            <span>Đính kèm</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:bg-[rgba(79,70,229,0.05)] hover:text-[var(--primary)] active:scale-95"
          >
            <Icon name="mdi:calendar-account" size={16} />
            <span>Đặt lịch hẹn</span>
          </button>
        </div>
        <TextArea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoSize={{ minRows: 2, maxRows: 6 }}
          className="themed-input w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-all focus:border-[var(--primary)] focus:shadow-md disabled:bg-slate-50 disabled:opacity-60"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <Icon name="mdi:keyboard-outline" size={14} className="text-[var(--text-tertiary)]" />
            <span className="font-medium">Enter để gửi, Shift + Enter để xuống dòng</span>
          </div>
          <Button 
            onClick={handleSend} 
            disabled={disabled || value.trim().length === 0} 
            size="md" 
            variant="primary"
            className="shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="mdi:send" size={16} className="mr-1.5" />
            Gửi tin nhắn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatComposer;
