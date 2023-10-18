'use client';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { debounce } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { fetchCheckData } from '../services/api';

import './index.css';

const GrammarPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<ResponseText[]>([]);

  const controllerRef = useRef(new AbortController());

  const handleCheckContent = async () => {
    try {
      const editor = document.querySelector('.ck-editor__editable');

      if (!editor) return;

      // @ts-ignore
      const value = editor.innerText;

      if (!value) return;

      setIsLoading(true);

      if (controllerRef.current.signal) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();

      controllerRef.current = controller;

      setContent('hehehe');
      const res = await fetchCheckData(value, controller.signal);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleReady = (editor: ClassicEditor) => {
    console.log('ready');
  };

  const handleChangeEditor = (evt: any, editor: ClassicEditor) => {
    debounceCheck();
  };

  const handleBlurEditor = (evt: any, editor: ClassicEditor) => {};

  const handleFocusEditor = (evt: any, editor: ClassicEditor) => {};

  const handleUpdateContent = () => {
    const root = document.getElementById('editor');

    if (!root) return;

    createRoot(root).render(<>{content}</>);
  };

  const debounceCheck = useCallback(debounce(handleCheckContent, 1000), []);

  return (
    <div className='h-96'>
      <CKEditor
        id='editor'
        editor={ClassicEditor}
        data={content}
        onReady={handleReady}
        onChange={handleChangeEditor}
        onBlur={handleBlurEditor}
        onFocus={handleFocusEditor}
        data-gramm={false}
        data-gramm_editor={false}
        data-enable-grammarly={false}
      />
    </div>
  );
};

export default GrammarPage;
