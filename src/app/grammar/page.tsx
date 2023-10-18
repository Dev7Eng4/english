'use client';

import axios from 'axios';
import { debounce } from 'lodash';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { renderToString } from 'react-dom/server';

import logo from '@/app/assets/logo.png';
import loadingIcon from '@/app/assets/loading.svg';
import notificationIcon from '@/app/assets/notification.png';
import correctIcon from '@/app/assets/correct.png';
import moveLeftIcon from '@/app/assets/move-left.svg';
import moveRightIcon from '@/app/assets/move-right.svg';

import { fetchCheckData } from '../services/api';
import ParagraphText from './components/ParagraphText';
import Suggestion from './components/Suggestion';
import Switch from './components/Switch';
import GoalSetting from './components/GoalSetting';
import PerformanceScore from './components/PerformanceScore';
import NothingSvgIcon from '../components/icons/NothingSvgIcon';
import CorrectSvgIcon from '../components/icons/CorrectSvgIcon';
import SuggestionType from './components/SuggestionType';
import SpinnerSvgIcon from '../components/icons/SpinnerSvgIcon';

const PLACEHOLDER = '';
let savedCursorSelection: number;

const Grammar = () => {
  const [content, setContent] = useState('');
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [activeError, setActiveError] = useState(-1);
  const [checkedData, setCheckedData] = useState<ResponseText[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(true);
  const [score, setScore] = useState(0);

  const previousRef = useRef('');
  const editorRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef(new AbortController());
  const cursorRef = useRef(null);
  const selectionRef = useRef();

  const isExistsError = useMemo(() => {
    return checkedData.length > 0 && checkedData.findIndex(data => data.status === 'false') === -1;
  }, [checkedData]);

  const totalSuggestions = useMemo(() => {
    return checkedData.filter(data => data.status === 'false').length;
  }, [checkedData]);

  const handleSaveCursor = () => {
    const editor = document.getElementById('editor');
    const selection = window.getSelection();

    if (!editor || !selection) return;

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(editor);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    savedCursorSelection = preSelectionRange.toString().length;
  };

  const handleRestoreCursor = () => {
    const editor = document.getElementById('editor');
    const textNode = getTextNodeAtPosition(editor, savedCursorSelection);

    if (textNode) {
      const range = document.createRange();
      range.setStart(textNode, savedCursorSelection);
      range.collapse(true);
      const select = window.getSelection();
      select?.removeAllRanges();
      select?.addRange(range);
      editor?.focus();
    }
  };

  const getTextNodeAtPosition = (root: any, index: number) => {
    const tree = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let currentIndex = 0;

    while (tree.nextNode()) {
      const currentNode = tree.currentNode;
      // @ts-ignore
      const nodeLength = currentNode.length;

      if (currentIndex + nodeLength >= index) {
        return currentNode;
      }

      currentIndex += nodeLength;
    }

    return null;
  };

  const handleAdd = useCallback(() => {
    const errorLines = document.querySelectorAll('.error-line');

    if (errorLines.length === 0) return;

    errorLines.forEach(line => {
      const id = line.getAttribute('data-mark-id');

      if (line.classList.contains('bg-red-100') && activeError !== Number(id)) {
        line.classList.remove('bg-red-100');
      }

      if (activeError === Number(id)) {
        line.classList.add('bg-red-100');
      }

      line.addEventListener('click', () => {
        setActiveError(Number(id));
      });
    });
  }, [activeError]);

  const handleFixError = (error: ResponseText) => {
    const fixedError = checkedData.find(data => data.id === error.id);

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

    const nContent = renderToString(<ParagraphText activeError={activeError} data={fixedData} onShowErrorDetail={handleActiveError} />);

    setContent(nContent.replaceAll('<br/>', '<br>'));
    setCheckedData(fixedData);
    setActiveError(-1);
  };

  const handleActiveError = (id: number) => {
    setActiveError(id);
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
      if (!value) return;

      setIsLoading(true);

      if (controllerRef.current.signal) {
        controllerRef.current.abort();
      }

      console.log('ref', savedCursorSelection);

      const controller = new AbortController();

      controllerRef.current = controller;

      const res = await fetchCheckData(value, controller.signal);

      const nContent = renderToString(<ParagraphText activeError={activeError} data={res} onShowErrorDetail={handleActiveError} />);

      setScore(res.length < 12 ? 100 - res.length * 5 : 35);
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

    console.log('chang 1', textValue);

    if (textValue === previousRef.current) return;
    console.log('chang 2', previousRef.current);

    // console.log('change', textValue);
    // console.log('contttttt', evt.target.value);

    previousRef.current = handleConvertText(textValue);

    console.log('chang 3', evt.target.value);
    if (evt.target.value === content) return;
    console.log('change 4', content);
    controllerRef.current.abort();

    const ele = document.querySelector('#editor');

    setIsLoading(textValue.length !== 0);

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

  const handleFocusEditor = () => {
    handleSaveCursor();
  };

  const handleKeyDown = () => {
    handleSaveCursor();
  };

  const handleToggleShowLineError = (e: ChangeEvent<HTMLInputElement>) => {
    const isCheck = e.target.checked;
    // console.log('aa', editorRef.current.);

    if (isCheck) {
    }
  };
  const handleInputEditor = (evt: FormEvent<HTMLDivElement>) => {
    // const selection = window.getSelection();
    // if (selection?.rangeCount && selection?.rangeCount > 0) {
    //   const range = selection?.getRangeAt(0);
    //   const container = range?.commonAncestorContainer;
    //   if (container?.nodeType === 3 && container.parentNode?.nodeName === 'span') {
    //     range?.setStart(container, 9);
    //     range?.setEnd(container, 10);
    //     selection?.removeAllRanges();
    //     selection?.addRange(range);
    //   }
    // }
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
      <div
        className={`grow max-w-[calc(100%-${showAssistant ? '224px' : '0px'})] transition-all`}
        style={{
          maxWidth: `calc(100% - ${showAssistant ? '224px' : '0px'})`,
        }}
      >
        <header className='sticky top-0 h-16 p-4 px-8 flex justify-between items-center z-30'>
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

        <div className='relative mt-8 flex flex-col lg:flex-row lg:justify-between gap-8'>
          <ContentEditable
            className={`min-h-[calc(100vh-112px)] mx-4 pt-3 pb-6 px-4 z-10 outline-none rounded-lg ${
              showAssistant ? 'lg:w-1/2' : 'lg:w-3/4 mx-auto'
            }`}
            innerRef={editorRef}
            html={content}
            disabled={false}
            onChange={handleChangeEditor}
            onClick={handleFocusEditor}
            onKeyDown={handleKeyDown}
            onInput={handleInputEditor}
            autoFocus={true}
            data-gramm={false}
            data-gramm_editor={false}
            data-enable-grammarly={false}
          />

          {showPlaceholder && (
            <div className={`absolute top-3 text-gray-400 ${showAssistant ? 'left-8' : 'left-0 pl-[calc(12.5%+16px)]'}`}>
              Type or paste (Ctrl + V) your text.
            </div>
          )}

          <div
            className={`sticky top-[114px] max-h-[calc(100vh-114px)] overflow-auto scrollbar-invisible p-4 pb-6 pr-8 flex flex-col ${
              showAssistant ? 'lg:w-2/5' : 'lg:w-0 hidden'
            }`}
          >
            {isLoading && checkedData.length === 0 && (
              <div className='flex justify-center mt-8'>
                <Image priority src={loadingIcon} alt='Checking content...' className='w-20 h-20' />
              </div>
            )}

            {!content && (
              <div className='flex flex-col items-center self-center my-auto pb-40'>
                <NothingSvgIcon />
                <h3 className='text-lg font-semibold mt-4 mb-2 text-center'>Nothing to check yet!</h3>
                <p className='text-gray-500 w-4/5 text-center'>Start writing or upload a document to see Grammar feedback.</p>
              </div>
            )}

            {isExistsError && (
              <div className='flex flex-col items-center self-center my-auto pb-40'>
                <CorrectSvgIcon />
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

      <div
        className={`fixed top-0 h-screen flex flex-col gap-2 w-56 shrink-0 shadow-lg py-4 px-4 bg-white border-l-gray-300 border-l z-50 transition-all ${
          showAssistant ? 'right-0' : 'right-[-224px]'
        }`}
      >
        <button
          className='group relative flex items-center justify-center mx-auto mb-4 bg-gray-200 text-gray-500 px-4 py-1.5 text-xs uppercase font-semibold tracking-wide rounded-3xl hover:bg-gray-300 transition-colors'
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

export default Grammar;
