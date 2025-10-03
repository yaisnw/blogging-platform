import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

const ContentPlugin = ({ content }: { content: string }) => {
  const [editor] = useLexicalComposerContext();
  const initialized = useRef(false);

  useEffect(() => {
    if (!content || initialized.current) return;

    editor.update(() => {
      const parsed = JSON.parse(content);
      const editorState = editor.parseEditorState(parsed);
      editor.setEditorState(editorState);
      initialized.current = true; 
    });
  }, [content, editor]);

  return null;
};

export default ContentPlugin;
