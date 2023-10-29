'use client';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { debounce } from 'lodash';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import dynamic from 'next/dynamic';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactQuillType from 'react-quill';
import parse from 'html-react-parser';
import { clsx } from 'clsx';
import { fetchCheckData } from '../services/api';
import ParagraphText from '../grammar/components/ParagraphText';

import logo from '@/app/assets/logo.png';
import moveRightIcon from '@/app/assets/move-right.svg';
import loadingIcon from '@/app/assets/loading.svg';

import Image from 'next/image';
import NothingSvgIcon from '../components/icons/NothingSvgIcon';
import Suggestion from '../grammar/components/Suggestion';
import CorrectSvgIcon from '../components/icons/CorrectSvgIcon';
import { renderToString } from 'react-dom/server';
import PerformanceScore from '../grammar/components/PerformanceScore';
import GoalSetting from '../grammar/components/GoalSetting';
import SuggestionType from '../grammar/components/SuggestionType';
import SpinnerSvgIcon from '../components/icons/SpinnerSvgIcon';

import './index.scss';

const isInsertError = (error: ResponseText) => error.kind_of_error.includes('Insert');
const isRemoveError = (error: ResponseText) => error.kind_of_error.includes('Remove');

const GrammarPage = () => {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<ResponseText[]>([]);
  const [activeError, setActiveError] = useState(-1);
  const [showAssistant, setShowAssistant] = useState(true);
  const [score, setScore] = useState(0);
  const [marginTop, setMarginTop] = useState(0);

  const isChangeRef = useRef(true);
  const previousRef = useRef('');
  const cursorPosRef = useRef(0);
  const controllerRef = useRef(new AbortController());
  const disabledCheckRef = useRef(false);

  const isExistsError = useMemo(() => {
    return errors.length > 0 && errors.findIndex(data => data.status === 'false') !== -1;
  }, [errors]);

  const isFixAll = useMemo(() => errors.length > 0 && errors.findIndex(err => err.status === 'false') === -1, [errors]);

  const totalSuggestions = useMemo(() => {
    return errors.filter(data => data.status === 'false').length;
  }, [errors]);

  const handleActiveError = (id: number) => {
    console.log('id');
    setActiveError(id);
  };

  const handleFixError = (error: ResponseText) => {
    // setContent('<p>This is nbsp;nbsp;nbsp;a sente</p>');
    // return;
    console.log('cotettt', content);
    const idxFixError = errors.findIndex(data => data.id === error.id);
    const fixedText = `${error.revised_sentence}${isInsertError(error) ? '' : ''}`;

    if (idxFixError === -1) return;

    disabledCheckRef.current = true;

    let posFix = 0;
    console.log('content before', content);

    const fixedData = errors.reduce((result: ResponseText[], currError: ResponseText, idx: number) => {
      if (idxFixError > idx) {
        let distance = 0;
        if (currError.text === '\n') {
          const previousError = errors[idx - 1]?.text;
          const nextError = errors[idx - 1]?.text;
          if (previousError === '\n' && nextError === '\n') {
            distance = 11;
          } else if (previousError === '\n' && nextError !== '\n') {
            distance = 14;
          } else if (previousError !== '\n' && nextError === '\n') {
            distance = 4;
          } else {
            distance = 7;
          }
        } else {
          distance = currError.text.length - (isInsertError(currError) || isRemoveError(currError) ? 1 : 0);
        }
        console.log('dis', distance);
        posFix = posFix + distance;
      }

      if (isRemoveError(error) && idxFixError + 1 === idx) {
        return [
          ...result,
          {
            ...currError,
            text: '',
          },
        ];
      }

      return [
        ...result,
        currError.id === error.id
          ? {
              ...error,
              status: 'true',
              text: fixedText,
            }
          : currError,
      ];
    }, []);

    console.log('pos', posFix);
    const contentWithOutEle = content.slice(3, content.length - 4);

    const fixedContent =
      contentWithOutEle.slice(0, posFix) +
      contentWithOutEle
        .slice(posFix)
        .replace(`${error.text}${isRemoveError(error) ? '' : ''}`, `${isInsertError(error) ? '' : ''}${fixedText}`);

    console.log('aaa', fixedContent);
    console.log('bbb', fixedData);
    setContent(`<p>${fixedContent}</p>`);
    setErrors(fixedData);
    setActiveError(-1);
  };

  const handleFixAllErrors = () => {
    const fixedContent = errors.reduce((content: string, err: ResponseText) => content + err.revised_sentence, '');

    console.log('content', fixedContent);
    setContent(`<p>${fixedContent}</p>`);
    setErrors([]);
    setActiveError(-1);
  };

  const handleShowDetailError = (id: number) => {
    const lineError = document.querySelector(`[data-mark-id="${id}"]`);

    setActiveError(id);
    lineError?.scrollIntoView();
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
      setIsLoading(true);

      if (controllerRef.current.signal) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();

      controllerRef.current = controller;

      const res = await fetchCheckData(value, controller.signal);

      setErrors(res);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleToggleAssistant = () => {
    setShowAssistant(prev => !prev);
  };

  const handleKeydown = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter') {
      const disToTop = document.documentElement.scrollTop;
      const heightOfScreen = document.documentElement.clientHeight;

      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const cursorDistanceFromBottom = document.documentElement.clientHeight - rect.bottom;
        console.log('dis', range);
        return cursorDistanceFromBottom;
      }
      return -1;

      if (heightOfScreen - disToTop) {
      }
    }
  };

  const handleChangeEditor = (value: string, delta: unknown, source: unknown, editor: ReactQuillType.UnprivilegedEditor) => {
    // if (disabledCheckRef.current) {
    //   disabledCheckRef.current = false;
    //   return;
    // }

    if (controllerRef.current.signal) {
      controllerRef.current.abort();
    }

    const valEditor = editor.getText();

    const valCheck = valEditor.slice(0, valEditor.length - 1);

    if (!valEditor) return;

    previousRef.current = value;
    setErrors([]);
    setContent(value);

    debounceCheck(valCheck);
  };

  const handleUpdateContent = (content: ResponseText[] | string) => {
    const root = document.getElementsByClassName('ql-editor');

    if (!root[0]) return;

    isChangeRef.current = false;

    const rootEle = createRoot(root[0]);

    if (typeof content === 'string') {
      rootEle.render(parse(content));

      return;
    }

    previousRef.current = renderToString(<ParagraphText activeError={activeError} data={content} onShowErrorDetail={handleActiveError} />);

    createRoot(root[0]).render(<ParagraphText activeError={activeError} data={content} onShowErrorDetail={handleActiveError} />);
  };

  const debounceCheck = useCallback(debounce(handleCheckContent, 1000), []);

  useEffect(() => {
    const editorHeader = document.querySelector('.ql-toolbar');

    if (!editorHeader) return;

    setMarginTop(editorHeader.getBoundingClientRect().height);
  }, []);

  console.log('errors', errors);

  return (
    <div className='h-screen flex'>
      <div
        className={`grow max-w-[calc(100%-${showAssistant ? '224px' : '0px'})] transition-all`}
        style={{
          maxWidth: `calc(100% - ${showAssistant ? '224px' : '0px'})`,
        }}
      >
        <header className='sticky top-0 h-16 p-4 px-8 flex justify-between items-center bg-white z-50'>
          <div className='flex items-center'>
            <Image src={logo} alt='Grammar check' className='w-14' />
            <h2 className='text-xl font-semibold'>Grammar</h2>
          </div>

          {showAssistant ? (
            <div className={clsx('flex items-center justify-between pl-8 pr-4 lg:w-2/5')}>
              <div className='hidden text-sm font-semibold lg:block'>
                {totalSuggestions > 0 && (
                  <span
                    className={`inline-flex justify-center items-center mr-2 text-white text-xs bg-[#eb4034] ${
                      totalSuggestions > 9 ? 'px-[6px] py-[3px] rounded-lg' : 'w-6 h-6 rounded-full'
                    }`}
                  >
                    {totalSuggestions}
                  </span>
                )}
                All suggestions
              </div>

              {totalSuggestions > 0 && (
                <button
                  className='block px-4 py-1.5 bg-blue-600 rounded-full text-xs font-bold text-white transition-colors hover:bg-blue-500'
                  onClick={handleFixAllErrors}
                >
                  Fix All Errors
                </button>
              )}
            </div>
          ) : (
            <div className={`${showAssistant ? 'hidden' : 'flex'}`}>
              {totalSuggestions > 0 && (
                <button
                  className='block px-4 py-1.5 bg-blue-600 rounded-full text-xs font-bold text-white transition-colors hover:bg-blue-500'
                  onClick={handleFixAllErrors}
                >
                  Fix All Errors
                </button>
              )}
              <span
                className='hidden items-center mr-4 text-xs uppercase font-medium text-gray-600 cursor-pointer lg:inline-flex'
                onClick={handleToggleAssistant}
              >
                {totalSuggestions > 0 && (
                  <span className='inline-flex px-2 mr-1 text-white text-sm upp rounded-lg bg-[#eb4034]'>{totalSuggestions}</span>
                )}
                Suggestions
              </span>
              <button
                className={`group relative flex items-center justify-center w-52 bg-blue-600 text-white py-1.5 text-xs uppercase font-semibold tracking-wide rounded-3xl hover:bg-blue-500 transition-all`}
                onClick={handleToggleAssistant}
              >
                {isLoading ? 'Checking...' : 'Correct with assistant'}
                {isLoading && (
                  <span className='absolute top-1/2 right-0 -translate-y-1/2'>
                    <SpinnerSvgIcon />
                  </span>
                )}
              </button>
            </div>
          )}
        </header>

        <div className='min-h-[calc(100vh-64px)] relative flex flex-col lg:flex-row lg:justify-between gap-8'>
          <div
            id='editor'
            className={`relative mt-4 mx-4 mb-8 z-10 outline-none rounded-lg ${showAssistant ? 'lg:w-1/2' : 'lg:w-3/4 mx-auto'}`}
          >
            <ReactQuill
              theme='snow'
              // className='h-full'
              preserveWhitespace={true}
              modules={{
                toolbar: [
                  [{ header: '1' }, { header: '2' }],
                  // [{ size: [] }],
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
                clipboard: {
                  // toggle to add extra line breaks when pasting HTML:
                  matchVisual: false,
                },
              }}
              formats={[
                'span',
                'header',
                'font',
                'size',
                'bold',
                'italic',
                'underline',
                'strike',
                'blockquote',
                'list',
                'bullet',
                'indent',
                'link',
                'image',
                'video',
              ]}
              placeholder='Type or paste (Ctrl + V) your text.'
              // bounds={'.app'}
              value={content}
              onChange={handleChangeEditor}
              // onKeyDown={handleKeydown}
            />

            {errors.length > 0 && (
              <div
                id='paragraph-error'
                className='absolute py-3 px-[15px] inset-0 bg-transparent text-sm leading-[26px]'
                style={{
                  marginTop: `${marginTop}px`,
                }}
              >
                <ParagraphText activeError={activeError} data={errors} onShowErrorDetail={handleActiveError} />
              </div>
            )}
          </div>

          <div
            className={clsx(
              'pl-4 pr-8 flex-col lg:flex',
              showAssistant ? 'lg:w-2/5' : 'lg:w-0 hidden'
              // isExistsError && 'sticky top-[114px] lg:max-h-[calc(100vh-114px)]'
            )}
          >
            {isLoading && errors.length === 0 && (
              <div className='flex justify-center mt-14'>
                <Image priority src={loadingIcon} alt='Checking content...' className='w-20 h-20' />
              </div>
            )}

            {!content && (
              <div className='flex flex-col items-center self-center my-auto pb-16'>
                <NothingSvgIcon />
                <h3 className='text-lg font-semibold mt-4 mb-2 text-center'>Nothing to check yet!</h3>
                <p className='text-gray-500 w-4/5 text-center'>Start writing or upload a document to see Grammar feedback.</p>
              </div>
            )}

            {isFixAll && (
              <div className='flex flex-col items-center self-center my-auto pb-16'>
                <CorrectSvgIcon />
                <h3 className='mt-4 text-lg font-semibold mb-2 text-center'>You are good to go</h3>
              </div>
            )}

            {isExistsError && (
              <div className='h-[calc(100vh-64px)] pb-5 overflow-auto scrollbar-invisible'>
                {errors
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
            )}
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 h-screen flex flex-col gap-2 w-56 shrink-0 shadow-lg py-4 px-4 bg-white border-l-gray-300 border-l z-50 transition-all ${
          showAssistant ? 'right-0' : 'right-[-224px]'
        }`}
      >
        <button
          className='group relative flex items-center justify-center mx-auto mb-4 bg-gray-200 text-gray-500 px-4 py-1.5 text-[10px] uppercase font-semibold tracking-wide rounded-3xl hover:bg-gray-300 transition-colors'
          onClick={handleToggleAssistant}
        >
          Hide Assistant
          <Image src={moveRightIcon} alt='Hide Assistant' className='w-3 h-3 text-white ml-1' />
        </button>

        <PerformanceScore isLoading={isLoading} score={score} />

        <GoalSetting />

        <hr className='mb-4' />

        <SuggestionType />
      </div>
    </div>
  );
};

export default GrammarPage;
