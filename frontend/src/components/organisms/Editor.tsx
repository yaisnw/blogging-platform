import React, { useEffect } from "react";
import {
  useLexicalComposerContext
} from "@lexical/react/LexicalComposerContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import '@/styles/editor.css'
import ToolBar from "@/components/organisms/ToolBar";
import { ImagePlugin } from "@/lexicalCustom/ImagePlugin";
import { ImageNode } from "@/lexicalCustom/ImageNode";
import { ParagraphNode, RootNode, TextNode, type EditorState } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import ContentPlugin from "@/lexicalCustom/ContentPlugin";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import AppButton from "../atoms/AppButton";

type Props = {
  title: string;
  status: 'draft' | 'published';
  draftResult: string;
  isUpdating: boolean;
  onTitleChange: (val: string) => void;
  onStatusChange: (val: 'draft' | 'published') => void;
  onEditorChange: (val: string) => void;
  onSubmit: () => void;
};

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  quote: "editor-quote",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "strike-through",
  },
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
  },
  paragraph: "editor-paragraph",
};

function onError(error: Error) {
  console.error(error);
}

const Editor: React.FC<Props> = ({
  title,
  status,
  draftResult,
  isUpdating,
  onTitleChange,
  onStatusChange,
  onEditorChange,
  onSubmit,
}) => {
  const loading = useSelector((state: RootState) => state.ui.imageUploading)

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [TextNode, ParagraphNode, RootNode, HeadingNode, ImageNode, QuoteNode,],
  };

  const handleChangeEditor = (editorState: EditorState) => {
    const json = JSON.stringify(editorState.toJSON());
    onEditorChange(json);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolBar />
      <form className="header-form">
        <input
          type="text"
          maxLength={100}
          className="header-input"
          value={title}
          required
          onChange={(e) => onTitleChange(e.target.value)}

        />
        <div className="header-submit">
          <AppButton type="button" className="submit-button" onClick={onSubmit}>
            {isUpdating ? "Update" : "Submit"}
          </AppButton>
          <label>
            <input
              type="checkbox"
              checked={status === "draft"}
              onChange={() =>
                onStatusChange(status === "published" ? "draft" : "published")
              }
            />{" "}
            Save as draft
          </label>
        </div>
      </form>

      <div className="editor-container" style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <RichTextPlugin contentEditable={<ContentEditable className="editor" />} ErrorBoundary={LexicalErrorBoundary} />
      </div>

      <ContentPlugin content={draftResult || ""} />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <MyOnChangePlugin onChange={handleChangeEditor} />
      <ImagePlugin />
    </LexicalComposer>
  );
};

const MyOnChangePlugin = ({ onChange }: { onChange: (state: EditorState) => void }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => onChange(editorState));
  }, [editor, onChange]);
  return null;
};

export default Editor;
