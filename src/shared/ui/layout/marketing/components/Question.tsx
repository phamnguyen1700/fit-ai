import React, { useState } from 'react';

export interface QuestionItem {
  id: string;
  question: string;
  answer: string;
}

export interface QuestionProps {
  items: QuestionItem[];
  className?: string;
}

export const Question: React.FC<QuestionProps> = ({ items, className = '' }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map(({ id, question, answer }) => {
        const isOpen = openItems.has(id);
        
        return (
          <div key={id} className="rounded-lg overflow-hidden">
            <button
              onClick={() => toggleItem(id)}
              className="bg-gray-100 w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-all duration-300 ease-in-out"
            >
              <span className="text-lg font-semibold text-gray-900 pr-4">
                {question}
              </span>
              <div className={`w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-6 pb-4 bg-gray-100">
                <p className="text-gray-600 leading-relaxed">{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Question;