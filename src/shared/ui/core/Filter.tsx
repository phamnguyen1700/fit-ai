import React from 'react';
import { Select } from './Select';
import { Flex } from './Flex';
import { Button } from './Button';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterItem {
  label: string;
  placeholder?: string;
  options: FilterOption[];
  value?: string;
  onChange?: (value: string) => void;
}

interface FilterProps {
  filters: FilterItem[];
  onRefresh?: () => void;
  className?: string;
}

export const Filter: React.FC<FilterProps> = ({ 
  filters, 
  onRefresh,
  className = '' 
}) => {
  return (
    <Flex 
      align="center" 
      gap={16}
      className={`filter-container ${className}`}
      style={{
        padding: '16px',
        backgroundColor: 'var(--background-color, #fff)',
        borderRadius: '8px',
      }}
    >
      {filters.map((filter, index) => (
        <div key={index} style={{ minWidth: '200px' }}>
          <Select
            placeholder={filter.placeholder || filter.label}
            value={filter.value}
            onChange={filter.onChange}
            options={filter.options}
            style={{ width: '100%' }}
          />
        </div>
      ))}
      
      {onRefresh && (
        <Button
          onClick={onRefresh}
          icon={
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C12.0711 2.5 13.9461 3.38214 15.2782 4.80357M15 2.5V6.5H11" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          }
          variant="secondary"
          style={{
            minWidth: '40px',
            height: '40px',
            padding: '8px',
          }}
        >
          {null}
        </Button>
      )}
    </Flex>
  );
};

export default Filter;
