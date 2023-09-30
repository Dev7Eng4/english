'use client';

import React, { useState } from 'react';

interface Props {
  label?: string;
}

const Switch = ({ label }: Props) => {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(prev => !prev);
  };

  return (
    <span className='w-10 h-5 bg-gray-300 rounded-full shadow' onClick={handleToggle}>
      <span className={`inline-block w-4 h-4 ml-1 bg-white rounded-full transition-all ${checked ? '' : ''}`}></span>
    </span>
  );
};

export default Switch;
