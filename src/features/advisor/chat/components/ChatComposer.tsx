import React, { useState } from 'react';
import { TextArea } from '@/shared/ui/core/Input';
import { Button } from '@/shared/ui/core/Button';
import { Icon } from '@/shared/ui/icon';

interface ChatComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ onSend, disabled = false, placeholder = 'Nhập tin nhắn...' }) => {
  const [value, setValue] = useState('');

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
    <div className="border-t border-[var(--border)] bg-white px-6 py-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <button
            type="button"
            className="flex items-center gap-1 rounded-md border border-dashed border-[var(--border)] px-2 py-1 transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <Icon name="mdi:paperclip" size={16} />
            Đính kèm
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-md border border-dashed border-[var(--border)] px-2 py-1 transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <Icon name="mdi:calendar-account" size={16} />
            Đặt lịch hẹn
          </button>
        </div>
        <TextArea
          value={value}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoSize={{ minRows: 2, maxRows: 6 }}
          className="themed-input w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span>Nhấn Enter để gửi, Shift + Enter để xuống dòng</span>
          </div>
          <Button onClick={handleSend} disabled={disabled || value.trim().length === 0} size="md" variant="primary">
            Gửi tin nhắn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatComposer;
