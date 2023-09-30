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
import moveLeftIcon from '@/app/assets/move-left.svg';
import moveRightIcon from '@/app/assets/move-right.svg';
import rightArrowIcon from '@/app/assets/right-arrow.svg';

import { fetchCheckData } from '../services/api';
import ParagraphText from './components/ParagraphText';
import Suggestion from './components/Suggestion';
import Switch from './components/Switch';

const PLACEHOLDER = '';

const Grammar = () => {
  const [content, setContent] = useState('');
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [activeError, setActiveError] = useState(-1);
  const [checkedData, setCheckedData] = useState<ResponseText[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(true);

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
    const length = value.length;

    if (length <= 2) return value;

    return value.slice(0, Math.ceil(length / 2));
  };

  const handleConvertText = (value: string) => {
    const breakRegex = /[\n]+/;
    const notBreakRegex = /[^\n]+/;

    const breakLines = value.split(notBreakRegex);
    const breakTexts = value.split(breakRegex);

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

      setContent(nContent.replaceAll('<br/>', '<br>'));
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

    setShowPlaceholder(textValue.length === 0);
    setIsLoading(textValue.length !== 0);

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
      setActiveError(-1);
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

  const handleToggleShowLineError = (e: ChangeEvent<HTMLInputElement>) => {
    const isCheck = e.target.checked;
    // console.log('aa', editorRef.current.);

    if (isCheck) {
    }
  };
  const handleInputEditor = (evt: FormEvent<HTMLDivElement>) => {
    const selection = window.getSelection();

    if (selection?.rangeCount && selection?.rangeCount > 0) {
      const range = selection?.getRangeAt(0);
      const container = range?.commonAncestorContainer;

      if (container?.nodeType === 3 && container.parentNode?.nodeName === 'span') {
        range?.setStart(container, 9);
        range?.setEnd(container, 10);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const handleToggleAssistant = () => {
    setShowAssistant(prev => !prev);
  };

  const debounceCheck = useCallback(debounce(handleCheckContent, 1000), []);

  useEffect(() => {
    handleAdd();
    // previousRef.current = editorRef.current?.innerText || '';
  }, [checkedData, activeError, handleAdd]);

  return (
    <div className='h-screen flex'>
      <div className='grow w-1/2'>
        <header className='sticky top-0 p-4 flex justify-between items-center bg-blue-500 text-white'>
          <h3 className='font-semibold'>Grammar check</h3>

          <div className='flex gap-2'>
            <button
              className={`group relative flex items-center justify-center bg-orange-400 px-4 py-1.5 text-xs uppercase font-semibold tracking-wide rounded-3xl hover:bg-orange-500 transition-all ${
                showAssistant ? '' : ''
              }`}
              onClick={handleToggleAssistant}
            >
              {showAssistant ? 'Hide Assistant' : 'Correct with assistant'}
              {showAssistant && (
                <Image
                  src={moveRightIcon}
                  alt='Hide Assistant'
                  className='w-3 h-3 text-white ml-1'
                />
              )}
            </button>
          </div>
        </header>

        <div className='relative mt-8 pb-6 flex flex-col lg:flex-row gap-4'>
          <ContentEditable
            className={`min-h-[calc(100vh-112px)] mx-4 py-3 px-4 z-10 border border-gray-300 outline-none rounded-lg ${
              showAssistant ? 'lg:w-1/2' : 'lg:w-3/4 mx-auto'
            }`}
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

          {showPlaceholder && (
            <div
              className={`absolute top-3 left-8 text-gray-400 ${
                showAssistant ? 'left-8' : 'left-0 pl-[calc(12.5%+8px)]'
              }`}
            >
              Type or paste (Ctrl + V) your text.
            </div>
          )}

          <div className={`p-4 flex flex-col ${showAssistant ? 'lg:w-1/4' : 'lg:w-0 hidden'}`}>
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

      <div className='flex flex-col gap-4 w-56 shrink-0 shadow-lg py-4 px-4 border-l-gray-300 border-l'>
        <button
          className='group relative flex items-center justify-center mx-auto mb-4 bg-gray-200 text-gray-500 px-4 py-1.5 text-xs uppercase font-semibold tracking-wide rounded-3xl hover:bg-gray-300 transition-colors'
          onClick={handleToggleAssistant}
        >
          Hide Assistant
          <Image src={moveRightIcon} alt='Hide Assistant' className='w-3 h-3 text-white ml-1' />
        </button>

        <div className='group flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100'>
          <span>
            <strong className='mr-1'>74</strong>
            Overall score
          </span>
          <Image
            src={rightArrowIcon}
            alt='Right Arrow'
            className='w-6 h-6 group-hover:text-blue-300'
          />
        </div>

        <div className='group flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100'>
          <span>Goals</span>
          <Image
            src={rightArrowIcon}
            alt='Right Arrow'
            className='w-6 h-6 group-hover:text-blue-300'
          />
        </div>
      </div>
    </div>
  );
};

export default Grammar;
