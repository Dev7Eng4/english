import React, { useReducer, useRef } from 'react';

interface IState {
  isLoading: boolean;
  error: any;
  data: any;
}

interface IAction {
  type: 'PENDING' | 'FULFILLED' | 'REJECTED';
  payload?: any;
}

const initialState: IState = {
  isLoading: false,
  error: undefined,
  data: undefined,
};

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case 'PENDING':
      return {
        ...state,
        isLoading: true,
      };
    case 'FULFILLED':
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };

    case 'REJECTED':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return initialState;
  }
};

interface IParams {
  [key: string]: unknown;
}

interface Props<T> {
  mutationFn: (params?: IParams) => Promise<T>;
}

const useMutation = <T>({ mutationFn }: Props<T>) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const controllerRef = useRef(new AbortController());

  const mutate = async (params?: IParams) => {
    try {
      if (controllerRef.current.signal) {
        controllerRef.current.abort();
      }

      dispatch({
        type: 'PENDING',
      });

      const abortController = new AbortController();
      controllerRef.current = abortController;

      const res = await mutationFn(params);

      dispatch({
        type: 'FULFILLED',
        payload: res,
      });
    } catch (error) {
      dispatch({
        type: 'REJECTED',
        payload: error,
      });
      console.error('Error: ', error);
    }
  };

  return { ...state, mutate };
};

export default useMutation;
