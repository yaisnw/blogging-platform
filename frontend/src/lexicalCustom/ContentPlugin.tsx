import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

const ContentPlugin = ({ content }: { content: string }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!content) return;
    editor.update(() => {
      const parsed = JSON.parse(content);
      const editorState = editor.parseEditorState(parsed);
      editor.setEditorState(editorState);
    });
  }, [content, editor]);

  return null;
};
export default ContentPlugin