import React, { useState, useRef, useEffect } from 'react';

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
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeIndex = items.findIndex(item => item.key === activeKey);
    const activeTab = tabsRef.current[activeIndex];
    
    if (activeTab && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      
      setIndicatorStyle({
        width: tabRect.width,
        left: tabRect.left - containerRect.left - 4, // Subtract padding
      });
    }
  }, [activeKey, items]);

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    onChange?.(key);
  };

  return (
    <div className={`flex justify-center space-x-1 ${className}`}>
      <div 
        ref={containerRef}
        className="inline-flex bg-gray-200 rounded-xl p-1 relative h-13"
        style={{ backgroundColor: '#E7E7E7' }}
      >
        {/* Sliding indicator */}
        <div
          className="absolute top-1 bg-white rounded-xl transition-all duration-300 ease-in-out z-0 shadow-sm"
          style={{
            width: `${indicatorStyle.width}px`,
            height: 'calc(100% - 8px)',
            transform: `translateX(${indicatorStyle.left}px)`,
          }}
        />
        
        {items.map((item, index) => (
          <button
            key={item.key}
            ref={(el) => { tabsRef.current[index] = el; }}
            onClick={() => handleTabChange(item.key)}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all duration-300 relative z-10
              ${
                activeKey === item.key
                  ? 'text-gray-900'
                  : 'bg-transparent text-gray-500 hover:text-gray-700'
              }
            `}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item.label}
            {item.discount && (
              <span
                className={`ml-1 transition-colors duration-300 ${
                  activeKey === item.key ? 'text-gray-900' : 'text-orange-500'
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