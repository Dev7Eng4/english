'use client';

import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { renderToString } from 'react-dom/server';

import { fetchCheckData } from './services/api';
import ListFixError from './components/ListFixError';
import ListLineError from './components/ListLineError';

export default function Home() {
  const [content, setContent] = useState('');
  const [isMount, setIsMount] = useState(true);
  const [activedError, setActivedError] = useState(-1);
  const [response, setResponse] = useState<ResponseText[]>([]);
  const controllerRef = useRef(new AbortController());

  const previousRef = useRef('');
  const editorRef = useRef(null);

  const handleFixError = (err: ResponseText) => {};

  const handleShowActiveError = (id: number) => {
    setActivedError(id);
  };

  const handleShowActiveErrorInLine = (id: number) => () => {
    console.log('id');
    setActivedError(id);
  };

  const handleCheckContent = async (value: string) => {
    try {
      // const editor = document.querySelector('#editor');

      // const currentValue = editor?.textContent;

      // if (!currentValue) return;

      if (controllerRef.current.signal) {
        controllerRef.current.abort();
      }

      const nController = new AbortController();

      controllerRef.current = nController;

      const res = await fetchCheckData(value, nController.signal);

      setResponse(res);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleFocusEditor = () => {
    if (isMount) {
      setContent('');
    }
  };

  const handleChangeEditor = (evt: ContentEditableEvent) => {
    const value = evt.target.value || '';
    setIsMount(false);
    setContent(value);

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
    const dataShow = renderToString(
      <ListLineError outputs={response} onShowDetailError={handleShowActiveErrorInLine} activedError={activedError} />
    );

    setContent(dataShow);
  }, [response, activedError]);

  console.log('active', activedError);

  return (
    <main className='w-screen h-screen flex bg-white'>
      <div id='editor' className='p-4 w-1/2'>
        <ContentEditable
          className={`h-full bg-white p-4 border ${isMount ? 'text-gray-400' : 'text-black'}`}
          innerRef={editorRef}
          html={content}
          disabled={false}
          onChange={handleChangeEditor}
          onFocus={handleFocusEditor}
          data-gramm={false}
          data-gramm_editor={false}
          data-enable-grammarly={false}
        />
      </div>

      <div className='flex w-1/2 h-full p-4'>
        <div className='w-3/4 pr-4'>
          <h3 className='my-2 text-black'>All suggestions</h3>

          {content ? (
            <ListFixError
              activedError={activedError}
              handleFixError={handleFixError}
              handleShowDetailError={handleShowActiveError}
              errors={response.filter(res => res.status === 'false')}
            />
          ) : (
            <h4>Nothing to check yet</h4>
          )}
        </div>

        <div className='w-1/4 bg-red-200'></div>
      </div>
    </main>
  );
}
