'use client';

import React, { useState, useRef } from 'react';
import './style.css';

const ContentEditable = props => {
  const [initialValue] = useState(props.value);

  const handleInput = event => {
    if (props.onChange) {
      props.onChange(event.target.innerHTML);
    }
  };

  return (
    <span
      className='w-40 h-40 p-3 border-red-100'
      contentEditable
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: initialValue }}
    />
  );
};

const ContentEditableWithRef = props => {
  const defaultValue = useRef(props.value);

  const handleInput = event => {
    if (props.onChange) {
      props.onChange(event.target.innerHTML);
    }
  };

  return (
    <span
      className='w-40 h-40 p-3 border-blue-50'
      contentEditable
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: defaultValue.current }}
    />
  );
};

export default function App() {
  const [name, setName] = useState('');
  const [nameFromRef, setNameFromRef] = useState('');

  return (
    <div className='container'>
      <div className='box'>
        <ContentEditable value={name} onChange={setName} />
        <div>
          User input:
          <span dangerouslySetInnerHTML={{ __html: name }} />
        </div>
      </div>
      <div className='box'>
        <ContentEditableWithRef value={nameFromRef} onChange={setNameFromRef} />
        <div>
          User input with ref:
          <span dangerouslySetInnerHTML={{ __html: nameFromRef }} />
        </div>
      </div>
    </div>
  );
}
