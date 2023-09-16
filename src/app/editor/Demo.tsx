import React from 'react';
import './demo.css';

const Demo = () => {
  return (
    <div
      id='testtt'
      className='text-red-400 hover:bg-blue-300'
      onClick={() => {
        console.log('2222 DEMO');
      }}
    >
      Demo hihih
    </div>
  );
};

export default Demo;
