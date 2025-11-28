"use client";
import React from 'react';

export interface TabItem {
  key: string;
  label: string;
}

interface Tabs2Props {
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

export const Tabs2: React.FC<Tabs2Props> = ({
  items,
  value,
  onChange,
  className = ""
}) => {
  return (
    <div className={`flex relative ${className}`}>
      {items.map((item, index) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`
            px-6 py-3 text-sm font-semibold border-b-2 transition-all duration-300 ease-in-out relative
            ${value === item.key
              ? 'border-orange-500 bg-transparent transform scale-105'
              : 'border-transparent hover:transform hover:scale-102'
            }
            ${index === 0 ? '' : 'ml-8'}
          `}
          style={{
            transformOrigin: 'center bottom',
            color: value === item.key ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottomColor: value === item.key ? 'var(--primary)' : 'transparent'
          }}
          onMouseEnter={(e) => {
            if (value !== item.key) {
              e.currentTarget.style.color = 'var(--text)';
              e.currentTarget.style.borderBottomColor = 'var(--border-secondary)';
            }
          }}
          onMouseLeave={(e) => {
            if (value !== item.key) {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderBottomColor = 'transparent';
            }
          }}
        >
          <span className={`transition-all duration-300 ease-in-out ${
            value === item.key ? 'opacity-100' : 'opacity-80 hover:opacity-100'
          }`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Tabs2;
