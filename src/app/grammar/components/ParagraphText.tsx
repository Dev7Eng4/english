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
  const renderEmpty = (value: string) => {
    const arrItem = value.split(' ');

    return arrItem.reduce((result: string, currValue: string, idx: number) => {
      if (idx === arrItem.length - 1) {
        return result;
      }

      return (result += '.');
    }, '');
  };

  return (
    <>
      {/* <p className='inline-block bg-transparent border-b-2 border-red-300 text-transparent'>
        This is paragraph error wtf
      </p> */}
      {/* {
        data.reduce((res: any, line: ResponseText, idx: number) => {
          const val = 
        }, [])
      } */}
      {data.map((line: ResponseText, idx: number) => {
        if (line.status === 'false')
          return (
            <LineError
              key={line.id}
              activeError={activeError}
              error={line}
              onShowErrorDetail={onShowErrorDetail}
            />
          );

        if (line.text === '\n') return <br />;

        if (line.text.trim() === '')
          return (
            <p key={line.id} className='inline bg-transparent text-transparent'>
              {renderEmpty(line.text)}
            </p>
          );

        return (
          <p key={line.id} className='inline bg-transparent text-transparent'>
            {line.text}
          </p>
        );
      })}
    </>
  );
};

export default ParagraphText;
