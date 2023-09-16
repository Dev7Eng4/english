import React from 'react';
import FixError from './FixError';

interface Props {
  errors: ResponseText[];
  activedError?: number;
  handleFixError: (val: ResponseText) => void;
  handleShowDetailError: (id: number) => void;
}

const ListFixError = ({ errors, activedError, handleFixError, handleShowDetailError }: Props) => {
  return (
    <>
      {errors.map(err =>
        err.status ? (
          <>
            <FixError
              key={err.id}
              err={err}
              activedError={activedError}
              handleFixError={handleFixError}
              handleShowDetailError={handleShowDetailError}
            />
            {/* {opt.subErrors && (
              <ListFixError
                key={opt.id}
                outputs={opt.subErrors}
                activedError={activedError}
                handleFixError={handleFixError}
                onShowDetailError={onShowDetailError}
              />
            )} */}
          </>
        ) : null
      )}
    </>
  );
};

export default ListFixError;
