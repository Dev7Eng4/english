import React from 'react';

interface Props {
  activedError?: number;
  err: ResponseText;
  handleFixError: (val: ResponseText) => void;
  handleShowDetailError: (id: number) => void;
}

const FixError = ({ activedError, err, handleFixError, handleShowDetailError }: Props) => {
  if (!err.status) return <>{err.text}</>;

  const isActive = activedError === err.id;

  return (
    <div
      className={`card bg-white px-3 py-2 border rounded-xl my-3 ${
        isActive ? 'bg-gray-400' : 'cursor-pointer'
      }`}
      key={err.text}
      onClick={() => handleShowDetailError(err.id)}
    >
      <span className='text-gray-500 mb-2'>{err.kind_of_error[0]}</span>
      <br />
      <span className={`${isActive ? 'text-red-500 line-through' : ''}`}>{err.text}</span>
      &nbsp;
      {isActive && (
        <>
          <span className='text-blue-600'>{err.revised_sentence}</span>
          <br />
          {isActive && (
            <button
              className='h-8 bg-blue-800 text-white px-3 rounded-md mt-1'
              onClick={() => handleFixError(err)}
            >
              Correct
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FixError;
