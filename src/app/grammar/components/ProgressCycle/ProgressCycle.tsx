import React from 'react';
import './ProgressCycle.scss';

const ProgressCycle = () => {
  return (
    <div className=''>
      <svg viewBox='0 0 36 36' className='block my-3 mx-auto stroke-blue-500'>
        <path
          className='circle-bg'
          fill='none'
          strokeWidth={2.8}
          strokeLinecap='round'
          d='M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831'
        />
        <path
          stroke='#ff9f00'
          stroke-dasharray='30, 100'
          d='M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831'
        />
        <text x='18' y='20.35' className='percentage'>
          30%
        </text>
      </svg>
    </div>
  );
};

export default ProgressCycle;
