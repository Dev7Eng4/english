'use client';

import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { mockInput, mock, mock2, errorTypes } from './data';
import FixError from '../components/FixError';
import ListFixError from '../components/ListFixError';
import ListLineError from '../components/ListLineError';
import { fetchCheckData } from '../services/api';

export const getReason = (val: number) => errorTypes.find(error => error.value === val);

const Home = () => {
  const [responseContent, setResponseContent] = useState<ResponseText[]>([]);
  const [textValue, setTextValue] = useState('');
  const [inputHtml, setInputHtml] = useState('');
  const [activedError, setActivedError] = useState<number>();
  const [isInput, setIsInput] = useState(false);

  const previousEditorHtmlRef = useRef('');
  const controllerRef = useRef(new AbortController());

  const handleDebounceSearch = async (value: string) => {
    // call api to check
    // setOutputData(mock2);
    try {
      setIsInput(false);
      if (controllerRef.current.signal) {
        controllerRef.current.abort();
      }

      const nController = new AbortController();

      controllerRef.current = nController;

      const res = await fetchCheckData(value, nController.signal);
      console.log('res', res);

      const editor = document.querySelector('#editor');

      if (editor) {
        editor.innerHTML = '';
      }
      setResponseContent(res);
    } catch (error) {
      /* show Error */
    }
  };

  const onShowDetail = (id: number) => (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setActivedError(id);
  };

  const onShowDetailError = (id: number) => {
    // const eleErrorNeedFocus = document.querySelector(`#${id}`);
    // eleErrorNeedFocus && eleErrorNeedFocus.focus();

    setActivedError(id);
  };

  const handleFixError = (val: ResponseText) => {
    if (!responseContent) return;

    const idxFix = responseContent.findIndex(opt => opt.id === val.id);

    if (idxFix === -1) return;

    const result = [...responseContent];

    // result.splice(idxFix, 1, {
    //   ...val,
    //   text: val.revised_sentence || '',
    // });

    console.log(1, result);
    setResponseContent(result);
  };

  const handleInput: React.FormEventHandler<HTMLDivElement> = e => {
    setIsInput(true);
    if (responseContent.length > 0) {
      // setResponseContent([]);
      // console.log('pre', previousEditorHtmlRef.current);
      // const editor = document.querySelector('#editor');
      // if (editor) {
      //   editor.innerHTML = previousEditorHtmlRef.current;
      // }
    }

    const value = e.currentTarget.textContent || '';

    previousEditorHtmlRef.current = e.currentTarget.innerHTML;

    setTextValue(value);
    debounceSearch(value);
  };

  const debounceSearch = useCallback(debounce(handleDebounceSearch, 2000), []);

  return (
    <div className='h-screen w-screen'>
      <div className='flex gap-3 p-4'>
        <div
          id='editor'
          className='w-1/2 h-[500px] px-2 py-3 bg-white border'
          contentEditable
          onInput={handleInput}
          data-gramm={false}
          data-gramm_editor={false}
          data-enable-grammarly={false}
          // dangerouslySetInnerHTML={{
          //   __html: inputData,
          // }}
        >
          {responseContent.length > 0 && (
            <ListLineError outputs={responseContent} onShowDetailError={onShowDetail} activedError={activedError} />
          )}
        </div>

        <div className='w-1/2 p-4'>
          <h3>Suggestion</h3>

          {responseContent && (
            <ListFixError
              errors={responseContent}
              handleFixError={handleFixError}
              handleShowDetailError={onShowDetailError}
              activedError={activedError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
