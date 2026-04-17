'use client';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { useRef } from 'react';

interface Props {
  initialValue?: string;
  onChange: (value: string) => void;
}

export default function TuiEditor({ initialValue, onChange }: Props) {
  const editorRef = useRef<Editor>(null);

  const handleChange = () => {
    const instance = editorRef.current?.getInstance();
    if (instance) {
      onChange(instance.getMarkdown());
    }
  };

  return (
    <div className="prose max-w-none min-h-[600px] rounded-lg overflow-hidden border border-base-content/10">
      <Editor
        ref={editorRef}
        initialValue={initialValue || ' '}
        previewStyle="vertical"
        height="600px"
        initialEditType="markdown"
        useCommandShortcut={true}
        theme="dark"
        onChange={handleChange}
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock'],
        ]}
      />
    </div>
  );
}
