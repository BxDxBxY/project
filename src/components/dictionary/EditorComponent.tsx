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
import { IconButton, Tooltip } from "@mui/material";
import {
  Checklist,
  Code,
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatClear,
  FormatColorText,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatUnderlined,
  Redo,
  StrikethroughS,
  Undo,
} from "@mui/icons-material";
import HighlightIcon from "@mui/icons-material/Highlight";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { ImageIcon, LinkIcon } from "lucide-react";

// Plain CSS for the editor and toolbar
const editorStyles = `
  .editor-container {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-height: 200px;
  }
  .editor-content {
    outline: none;
    min-height: 150px;
    font-size: 16px;
    line-height: 1.5;
  }
  .editor-content h1 { font-size: 2em; margin: 0.5em 0; font-weight: bold; }
  .editor-content h2 { font-size: 1.5em; margin: 0.5em 0; font-weight: bold; }
  .editor-content h3 { font-size: 1.25em; margin: 0.5em 0; font-weight: bold; }
  .editor-content h4 { font-size: 1.1em; margin: 0.5em 0; font-weight: bold; }
  .editor-content h5 { font-size: 1em; margin: 0.5em 0; font-weight: bold; }
  .editor-content h6 { font-size: 0.9em; margin: 0.5em 0; font-weight: bold; }
  .editor-content p { margin: 0.5em 0; }
  .editor-content ul { list-style: disc; margin: 0.5em 0; padding-left: 2em; }
  .editor-content ol { list-style: decimal; margin: 0.5em 0; padding-left: 2em; }
  .editor-content li { margin: 0.25em 0; }
  .editor-content blockquote {
    border-left: 4px solid #d1d5db;
    padding-left: 1em;
    margin: 0.5em 0;
    color: #4b5563;
  }
  .editor-content code {
    background: #f3f4f6;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
  }
  .editor-content pre {
    background: #1f2937;
    color: #fff;
    padding: 1em;
    border-radius: 4px;
    font-family: monospace;
    overflow-x: auto;
  }
  .editor-content pre code { background: none; padding: 0; }
  .editor-content img { max-width: 100%; margin: 0.5em 0; }
  .editor-content a { color: #2563eb; text-decoration: underline; }
  .editor-content .task-list-item { display: flex; align-items: center; }
  .editor-content .task-list-item input[type="checkbox"] { margin-right: 0.5em; }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
  .toolbar select, .toolbar button, .toolbar input {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
  }
  .toolbar button.active {
    background: #2563eb;
    color: #fff;
    border-color: #2563eb;
  }
  .toolbar button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .toolbar input[type="color"] {
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
  }
  .dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 100%;
  }
  .dialog h2 { font-size: 1.25em; margin-bottom: 12px; }
  .dialog input { width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #d1d5db; border-radius: 4px; }
  .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }
`;

type Level = 1 | 2 | 3 | 4 | 5 | 6;

type TipTapEditorProps = {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  disabled?: boolean;
  className?: string;
};

