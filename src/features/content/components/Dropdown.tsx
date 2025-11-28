"use client";
import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  key: string;
  label: string;
  isActive?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  onSelect?: (option: DropdownOption) => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  options,
  onSelect,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: DropdownOption) => {
    onSelect?.(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-38 rounded-lg shadow-lg border z-80" 
             style={{ 
               backgroundColor: 'var(--bg)', 
               borderColor: 'var(--border)',
               boxShadow: '0 10px 15px var(--shadow-dark)'
             }}>
          <div className="px-2 py-2">
            {options.map((option) => (
              <button
                key={option.key}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-3 py-2 text-sm transition-all duration-200 rounded-md ${
                  option.isActive
                    ? 'font-medium' 
                    : 'font-normal'
                }`}
                style={{
                  backgroundColor: 'transparent',
                  color: option.isActive ? 'var(--primary)' : 'var(--text)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--text-inverse)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = option.isActive ? 'var(--primary)' : 'var(--text)';
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;