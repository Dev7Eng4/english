import React, { useState } from 'react';
import LineError from './LineError';

interface Props {
  data: ResponseText[];
  activeError: number;
  onShowErrorDetail: (id: number) => void;
}

//  (
//           line.text === '\n' ? (
//             <p className='initial'>
//               <br />
//             </p>
//           ) :

const ParagraphText = ({ data, activeError, onShowErrorDetail }: Props) => {
  const [pos, setPos] = useState(0);
  console.log('data', data);
  return (
    <>
      {/* {
        data.reduce((res: any, line: ResponseText, idx: number) => {
          const val = 
        }, [])
      } */}

      {data.map((line: ResponseText, idx: number) => {
        const isBreakNext = data[idx + 1]?.text?.includes('\n');

        return line.status === 'true' ? (
          <p className='inline-block'>
            {line.text}
            {isBreakNext && <br />}
          </p>
        ) : (
          <LineError key={line.id} activeError={activeError} error={line} onShowErrorDetail={onShowErrorDetail} />
        );
      })}
    </>
  );
};

export default ParagraphText;
