import React from 'react';

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
    <span className='error-line' onClick={handleShowDetail} data-mark-id={error.id}>
      {error.text}
    </span>
  );
};

export default LineError;