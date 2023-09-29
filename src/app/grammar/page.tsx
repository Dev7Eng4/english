'use client';

import axios from 'axios';
import { debounce } from 'lodash';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { renderToString } from 'react-dom/server';

import loadingIcon from '@/app/assets/loading.svg';
import notificationIcon from '@/app/assets/notification.png';
import correctIcon from '@/app/assets/correct.png';

import { fetchCheckData } from '../services/api';
import ParagraphText from './components/ParagraphText';
import Suggestion from './components/Suggestion';

const Grammar = () => {
  const [content, setContent] = useState('');
  const [activeError, setActiveError] = useState(-1);
  const [checkedData, setCheckedData] = useState<ResponseText[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const previousRef = useRef('');
  const editorRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef(new AbortController());
  const cursorRef = useRef(null);

  const isExistsError = useMemo(() => {
    return checkedData.length > 0 && checkedData.findIndex(data => data.status === 'false') === -1;
  }, [checkedData]);

  const handleAdd = useCallback(() => {
    const errorLines = document.querySelectorAll('.error-line');
    // console.log('add', errorLines);

    if (errorLines.length === 0) return;

    errorLines.forEach(line => {
      const id = line.getAttribute('data-mark-id');

      if (line.classList.contains('bg-red-300') && activeError !== Number(id)) {
        line.classList.remove('bg-red-300');
      }

      if (activeError === Number(id)) {
        line.classList.add('bg-red-300');
      }

      line.addEventListener('click', () => {
        setActiveError(Number(id));
      });
    });
  }, [activeError]);

  const handleFixError = (error: ResponseText) => {
    const fixedError = checkedData.find(data => data.id === error.id);

    // console.log('error', fixedError);
    if (!fixedError) return;

    const fixedData = checkedData.map(data =>
      data.id === error.id
        ? {
            ...error,
            status: 'true',
            text: error.revised_sentence,
          }
        : data
    );
    // console.log('conte', fixedData);

    const nContent = renderToString(
      <ParagraphText
        activeError={activeError}
        data={fixedData}
        onShowErrorDetail={handleShowDetailError}
      />
    );

    setContent(nContent.replaceAll('<br/>', '<br>'));
    setCheckedData(fixedData);
    setActiveError(-1);
  };

  const handleShowDetailError = (id: number) => {
    setActiveError(id);
  };

  const handleRemoveBreak = (value: string) => {
    // console.log('line', value);

    const length = value.length;

    // console.log('length', length);

    if (length <= 2) return value;

    return value.slice(0, Math.ceil(length / 2));
  };

  const handleConvertText = (value: string) => {
    // this is first line\n\n\nthis is second line\n\n\n\n\nthis is third line

    // this is first linethis is first linethis is second line\n\n\nthis is third line\n\n\n\n\n

    const breakRegex = /[\n]+/;
    const notBreakRegex = /[^\n]+/;

    const breakLines = value.split(notBreakRegex);
    const breakTexts = value.split(breakRegex);

    // ['', '\n\n\n', '\n\n\n\n\n', ''];
    // ['this is first line', 'this is second line', 'this is third line'];

    // ['\n\n', '\n\n\n', ''];
    // ['', 'this is', 'this'];

    // console.log('lines', breakLines);
    // console.log('breaks', breakTexts);

    const isStartWithBreak = value.startsWith('\n');

    let result = '';

    breakLines.forEach((line, idx) => {
      result += `${handleRemoveBreak(line)}${breakTexts[isStartWithBreak ? idx + 1 : idx] ?? ''}`;
    });

    return result;
  };

  const handleCheckContent = async (value: string) => {
    try {
      if (!value) return;

      setIsLoading(true);

      if (controllerRef.current.signal) {
        controllerRef.current.abort();
      }

      // console.log('content inside', value.includes('\n'));

      const controller = new AbortController();

      controllerRef.current = controller;

      const res = await fetchCheckData(value, controller.signal);

      const nContent = renderToString(
        <ParagraphText
          activeError={activeError}
          data={res}
          onShowErrorDetail={handleShowDetailError}
        />
      );

      console.log('conttt', nContent);

      setContent(nContent.replaceAll('<br/>', '<br>'));
      // console.log('ref', res);
      setIsLoading(false);
      setCheckedData(res);
    } catch (error) {
      setIsLoading(false);
      if (axios.isCancel(error)) {
      }
    }
  };

  const handleChangeEditor = (evt: ContentEditableEvent) => {
    console.log('change');
    // console.log('text', evt.currentTarget.textContent);
    // if (editorRef.current) {
    //   const eles = editorRef.current?.querySelectorAll('div');
    //   console.log('b', editorRef.current.innerText);

    //   eles.forEach(ele => {
    //     const eleValue = ele.textContent;
    //     console.log('ele', eleValue);
    //   });
    // }

    const textValue = evt.currentTarget.innerText as string;

    console.log('chang 1', textValue);

    if (textValue === previousRef.current) return;
    console.log('chang 2', previousRef.current);

    // console.log('change', textValue);
    // console.log('contttttt', evt.target.value);

    previousRef.current = handleConvertText(textValue);

    if (evt.target.value === content) return;
    console.log('chang 3', evt.target.value);
    console.log('change 4', content);
    controllerRef.current.abort();

    const ele = document.querySelector('#editor');

    if (checkedData.length > 0) {
      // setContent(evt.target.value.replaceAll('error-line', ''));
      setContent(textValue);
      setCheckedData([]);
    } else {
      setContent(evt.target.value);
    }

    // setContent(evt.target.value || '');
    debounceCheck(handleConvertText(textValue));
    // debounceCheck(textValue);
  };

  const handleKeyDown = () => {
    setContent(editorRef.current?.innerHTML || '');
    console.log('down', editorRef.current?.innerText);
  };

  const handleInputEditor = (evt: FormEvent<HTMLDivElement>) => {
    console.log('innn', evt);
    console.log('input', evt.currentTarget.textContent);
  };

  const handleToggleShowLineError = (e: ChangeEvent<HTMLInputElement>) => {
    const isCheck = e.target.checked;
    // console.log('aa', editorRef.current.);

    if (isCheck) {
    }
  };

  const debounceCheck = useCallback(debounce(handleCheckContent, 1000), []);

  useEffect(() => {
    handleAdd();
    // previousRef.current = editorRef.current?.innerText || '';
  }, [checkedData, activeError, handleAdd]);

  return (
    <div className='h-screen'>
      <header className='sticky top-0 p-4 bg-blue-500 text-white font-semibold'>
        Grammar check
        <input
          type='checkbox'
          name='show'
          id='show-line-error'
          onChange={handleToggleShowLineError}
        />
      </header>

      <div className='mt-8 pb-6 flex flex-col lg:flex-row gap-4'>
        <ContentEditable
          id='editor'
          className='lg:w-1/2 min-h-[calc(100vh-112px)] mx-4 py-3 px-4 border border-gray-300 outline-none rounded-lg'
          innerRef={editorRef}
          html={content}
          disabled={false}
          onChange={handleChangeEditor}
          onKeyDown={handleKeyDown}
          onInput={handleInputEditor}
          data-gramm={false}
          data-gramm_editor={false}
          data-enable-grammarly={false}
        />

        <div className='lg:w-1/2 p-4 flex flex-col'>
          <h3 className='font-semibold text-blue-700 text-xl text-center pb-8'>Suggestions</h3>

          {isLoading && (
            <div className='flex justify-center mt-8'>
              <Image priority src={loadingIcon} alt='Checking content...' className='w-20 h-20' />
            </div>
          )}

          {!content && (
            <div className='flex flex-col items-center mt-8'>
              <Image priority src={notificationIcon} alt='Nothing to check yet' />
              <h3 className='text-lg font-semibold mb-2 text-center'>Nothing to check yet!</h3>
              <p className='text-gray-500 w-4/5 text-center'>
                Start writing or upload a document to see Grammar feedback.
              </p>
            </div>
          )}

          {isExistsError && (
            <div className='flex flex-col items-center mt-8'>
              <Image priority src={correctIcon} alt='Everything is good' className='w-20' />
              <h3 className='mt-4 text-lg font-semibold mb-2 text-center'>You are good to go</h3>
            </div>
          )}

          {checkedData
            .filter(data => data.status === 'false')
            .map(error => (
              <Suggestion
                key={error.id}
                activeError={activeError}
                error={error}
                onFixError={handleFixError}
                onShowDetailError={handleShowDetailError}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Grammar;
