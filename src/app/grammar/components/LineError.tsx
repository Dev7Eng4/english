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

  return (
    <p
      className={`inline-block error-line ${activeError === error.id ? 'bg-red-200' : ''}`}
      onClick={handleShowDetail}
      data-mark-id={error.id}
    >
      {error.text}
    </p>
  );
};

export default LineError;
