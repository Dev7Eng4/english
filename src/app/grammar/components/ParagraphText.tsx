import React from 'react';
import LineError from './LineError';

interface Props {
  data: ResponseText[];
  activeError: number;
  onShowErrorDetail: (id: number) => void;
}

const ParagraphText = ({ data, activeError, onShowErrorDetail }: Props) => {
  console.log('data', data);
  return (
    <>
      {data.map(line =>
        line.status === 'true' ? (
          line.text === '\n' ? (
            <br />
          ) : (
            line.text
          )
        ) : (
          <LineError key={line.id} activeError={activeError} error={line} onShowErrorDetail={onShowErrorDetail} />
        )
      )}
    </>
  );
};

export default ParagraphText;
