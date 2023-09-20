import React from 'react';
import { IF } from './ListLineError';

interface Props {
  opt: ResponseText;
  activedError?: number;
  onShowDetailError: IF;
  children?: React.ReactNode;
}

const LineError = ({ opt, activedError, children, onShowDetailError }: Props) => {
  return (
    <span
      className={`border-b-red-300 border-b caret-black focus:bg-blue-200 hover:bg-blue-200`}
      key={opt.id}
      onClick={onShowDetailError(opt.id)}
      // autoFocus={opt.id === 1}
    >
      {children ? children : opt.text}
    </span>
  );
};

export default LineError;
