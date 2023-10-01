'use client';

import CheckSvgIcon from '@/app/components/icons/CheckSvgIcon';
import React, { useState } from 'react';

const suggestionTypes = [
  {
    key: 'correct',
    label: 'Correctness',
    color: '#eb4034',
  },
  {
    key: 'clarity',
    label: 'Clarity',
    color: '#8a3731',
  },
  {
    key: 'engagement',
    label: 'Engagement',
    color: '#34eb77',
  },
  {
    key: 'delivery',
    label: 'Delivery',
    color: '#eb34a5',
  },
];

const SuggestionType = () => {
  const [suggestion, setSuggestion] = useState('');

  const handleChangeSuggestion = (suggestionType: string) => () => {
    setSuggestion(suggestionType);
  };

  return (
    <div className='flex flex-col gap-y-2'>
      <div
        className={`group flex items-center justify-between p-4 rounded-md font-medium cursor-pointer border transition-all hover:bg-gray-100 ${
          suggestion ? 'border-white' : 'border-blue-600 text-blue-600'
        }`}
        onClick={handleChangeSuggestion('')}
      >
        All suggestions
      </div>

      {suggestionTypes.map(sgType => (
        <div
          key={sgType.key}
          className={`p-4 pt-2 rounded-md cursor-pointer transition-all border hover:bg-gray-100 ${
            suggestion === sgType.key ? 'border-blue-600 text-blue-600' : 'border-white'
          }`}
          onClick={handleChangeSuggestion(sgType.key)}
        >
          <span className='flex justify-between font-medium'>
            {sgType.label}
            {sgType.key !== 'correct' && <CheckSvgIcon color={sgType.color} />}
          </span>
          <div className='mt-2 w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700'>
            <div
              className={`h-1 rounded-full w-3/4 bg-[${sgType.color}]`}
              style={{
                backgroundColor: sgType.color,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionType;