const EditorComponent: React.FC<TipTapEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Write something…",
  editable = true,
  disabled = false,
  className = "",
}) => {
  // const editorContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkHref, setLinkHref] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [headingLevel, setHeadingLevel] = useState<number>(0);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        // Remove explicit configuration to use defaults
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
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
    [placeholder],
  );

  const editor = useEditor({
    editable,
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    shouldRerenderOnTransaction: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== undefined && value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    const updateHeading = () => {
      for (let lvl = 1; lvl <= 6; lvl++) {
        if (editor.isActive("heading", { level: lvl })) {
          setHeadingLevel(lvl);
          return;
        }
      }
      setHeadingLevel(0);
    };
    editor.on("selectionUpdate", updateHeading);
    editor.on("transaction", updateHeading);
    updateHeading();
    return () => {
      editor.off("selectionUpdate", updateHeading);
      editor.off("transaction", updateHeading);
    };
  }, [editor]);

  const is = (name: string, attrs?: Record<string, any>) =>
    editor?.isActive(name as any, attrs) ?? false;

  const handleContainerClick = () => {
    if (editor && !disabled) {
      editor.commands.focus();
    }
  };

  if (!mounted) {
    return <div className="editor-container">Loading editor…</div>;
  }

  if (!editor) {
    return null;
  }

  return (
    <>
      <style>{editorStyles}</style>
      <div className={`editor-container ${className}`}>
        {!disabled && (
          <div className="toolbar bg-[#85574a] p-2 rounded-lg">
            <select
              value={headingLevel}
              onChange={(e) => {
                const lvl = Number(e.target.value);
                setHeadingLevel(lvl);
                if (lvl === 0) editor.chain().focus().setParagraph().run();
                else
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: lvl as Level })
                    .run();
              }}
            >
              <option value={0}>Paragraph</option>
              {[1, 2, 3, 4, 5, 6].map((l) => (
                <option key={l} value={l}>{`Heading ${l}`}</option>
              ))}
            </select>

            <Tooltip title="Bold">
              <IconButton
                size="small"
                color={is("bold") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <FormatBold fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Italic">
              <IconButton
                size="small"
                color={is("italic") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <FormatItalic fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Underline">
              <IconButton
                size="small"
                color={is("underline") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <FormatUnderlined fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Strikethrough">
              <IconButton
                size="small"
                color={is("strike") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <StrikethroughS fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Inline code">
              <IconButton
                size="small"
                color={is("code") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleCode().run()}
              >
                <Code fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Highlight">
              <IconButton
                size="small"
                color={is("highlight") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleHighlight().run()}
              >
                <HighlightIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Bulleted list">
              <IconButton
                size="small"
                color={is("bulletList") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <FormatListBulleted fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Numbered list">
              <IconButton
                size="small"
                color={is("orderedList") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <FormatListNumbered fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Task list">
              <IconButton
                size="small"
                color={is("taskList") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleTaskList().run()}
              >
                <Checklist fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Quote">
              <IconButton
                size="small"
                color={is("blockquote") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                <FormatQuote fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Code block">
              <IconButton
                size="small"
                color={is("codeBlock") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              >
                <Code fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Horizontal rule">
              <IconButton
                size="small"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <HorizontalRuleIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Align left">
              <IconButton
                size="small"
                color={
                  editor.isActive({ textAlign: "left" }) ? "primary" : "default"
                }
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
              >
                <FormatAlignLeft fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Align center">
              <IconButton
                size="small"
                color={
                  editor.isActive({ textAlign: "center" })
                    ? "primary"
                    : "default"
                }
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
              >
                <FormatAlignCenter fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Align right">
              <IconButton
                size="small"
                color={
                  editor.isActive({ textAlign: "right" })
                    ? "primary"
                    : "default"
                }
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
              >
                <FormatAlignRight fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Justify">
              <IconButton
                size="small"
                color={
                  editor.isActive({ textAlign: "justify" })
                    ? "primary"
                    : "default"
                }
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
              >
                <FormatAlignJustify fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add/Edit link">
              <IconButton
                size="small"
                color={is("link") ? "primary" : "default"}
                onClick={() => {
                  const prev = editor.getAttributes("link")?.href ?? "";
                  setLinkHref(prev);
                  setLinkOpen(true);
                }}
              >
                <LinkIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Remove link">
              <IconButton
                size="small"
                onClick={() => editor.chain().focus().unsetLink().run()}
              >
                <LinkIcon fontSize="small" className="line-through" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Insert image">
              <IconButton size="small" onClick={() => setImageOpen(true)}>
                <ImageIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Text color">
              <label className="flex items-center gap-1 cursor-pointer">
                <FormatColorText fontSize="small" />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    editor.chain().focus().setColor(e.target.value).run();
                  }}
                  className="w-6 h-6 border-0 bg-transparent p-0 cursor-pointer"
                />
              </label>
            </Tooltip>

            <Tooltip title="Clear formatting">
              <IconButton
                size="small"
                onClick={() =>
                  editor.chain().focus().unsetAllMarks().clearNodes().run()
                }
              >
                <FormatClear fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Undo">
              <span>
                <IconButton
                  size="small"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Redo">
              <span>
                <IconButton
                  size="small"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        )}

        <div className="editor-content" onClick={handleContainerClick}>
          <EditorContent editor={editor} className="caret-amber-800 " />
        </div>

        {linkOpen && (
          <div className="dialog">
            <h2>Add / Edit Link</h2>
            <input
              autoFocus
              type="url"
              value={linkHref}
              onChange={(e) => setLinkHref(e.target.value)}
              placeholder="https://example.com"
            />
            <div className="dialog-actions">
              <button onClick={() => setLinkOpen(false)}>Cancel</button>
              <button
                onClick={() => {
                  if (linkHref.trim()) {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: linkHref.trim() })
                      .run();
                  } else {
                    editor.chain().focus().unsetLink().run();
                  }
                  setLinkOpen(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {imageOpen && (
          <div className="dialog">
            <h2>Insert Image</h2>
            <input
              autoFocus
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…/image.png"
            />
            <div className="dialog-actions">
              <button onClick={() => setImageOpen(false)}>Cancel</button>
              <button
                onClick={() => {
                  if (imageUrl.trim()) {
                    editor
                      .chain()
                      .focus()
                      .setImage({ src: imageUrl.trim() })
                      .run();
                    setImageUrl("");
                  }
                  setImageOpen(false);
                }}
              >
                Insert
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

EditorComponent.displayName = "EditorComponent";

export default EditorComponent;
