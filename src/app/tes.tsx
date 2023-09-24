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

const needHidden = 'border-b-red-300 border-b caret-black focus:bg-blue-200 hover:bg-blue-200';

export default function Home() {
  const [content, setContent] = useState('');
  const [activedError, setActivedError] = useState(-1);
  const [response, setResponse] = useState<ResponseText[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState('');

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
      status: 'true',
    });

    console.log(1, result);
    setAction('F');
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

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (axios.isCancel(error)) {
      }
      console.error('Error', error);
    }
  };

  const handleChangeEditor = (evt: ContentEditableEvent) => {
    const value = evt.target.value || '';

    const newValue = value.replaceAll(`<span class="${needHidden}">`, '');
    const nValue = newValue.replaceAll('</span>', '');

    setContent(nValue);

    debounceCheck(evt.currentTarget.textContent);
  };

  const handleCheckError = () => {
    handleCheckError();
  };

  const debounceCheck = useCallback(debounce(handleCheckContent, 1000), []);

  useEffect(() => {
    if (response.length === 0) return;

    let result = content;

    console.log('content', result);

    response.forEach(res => {
      if (res.status === 'true' && res.revised_sentence) {
        const c = `<span class="${needHidden}">${res.text}</span>`;
        result = result.replace(c, res.revised_sentence);
      }
      if (res.status === 'false' && action !== 'F') {
        const changedText = renderToString(
          <LineError key={res.id} opt={res} activedError={activedError} onShowDetailError={handleShowActiveErrorInLine}></LineError>
        );
        result = result.replace(res.text, changedText);
      }
    });

    setAction('');
    setContent(result);
  }, [response]);

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
