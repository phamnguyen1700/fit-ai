import React, { useState } from 'react';

export interface Tab3Item {
  key: string;
  label: string;
  discount?: string;
}

export interface Tabs3Props {
  items: Tab3Item[];
  defaultActiveKey?: string;
  onChange?: (activeKey: string) => void;
  className?: string;
}

export const Tabs3: React.FC<Tabs3Props> = ({
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
    <div className={`flex justify-center space-x-1 ${className}`}>
      <div className="inline-flex bg-gray-200 rounded-full p-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => handleTabChange(item.key)}
            className={`
              px-6 py-3 rounded-full font-medium transition-all duration-200 relative
              ${
                activeKey === item.key
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-transparent text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {item.label}
            {item.discount && (
              <span
                className={`ml-1 ${
                  activeKey === item.key ? 'text-white' : 'text-orange-500'
                }`}
              >
                {item.discount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs3;