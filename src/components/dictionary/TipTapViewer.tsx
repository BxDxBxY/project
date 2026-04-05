"use client";

import React, { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TextStyle } from "@tiptap/extension-text-style";

// Reuse the same CSS as EditorComponent
const editorStyles = `
  .viewer-container {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-height: 100px;
  }
  .viewer-content {
    font-size: 16px;
    line-height: 1.5;
  }
  .viewer-content h1 { font-size: 2em; margin: 0.5em 0; font-weight: bold; }
  .viewer-content h2 { font-size: 1.5em; margin: 0.5em 0; font-weight: bold; }
  .viewer-content h3 { font-size: 1.25em; margin: 0.5em 0; font-weight: bold; }
  .viewer-content h4 { font-size: 1.1em; margin: 0.5em 0; font-weight: bold; }
  .viewer-content h5 { font-size: 1em; margin: 0.5em 0; font-weight: bold; }
  .viewer-content h6 { font-size: 0.9em; margin: 0.5em 0; font-weight: bold; }
  .viewer-content p { margin: 0.5em 0; }
  .viewer-content ul { list-style: disc; margin: 0.5em 0; padding-left: 2em; }
  .viewer-content ol { list-style: decimal; margin: 0.5em 0; padding-left: 2em; }
  .viewer-content li { margin: 0.25em 0; }
  .viewer-content blockquote {
    border-left: 4px solid #d1d5db;
    padding-left: 1em;
    margin: 0.5em 0;
    color: #4b5563;
  }
  .viewer-content code {
    background: #f3f4f6;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
  }
  .viewer-content pre {
    background: #1f2937;
    color: #fff;
    padding: 1em;
    border-radius: 4px;
    font-family: monospace;
    overflow-x: auto;
  }
  .viewer-content pre code { background: none; padding: 0; }
  .viewer-content img { max-width: 100%; margin: 0.5em 0; }
  .viewer-content a { color: #2563eb; text-decoration: underline; }
  .viewer-content .task-list-item { display: flex; align-items: center; }
  .viewer-content .task-list-item input[type="checkbox"] { margin-right: 0.5em; }
`;

type TiptapViewerProps = {
  content: string; // HTML content from EditorComponent
  className?: string;
};

const TiptapViewer: React.FC<TiptapViewerProps> = ({
  content,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const extensions = useMemo(
    () => [
      StarterKit.configure({}),
      Placeholder.configure({ placeholder: "No content available" }), // Optional, for empty content
      Link.configure({
        openOnClick: true, // Allow clicking links in read-only mode
        autolink: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ inline: false, allowBase64: true }),
      TaskItem.configure({ nested: true }),
      TaskList,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight,
    ],
    [],
  );

  const editor = useEditor({
    editable: false, // Read-only mode
    extensions,
    content,
    immediatelyRender: false, // Prevent hydration issues
  });

  // Sync content if it changes
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (content !== current) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!mounted) {
    return <div className="viewer-container">Loading content…</div>;
  }

  if (!editor) {
    return null;
  }

  return (
    <>
      <style>{editorStyles}</style>
      <div className={`viewer-container ${className}`}>
        <div
          className="viewer-content text-justify md:!text-xl py-0 my-0"
          contentEditable={false}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
};

TiptapViewer.displayName = "TiptapViewer";

export default TiptapViewer;
