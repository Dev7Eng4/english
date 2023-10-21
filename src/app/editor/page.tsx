'use client';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { debounce } from 'lodash';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import parse from 'html-react-parser';
import diff from 'fast-diff';
import { fetchCheckData } from '../services/api';
import ParagraphText from '../grammar/components/ParagraphText';

import logo from '@/app/assets/logo.png';
import moveRightIcon from '@/app/assets/move-right.svg';
import loadingIcon from '@/app/assets/loading.svg';

import './index.scss';
import Image from 'next/image';
import NothingSvgIcon from '../components/icons/NothingSvgIcon';
import Suggestion from '../grammar/components/Suggestion';
import CorrectSvgIcon from '../components/icons/CorrectSvgIcon';
import { renderToString } from 'react-dom/server';
import PerformanceScore from '../grammar/components/PerformanceScore';
import GoalSetting from '../grammar/components/GoalSetting';
import SuggestionType from '../grammar/components/SuggestionType';
import SpinnerSvgIcon from '../components/icons/SpinnerSvgIcon';

const GrammarPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<ResponseText[]>([]);
  const [activeError, setActiveError] = useState(-1);
  const [showAssistant, setShowAssistant] = useState(true);
  const [score, setScore] = useState(0);
  const [marginTop, setMarginTop] = useState(68);

  const isChangeRef = useRef(true);
  const previousRef = useRef('');
  const controllerRef = useRef(new AbortController());

  // console.log('err', errors);
  const isExistsError = useMemo(() => {
    return errors.length > 0 && errors.findIndex(data => data.status === 'false') === -1;
  }, [errors]);

  const totalSuggestions = useMemo(() => {
    return errors.filter(data => data.status === 'false').length;
  }, [errors]);

  const handleActiveError = (id: number) => {
    setActiveError(id);
  };

  const handleFixError = (error: ResponseText) => {
    const idxFixError = errors.findIndex(data => data.id === error.id);
    const isInsert = error.kind_of_error.includes('Insert');
    const fixedText = `${error.revised_sentence}${isInsert ? '' : ''}`;

    if (idxFixError === -1) return;

    let posFix = 3;

    console.log('idx', content.includes('</p>'));

    const fixedData = errors.map((data, idx) => {
      if (idxFixError > idx) {
        posFix = posFix + (data.text === '\n' ? 7 : data.text.length);
        console.log('idddd', idx);
        console.log('data', data);
        console.log('id', posFix);
      }

      return data.id === error.id
        ? {
            ...error,
            status: 'true',
            text: fixedText,
          }
        : data;
    });

    console.log('ee', errors);
    console.log('pos', posFix);

    const newContent =
      content.slice(0, posFix) + content.slice(posFix).replace(error.text, fixedText);

    console.log('cconte', newContent);
    setContent(newContent);
    // handleUpdateContent(fixedData);

    setErrors(fixedData);
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
      // const editor = document.querySelector('.ck-editor__editable');

      setIsLoading(true);

      if (controllerRef.current.signal) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();

      controllerRef.current = controller;

      const res = await fetchCheckData(value, controller.signal);

      // setContent(renderToString(<ParagraphText activeError={-1} data={res} onShowErrorDetail={() => {}} />));
      // handleUpdateContent(res);

      setErrors(res);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleRemoveTextError = (value: string) => {
    const newContent = value.replaceAll('error-line', '');

    if (newContent !== value) {
      handleUpdateContent(value.replaceAll('inline-block', ''));
    }
  };

  const handleBreakLine = (currentValue: string, selection: any) => {
    // console.log('curre', currentValue);
    // console.log('pre', previousRef.current);
    // console.log('diff', diff(currentValue, previousRef.current));
  };

  const handleKeydown = (evt: React.KeyboardEvent) => {
    // console.log('evt', evt.key);
  };

  const handleChangeEditor = (
    value: string,
    delta: unknown,
    source: unknown,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    // console.log('value', value);

    // console.log('content', editor.getContents());
    // console.log('html', editor.getHTML());
    // console.log('text', editor.getText().includes('\n'));
    // console.log('selection', editor.getSelection());
    // console.log('content', editor.());
    // console.log('content', editor.getContents());
    const valEditor = editor.getText();

    console.log('change', valEditor.includes('<p>'));

    // setContent(value.replaceAll(/<\/?p[^>]*>/g, '').replace('<br>', ''));

    handleBreakLine(value, editor.getSelection());

    // if (!isChangeRef.current) {
    //   isChangeRef.current = true;
    //   console.log('return');
    //   return;
    // }

    const valCheck = valEditor.slice(0, valEditor.length - 1);

    if (!valEditor) return;

    // handleRemoveTextError(value);

    previousRef.current = value;
    // console.log(valEditor);
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

    previousRef.current = renderToString(
      <ParagraphText
        activeError={activeError}
        data={content}
        onShowErrorDetail={handleActiveError}
      />
    );

    createRoot(root[0]).render(
      <ParagraphText
        activeError={activeError}
        data={content}
        onShowErrorDetail={handleActiveError}
      />
    );
  };

  const debounceCheck = useCallback(debounce(handleCheckContent, 1000), []);

  useEffect(() => {
    const editorHeader = document.querySelector('.ql-toolbar');

    if (!editorHeader) return;

    setMarginTop(editorHeader.getBoundingClientRect().height);
  }, []);

  useEffect(() => {
    // handleUpdateContent(errors);
  }, [activeError]);

  // useEffect(() => {
  //   const test =
  //     '<p class="inline"><br></p><p class="inline">This</p><p class="inline"> a</p><p class="inline">is</p><p class="inline"> </p><p class="inline-block  " data-mark-id="7fcd2a32-6e8f-4b84-802c-cbbad65395bd">err</p>';

  //   const root = document.getElementsByClassName('ql-editor');

  //   const rootEle = createRoot(root[0]);
  //   console.log('rrrr', rootEle );

  //   rootEle.render(
  //     <p
  //       dangerouslySetInnerHTML={{
  //         __html: test,
  //       }}
  //     ></p>
  //   );
  // }, []);

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
            <h2 className='w-2/5 flex items-center justify-center text-lg font-semibold'>
              {totalSuggestions > 0 && (
                <span className='inline-flex justify-center items-center mr-2 px-2 py-1 text-white text-xs bg-[#eb4034] rounded-full'>
                  {totalSuggestions}
                </span>
              )}
              All suggestions
            </h2>
          ) : (
            <div className={`${showAssistant ? 'hidden' : 'flex'}`}>
              <span
                className='inline-flex items-center mr-4 text-xs uppercase font-medium text-gray-600 cursor-pointer'
                // onClick={handleToggleAssistant}
              >
                {totalSuggestions > 0 && (
                  <span className='inline-flex px-2 mr-1 text-white text-sm upp rounded-lg bg-[#eb4034]'>
                    {totalSuggestions}
                  </span>
                )}
                Suggestions
              </span>
              <button
                className={`group relative flex items-center justify-center w-52 bg-blue-600 text-white py-1.5 text-xs uppercase font-semibold tracking-wide rounded-3xl hover:bg-blue-500 transition-all`}
                // onClick={handleToggleAssistant}
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

        <div className='min-h-[calc(100vh-64px)] relative pt-8 flex flex-col lg:flex-row lg:justify-between gap-8'>
          <div
            id='editor'
            className={`relative mx-4 mb-5 z-10 outline-none rounded-lg ${
              showAssistant ? 'lg:w-1/2' : 'lg:w-3/4 mx-auto'
            }`}
          >
            <ReactQuill
              theme='snow'
              className='h-full'
              modules={{
                toolbar: [
                  [{ header: '1' }, { header: '2' }, { font: [] }],
                  // [{ size: [] }],
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  // ['clean'],
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
              bounds={'.app'}
              value={content}
              onChange={handleChangeEditor}
              // onKeyDown={handleKeydown}
            />

            {errors.length > 0 && (
              <p
                id='paragraph-error'
                className='absolute py-3 px-[15px] inset-0 bg-transparent text-sm'
                style={{
                  marginTop: `${marginTop}px`,
                }}
              >
                <ParagraphText
                  activeError={activeError}
                  data={errors}
                  onShowErrorDetail={handleActiveError}
                />
              </p>
            )}
          </div>

          <div
            className={`sticky top-[114px] max-h-[calc(100vh-114px)] overflow-auto scrollbar-invisible p-4 pb-6 pr-8 flex flex-col ${
              showAssistant ? 'lg:w-2/5' : 'lg:w-0 hidden'
            }`}
          >
            {isLoading && errors.length === 0 && (
              <div className='flex justify-center mt-8'>
                <Image priority src={loadingIcon} alt='Checking content...' className='w-20 h-20' />
              </div>
            )}

            {!content && (
              <div className='flex flex-col items-center self-center my-auto pb-40'>
                <NothingSvgIcon />
                <h3 className='text-lg font-semibold mt-4 mb-2 text-center'>
                  Nothing to check yet!
                </h3>
                <p className='text-gray-500 w-4/5 text-center'>
                  Start writing or upload a document to see Grammar feedback.
                </p>
              </div>
            )}

            {isExistsError && (
              <div className='flex flex-col items-center self-center my-auto pb-40'>
                <CorrectSvgIcon />
                <h3 className='mt-4 text-lg font-semibold mb-2 text-center'>You are good to go</h3>
              </div>
            )}

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
        </div>
      </div>

      <div
        className={`fixed top-0 h-screen flex flex-col gap-2 w-56 shrink-0 shadow-lg py-4 px-4 bg-white border-l-gray-300 border-l z-50 transition-all ${
          showAssistant ? 'right-0' : 'right-[-224px]'
        }`}
      >
        <button
          className='group relative flex items-center justify-center mx-auto mb-4 bg-gray-200 text-gray-500 px-4 py-1.5 text-xs uppercase font-semibold tracking-wide rounded-3xl hover:bg-gray-300 transition-colors'
          // onClick={handleToggleAssistant}
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
