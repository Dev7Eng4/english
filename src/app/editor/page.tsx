'use client';

import React, { useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Editor } from '@tinymce/tinymce-react';
import Demo from './Demo';

const editorKey = `${process.env.NEXT_PUBLIC_EDITOR_KEY}`;

const eleRegex = /^<.+>$/gi;

const EditorComponent = () => {
  const [value, setValue] = useState<any>(renderToString(<Demo />));
  const editorRef = useRef<any>(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.textContent);
    }
  };

  const handleChange = (val: string) => {
    console.log('vaaaa', document.querySelector('#tinymce')?.textContent);

    const checkedValue = val.replace(eleRegex, '');

    setValue(val);
  };

  console.log('vallll', value);

  return (
    <>
      <Editor
        apiKey={editorKey}
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          id: 'editorText',
          // selector: '#editor-demo',
          height: 500,
          menubar: false,
        }}
        value={value}
        onEditorChange={handleChange}
        data-gramm={false}
        data-gramm_editor={false}
        data-enable-grammarly={false}
      />
      <textarea name='' id='editor-demo'></textarea>
      <button onClick={log}>Click</button>
    </>
  );
};

export default EditorComponent;
