import React, { useState } from 'react';

export interface Tab4Item {
  key: string;
  label: string;
}

export interface Tabs4Props {
  items: Tab4Item[];
  defaultActiveKey?: string;
  onChange?: (activeKey: string) => void;
  className?: string;
}

export const Tabs4: React.FC<Tabs4Props> = ({
  items,
  defaultActiveKey,
  onChange,
  className = '',
}) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || items[0]?.key || '');

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    onChange?.(key);
  };

  return (
    <div className={`flex w-full ${className}`}>
      {items.map((item, index) => (
        <button
          key={item.key}
          onClick={() => handleTabChange(item.key)}
          className={`
            flex-1 px-6 py-3 font-medium text-sm transition-all duration-200 border-none outline-none
            ${index === 0 ? 'rounded-l-lg' : ''}
            ${index === items.length - 1 ? 'rounded-r-lg' : ''}
          `}
          style={{
            backgroundColor: activeKey === item.key ? 'var(--primary)' : 'var(--bg-secondary)',
            color: activeKey === item.key ? 'var(--text-inverse)' : 'var(--text)',
          }}
          onMouseEnter={(e) => {
            if (activeKey !== item.key) {
              e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeKey !== item.key) {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs4;