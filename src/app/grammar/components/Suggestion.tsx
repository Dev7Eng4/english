import ShieldSvgIcon from '@/app/components/icons/ShieldSvgIcon';
import React from 'react';

interface Props {
  activeError: number;
  error: ResponseText;
  onFixError: (err: ResponseText) => void;
  onShowDetailError: (id: number) => void;
}

const Suggestion = ({ activeError, error, onFixError, onShowDetailError }: Props) => {
  const isActive = activeError === error.id;

  const handleFixError = (error: ResponseText) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    onFixError(error);
  };

  const handleShowDetailError = () => {
    if (activeError === error.id) return;

    onShowDetailError(error.id);
  };

  return (
    <div
      className={`border border-gray-300 py-2 px-4 mb-2 rounded-md transition-all hover:shadow-lg ${
        isActive ? '' : 'cursor-pointer'
      }`}
      onClick={handleShowDetailError}
    >
      <p className='flex items-center gap-1 -ml-1 mb-2 text-gray-500 text-md'>
        <ShieldSvgIcon />
        {error.kind_of_error.join(', ')}
      </p>

      <span className={`text-[15px] ${isActive ? 'text-red-600 line-through' : ''}`}>
        {error.text}
      </span>
      {isActive && (
        <>
          {' '}
          <span className='text-blue-600 text-[15px]'>{error.revised_sentence}</span>
          <button
            className='block bg-blue-600 text-white px-3 py-1.5 rounded-md mt-2 mb-1'
            onClick={handleFixError(error)}
          >
            Accept
          </button>
        </>
      )}
    </div>
  );
};

export default Suggestion;
