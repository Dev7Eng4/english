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
      className={`inline relative border-b-2 border-red-500 text-transparent ${
        activeError === error.id ? 'bg-red-200 z-20' : 'bg-transparent z-50'
      }`}
      onClick={handleShowDetail}
      data-mark-id={error.id}
    >
      {error.text}
    </p>
  );
};

export default LineError;
