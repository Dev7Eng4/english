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
    <div className={`border border-gray-300 py-2 px-4 mb-2 rounded-md ${isActive ? '' : 'cursor-pointer'}`} onClick={handleShowDetailError}>
      <p className='text-gray-500 text-lg'>{error.kind_of_error.join(', ')}</p>

      <span className={`${isActive ? 'text-red-500 line-through' : ''}`}>{error.text}</span>
      {isActive && (
        <>
          {' '}
          <span className='text-blue-600'>{error.revised_sentence}</span>
          <button className='block bg-blue-800 text-white px-3 py-1.5 rounded-md mt-2 mb-1' onClick={handleFixError(error)}>
            Correct
          </button>
        </>
      )}
    </div>
  );
};

export default Suggestion;
