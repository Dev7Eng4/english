'use client';

import CheckSvgIcon from '@/app/components/icons/CheckSvgIcon';
import React, { useState } from 'react';

const suggestionTypes = [
  {
    key: 'correct',
    label: 'Correctness',
    percentCorrect: 75,
    color: '#eb4034',
  },
  {
    key: 'clarity',
    label: 'Clarity',
    color: '#4a6ee0',
  },
  {
    key: 'engagement',
    label: 'Engagement',
    color: '#15c39a',
  },
  {
    key: 'delivery',
    label: 'Delivery',
    color: '#8f4cbf',
  },
];

const SuggestionType = () => {
  const [suggestion, setSuggestion] = useState('');

  const handleChangeSuggestion = (suggestionType: string) => () => {
    setSuggestion(suggestionType);
  };

  return (
    <div className='flex flex-col gap-y-2 text-[13px]'>
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
              className={`h-1 rounded-full bg-[${sgType.color}] w-[${
                sgType.percentCorrect ?? '100'
              }%]`}
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
