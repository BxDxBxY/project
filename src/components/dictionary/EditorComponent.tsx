"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import {
  Card,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from "@mui/material";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatUnderlined from "@mui/icons-material/FormatUnderlined";
import StrikethroughS from "@mui/icons-material/StrikethroughS";
import Code from "@mui/icons-material/Code";
import FormatQuote from "@mui/icons-material/FormatQuote";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import Checklist from "@mui/icons-material/Checklist";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Undo from "@mui/icons-material/Undo";
import Redo from "@mui/icons-material/Redo";
import TitleIcon from "@mui/icons-material/Title";
import FormatAlignLeft from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenter from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRight from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustify from "@mui/icons-material/FormatAlignJustify";
import HighlightIcon from "@mui/icons-material/Highlight";
import FormatColorText from "@mui/icons-material/FormatColorText";
import FormatClear from "@mui/icons-material/FormatClear";

type Level = 1 | 2 | 3 | 4 | 5 | 6;

type TipTapEditorProps = {
  value?: string; // initial HTML
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  disabled?: boolean;
  className?: string;
};

const ToolbarDivider = () => (
  <Divider orientation="vertical" flexItem className="!mx-1" />
);

const EditorComponent: React.FC<TipTapEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Write something…",
  editable = true,
  disabled = false,
  className = "selection:bg-blue-400 selection:text-white !outline-none !ring-0 focused:border-b-2 focused:border-sky-200",
}) => {
  // Move useRef to top to comply with React hook rules
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // SSR-safe: render only after mount
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
        // history: true,
        // codeBlock: true,
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ inline: false, allowBase64: true }),
      TextStyle,
      Color,
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
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
    immediatelyRender: false, // Fix hydration mismatches
  });

  // Keep editor content in sync if parent updates value
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== undefined && value !== current) {
      // avoid emitting onUpdate again
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  // Reflect heading selection
  useEffect(() => {
    if (!editor) return;
    // Update select when selection changes
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

  const btnVariant = (active: boolean) => (active ? "contained" : "outlined");

  const handleContainerClick = () => {
    if (editor && !disabled) {
      editor.commands.focus();
    }
  };

  if (!mounted) {
    return (
      <Card className="p-4 rounded-2xl shadow-sm min-h-[200px] bg-gray-50">
        Loading editor…
      </Card>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <Card className={`p-3 md:p-4 rounded-2xl shadow-sm ${className}`}>
      {/* Toolbar */}
      {!disabled && (
        <div className="flex flex-wrap items-center gap-1">
          <Select
            size="small"
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
            displayEmpty
            renderValue={(val) => (val === 0 ? "Paragraph" : `H${val}`)}
            className="mr-1"
          >
            <MenuItem value={0}>Paragraph</MenuItem>
            {[1, 2, 3, 4, 5, 6].map((l) => (
              <MenuItem key={l} value={l}>{`Heading ${l}`}</MenuItem>
            ))}
          </Select>

          <ButtonGroup size="small" aria-label="basic formatting">
            <Tooltip title="Bold">
              <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                variant={btnVariant(is("bold"))}
                startIcon={<FormatBold />}
              />
            </Tooltip>
            <Tooltip title="Italic">
              <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                variant={btnVariant(is("italic"))}
                startIcon={<FormatItalic />}
              />
            </Tooltip>
            <Tooltip title="Underline">
              <Button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                variant={btnVariant(is("underline"))}
                startIcon={<FormatUnderlined />}
              />
            </Tooltip>
            <Tooltip title="Strikethrough">
              <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                variant={btnVariant(is("strike"))}
                startIcon={<StrikethroughS />}
              />
            </Tooltip>
            <Tooltip title="Inline code">
              <Button
                onClick={() => editor.chain().focus().toggleCode().run()}
                variant={btnVariant(is("code"))}
                startIcon={<Code />}
              />
            </Tooltip>
            <Tooltip title="Highlight">
              <Button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                variant={btnVariant(is("highlight"))}
                startIcon={<HighlightIcon />}
              />
            </Tooltip>
          </ButtonGroup>

          <ToolbarDivider />

          <ButtonGroup size="small" aria-label="lists">
            <Tooltip title="Bulleted list">
              <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                variant={btnVariant(is("bulletList"))}
                startIcon={<FormatListBulleted />}
              />
            </Tooltip>
            <Tooltip title="Numbered list">
              <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                variant={btnVariant(is("orderedList"))}
                startIcon={<FormatListNumbered />}
              />
            </Tooltip>
            <Tooltip title="Task list">
              <Button
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                variant={btnVariant(is("taskList"))}
                startIcon={<Checklist />}
              />
            </Tooltip>
          </ButtonGroup>

          <ToolbarDivider />

          <ButtonGroup size="small" aria-label="blocks">
            <Tooltip title="Quote">
              <Button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                variant={btnVariant(is("blockquote"))}
                startIcon={<FormatQuote />}
              />
            </Tooltip>
            <Tooltip title="Code block">
              <Button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                variant={btnVariant(is("codeBlock"))}
                startIcon={<TitleIcon />}
              />
            </Tooltip>
            <Tooltip title="Horizontal rule">
              <Button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                variant="outlined"
                startIcon={<HorizontalRuleIcon />}
              />
            </Tooltip>
          </ButtonGroup>

          <ToolbarDivider />

          <ButtonGroup size="small" aria-label="align">
            <Tooltip title="Align left">
              <Button
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                variant={btnVariant(is({ textAlign: "left" } as any))}
                startIcon={<FormatAlignLeft />}
              />
            </Tooltip>
            <Tooltip title="Align center">
              <Button
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                variant={btnVariant(is({ textAlign: "center" } as any))}
                startIcon={<FormatAlignCenter />}
              />
            </Tooltip>
            <Tooltip title="Align right">
              <Button
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                variant={btnVariant(is({ textAlign: "right" } as any))}
                startIcon={<FormatAlignRight />}
              />
            </Tooltip>
            <Tooltip title="Justify">
              <Button
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                variant={btnVariant(is({ textAlign: "justify" } as any))}
                startIcon={<FormatAlignJustify />}
              />
            </Tooltip>
          </ButtonGroup>

          <ToolbarDivider />

          <ButtonGroup size="small" aria-label="links & media">
            <Tooltip title="Add/Edit link">
              <Button
                onClick={() => {
                  const prev = editor.getAttributes("link")?.href ?? "";
                  setLinkHref(prev);
                  setLinkOpen(true);
                }}
                variant={btnVariant(is("link"))}
                startIcon={<LinkIcon />}
              />
            </Tooltip>
            <Tooltip title="Remove link">
              <Button
                onClick={() => editor.chain().focus().unsetLink().run()}
                variant="outlined"
              >
                Unlink
              </Button>
            </Tooltip>
            <Tooltip title="Insert image (URL)">
              <Button
                onClick={() => setImageOpen(true)}
                variant="outlined"
                startIcon={<ImageIcon />}
              />
            </Tooltip>
          </ButtonGroup>

          <ToolbarDivider />

          <div className="flex items-center gap-2">
            <Tooltip title="Text color">
              <label className="flex items-center gap-1 px-2 py-1 border rounded-md">
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
              <Button
                size="small"
                onClick={() =>
                  editor.chain().focus().unsetAllMarks().clearNodes().run()
                }
                variant="outlined"
                startIcon={<FormatClear />}
              >
                Clear
              </Button>
            </Tooltip>
          </div>

          <ToolbarDivider />

          <ButtonGroup size="small" aria-label="history">
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
          </ButtonGroup>
        </div>
      )}

      {/* Content */}
      <div
        ref={editorContainerRef}
        className="mt-3 border rounded-xl p-3 min-h-[220px]"
        onClick={handleContainerClick}
      >
        <EditorContent
          content={value}
          editor={editor}
          className={`prose max-w-none outline-none px-2 ${className || ""}`}
        />
      </div>

      {/* Link dialog */}
      {!disabled && (
        <Dialog
          open={linkOpen}
          onClose={() => setLinkOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add / Edit Link</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="URL"
              type="url"
              fullWidth
              value={linkHref}
              onChange={(e) => setLinkHref(e.target.value)}
              placeholder="https://example.com"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLinkOpen(false)}>Cancel</Button>
            <Button
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
              variant="contained"
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Image dialog */}
      {!disabled && (
        <Dialog
          open={imageOpen}
          onClose={() => setImageOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Insert Image</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Image URL"
              type="url"
              fullWidth
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…/image.png"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImageOpen(false)}>Cancel</Button>
            <Button
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
              variant="contained"
            >
              Insert
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};

EditorComponent.displayName = "EditorComponent";

export default EditorComponent;
