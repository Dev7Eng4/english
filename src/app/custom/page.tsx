'use client';

import { debounce } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { fetchCheckData } from '../services/api';
import axios from 'axios';
import Editor from './Editor';

const CustomEdtior = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  const controllerRef = useRef(new AbortController());

  const [content, setContent] = useState('');

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    console.log(e.currentTarget.textContent);
    setContent(e.currentTarget.innerHTML);

    // debounceCheck(e.currentTarget.textContent || '');
  };

  const handleCheckContent = async (value: string) => {
    try {
      // const editor = document.querySelector('#editor');

      // const currentValue = editor?.textContent;

      if (!value) return;

      // setIsLoading(true);

      if (controllerRef.current.signal) {
        controllerRef.current.abort();
      }

      const nController = new AbortController();

      controllerRef.current = nController;

      const res = await fetchCheckData(value, nController.signal);

      // setResponse(res);

      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
      if (axios.isCancel(error)) {
      }
      console.error('Error', error);
    }
  };

  const debounceCheck = useCallback(debounce(handleCheckContent, 1000), []);

  return <Editor content={content} onChange={setContent} />;
};

export default CustomEdtior;
