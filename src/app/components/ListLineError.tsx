import React, { MouseEvent } from 'react';
import LineError from './LineError';

export type IF = (id: number) => (e: MouseEvent<HTMLSpanElement>) => void;

interface Props {
  outputs: ResponseText[];
  activedError?: number;
  onShowDetailError: IF;
}

const ListLineError = ({ onShowDetailError, outputs, activedError }: Props) => {
  return (
    <>
      {outputs.map(opt =>
        opt.status ? (
          <>
            <LineError key={opt.id} opt={opt} activedError={activedError} onShowDetailError={onShowDetailError}>
              {/* {opt.subErrors ? (
                <ListLineError
                  onShowDetailError={onShowDetailError}
                  outputs={opt.subErrors}
                  activedError={activedError}
                />
              ) : null} */}
            </LineError>
          </>
        ) : (
          opt.text
        )
      )}
    </>
  );
};

export default ListLineError;
