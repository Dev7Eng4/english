'use client';

import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import rangy from 'rangy';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

let savedCursorRange: Range;
let savedCursorSelection: number;

const Home = () => {
  const [content, setContent] = useState('');

  const selectionRef = useRef<Range>();

  const handleSaveCursor = () => {
    // const selection = window.getSelection();

    // selectionRef.current = selection?.getRangeAt(0).cloneRange();
    // savedCursorRange = rangy.getSelection().getRangeAt(0);

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
    // const editor = document.getElementById('editor');
    // const selection = rangy.getSelection();

    // if (!editor || !selection || !savedCursorRange) return;

    // console.log('aaa', savedCursorRange.START_TO_END);

    // selection.removeAllRanges();
    // selection.addRange(savedCursorRange);
    // editor.focus();

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

  const handleInputEditor = (evt: FormEvent<HTMLDivElement>) => {
    const value = evt.currentTarget.innerText;

    setContent(value);
    handleSaveCursor();
  };

  const handleChangeEditor = (evt: ChangeEvent<HTMLDivElement>) => {
    console.log('change');
  };

  const handleKeydown = () => {
    console.log('keydown');
  };

  const handleChange = () => {
    const root = document.getElementById('editor');

    if (!root) return;

    createRoot(root).render(<>{content}</>);
  };

  const handleTest = () => {
    handleRestoreCursor();
  };

  return (
    <div>
      {/* <div
        id='editor'
        contentEditable
        className='w-full h-60 p-4 rounded-md border border-gray-300'
        onInput={handleInputEditor}
        onChange={handleChangeEditor}
        onKeyDown={handleKeydown}
      ></div> */}

      <ReactQuill theme='snow' />

      {/* <button className='p-4 bg-blue-600 rounded-lg' onClick={handleChange}>
        Change
      </button>
      <button className='p-4 bg-blue-600 rounded-lg' onClick={handleTest}>
        Test
      </button> */}
    </div>
  );
};

export default Home;
