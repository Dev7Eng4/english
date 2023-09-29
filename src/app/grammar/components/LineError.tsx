import React, { FormEvent } from 'react';

interface Props {
  error: ResponseText;
  activeError: number;
  onShowErrorDetail: (id: number) => void;
}

const LineError = ({ error, activeError, onShowErrorDetail }: Props) => {
  const handleShowDetail = () => {
    onShowErrorDetail(error.id);
  };

  const handleInput = (e: FormEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('aa');
  };

  return (
    <span
      contentEditable
      onInput={handleInput}
      className='error-line'
      onClick={handleShowDetail}
      data-mark-id={error.id}
    >
      {error.text}
    </span>
  );
};

export default LineError;
