import React, { useState } from 'react';

interface Props {
  content: any;
  onChange: any;
}

const Editor = ({ content, onChange }: Props) => {
  const [initialValue] = useState(content);

  console.log('ini', initialValue);

  const handleInput = (e: any) => {
    console.log('e', e.currentTarget.textContent);
    if (onChange) {
      onChange(e.currentTarget.textContent);
    }
  };

  return (
    <div
      style={{
        hyphens: 'none',
      }}
      className='w-96 h-96 border border-red-200 m-4 p-4'
      contentEditable
      onInput={handleInput}
      dangerouslySetInnerHTML={{
        __html: initialValue,
      }}
    />
  );
};

export default Editor;
