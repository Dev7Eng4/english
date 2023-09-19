'use client';

import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { renderToString } from 'react-dom/server';

import { fetchCheckData } from './services/api';
import ListFixError from './components/ListFixError';
import ListLineError from './components/ListLineError';
import axios from 'axios';
import LineError from './components/LineError';

export default function Home() {
  const [content, setContent] = useState('');
  const [activedError, setActivedError] = useState(-1);
  const [response, setResponse] = useState<ResponseText[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const controllerRef = useRef(new AbortController());
  const previousRef = useRef('');
  const editorRef = useRef(null);

  const handleFixError = (err: ResponseText) => {
    console.log('err', err);

    const idxFix = response.findIndex(opt => opt.id === err.id);

    if (idxFix === -1) return;

    const result = [...response];

    result.splice(idxFix, 1, {
      ...err,
      text: err.revised_sentence || '',
      status: 'true',
    });

    console.log(1, result);
    setResponse(result);
  };

  const handleShowActiveError = (id: number) => {
    console.log('in from board');
    setActivedError(id);
  };

  const handleShowActiveErrorInLine = (id: number) => () => {
    console.log('id from line');
    setActivedError(id);
  };

  const handleCheckContent = async (value: string) => {
    try {
      // const editor = document.querySelector('#editor');

      // const currentValue = editor?.textContent;

      if (!value) return;

      setIsLoading(true);

      if (controllerRef.current.signal) {
        controllerRef.current.abort();
      }

      const nController = new AbortController();

      controllerRef.current = nController;

      const res = await fetchCheckData(value, nController.signal);

      setResponse(res);
    } catch (error) {
      setIsLoading(false);
      if (axios.isCancel(error)) {
      }
      console.error('Error', error);
    }
  };

  const handleChangeEditor = (evt: ContentEditableEvent) => {
    const value = evt.target.value || '';

    const needHidden = 'border-b-red-300 border-b caret-black focus:bg-blue-200 hover:bg-blue-200';

    const newValue = value.replaceAll(needHidden, '');

    console.log('value', value);
    console.log('textContent', evt.currentTarget.textContent);
    setContent(newValue);

    debounceCheck(evt.currentTarget.textContent);
  };

  const handleOpenDetail = () => {
    console.log('detail');
  };

  const handleShowError = async () => {
    const editor = document.querySelector('#editor');

    const currentValue = editor?.textContent;

    console.log('cu', currentValue);

    if (!currentValue || !response.length) return;

    let convertedValue = currentValue;

    await Promise.resolve(
      response.forEach(opt => {
        console.log('opt', opt);
        console.log('inc', currentValue.includes(opt.text));
        if (opt.status === 'false' && currentValue.includes(opt.text)) {
          console.log('inn');
          convertedValue = convertedValue.replace(
            opt.text,
            `<span data-error-id='${opt.id}' class='border-b-2 border-b-red-500 hover:bg-red-400' onclick="handleOpenDetail()">${opt.text}</span>`
          );
          console.log('convert', convertedValue);
        }
      })
    );

    setContent(convertedValue);
  };

  const handleCheckError = () => {
    handleCheckError();
  };

  const debounceCheck = useCallback(debounce(handleCheckContent, 1000), []);

  useEffect(() => {
    if (response.length === 0) return;

    console.log('2');
    // const dataShow = renderToString(
    //   <ListLineError
    //     outputs={response}
    //     onShowDetailError={handleShowActiveErrorInLine}
    //     activedError={activedError}
    //   />
    // );

    let result = content;

    response.forEach(res => {
      if (res.status === 'false') {
        const changedText = renderToString(
          <LineError
            key={res.id}
            opt={res}
            activedError={activedError}
            onShowDetailError={handleShowActiveErrorInLine}
          ></LineError>
        );
        result = result.replace(res.text, changedText);
      }
    });

    setContent(result);
  }, [response, activedError]);

  console.log('active', activedError);

  return (
    <main className='w-screen h-screen flex bg-white'>
      <div id='editor' className='p-4 w-1/2'>
        <ContentEditable
          className={`h-full bg-white p-4 border`}
          innerRef={editorRef}
          html={content}
          disabled={false}
          placeholder='this is a line'
          onChange={handleChangeEditor}
          data-gramm={false}
          data-gramm_editor={false}
          data-enable-grammarly={false}
        />
      </div>

      <div className='flex w-1/2 h-full'>
        <div className='w-3/4 p-4'>
          <h3 className='my-2 text-black font-bold'>All suggestions</h3>

          {isLoading && (
            <button type='button' className='bg-indigo-500' disabled>
              Checking...
            </button>
          )}

          {content && !isLoading && (
            <ListFixError
              activedError={activedError}
              handleFixError={handleFixError}
              handleShowDetailError={handleShowActiveError}
              errors={response.filter(res => res.status === 'false')}
            />
          )}
        </div>

        <div className='w-1/4 p-2 bg-red-200'>Nothing in here</div>
      </div>
    </main>
  );
}
