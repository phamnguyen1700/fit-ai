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
            ${activeKey === item.key 
              ? 'bg-primary text-white dark:text-white' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs4;