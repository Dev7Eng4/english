import React, { useEffect, useRef, useState } from 'react';

import ShieldSvgIcon from '@/app/components/icons/ShieldSvgIcon';

interface Props {
  activeError: number;
  error: ResponseText;
  onFixError: (err: ResponseText) => void;
  onShowDetailError: (id: number) => void;
}

const Suggestion = ({ activeError, error, onFixError, onShowDetailError }: Props) => {
  const isActive = activeError === error.id;
  const isInsert = error.kind_of_error.includes('Insert');

  const [heightOfBox, setHeightOfBox] = useState(112);

  const boxRef = useRef<HTMLDivElement>(null);
  const eleRef = useRef<HTMLDivElement>(null);

  const handleFixError = (error: ResponseText) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    onFixError(error);
  };

  const handleShowDetailError = () => {
    if (activeError === error.id) return;

    onShowDetailError(error.id);
  };

  console.log('aaaa', eleRef.current?.offsetWidth);

  useEffect(() => {
    if (!eleRef.current || !boxRef.current) return;

    const height = eleRef.current.offsetHeight;
    console.log('heigt', height);

    eleRef.current.style.display = 'none';

    setHeightOfBox(height + 90);
  }, []);

  return (
    <div
      ref={boxRef}
      className={`flex flex-col justify-center border border-gray-300 py-2 px-3 mb-2 rounded-md transition-all overflow-hidden hover:shadow-lg ${
        isActive ? '' : 'cursor-pointer'
      }`}
      style={{
        height: isActive ? `${heightOfBox}px` : '56px',
      }}
      onClick={handleShowDetailError}
    >
      <div className='flex items-center gap-2'>
        <ShieldSvgIcon />
        <div className='overflow-hidden'>
          <p className='text-[11px] text-gray-400'>{error.kind_of_error.join(', ')}</p>
          {!isActive && (
            <p className='w-full text-[12.5px] text-black mt-1 whitespace-break-spaces overflow-hidden text-ellipsis'>
              {isInsert ? error.revised_sentence : error.text}
            </p>
          )}
        </div>
      </div>

      <div ref={eleRef} id={`error-${error.id}`} className='my-2 text-[12.5px]'>
        <span className='text-red-600 whitespace-break-spaces break-words'>{error.text}</span>{' '}
        <span className='text-blue-600'>{error.revised_sentence}</span>
      </div>

      {isActive && (
        <>
          <div className='my-2 text-[12.5px]'>
            <span className='text-red-600 whitespace-break-spaces break-words'>{error.text}</span>{' '}
            <span className='text-blue-600'>{error.revised_sentence}</span>
          </div>

          <div className='flex gap-1'>
            <button
              className='block bg-blue-600 text-white text-xs px-2 py-1.5 rounded-md transition-all'
              onClick={handleFixError(error)}
            >
              Accept
            </button>
            <button
              className='block text-gray-500 text-xs px-2 py-1.5 rounded-md transition-all hover:bg-gray-200'
              onClick={handleFixError(error)}
            >
              Dismiss
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Suggestion;
