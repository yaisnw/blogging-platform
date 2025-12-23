import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

const ContentPlugin = ({ content }: { content: string }) => {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);
  
  useEffect(() => {
    if (!content || isInitialized.current) {
      return;
    }

    try {
      const parsed = JSON.parse(content);
      const nextState = editor.parseEditorState(parsed);

      editor.update(() => {
        editor.setEditorState(nextState);
      }, { tag: 'initial-load' });

      isInitialized.current = true;
    } catch (err) {
      console.error("Error parsing editor content:", err);
    }
  }, [editor, content]);

  return null;
};

export default ContentPlugin;