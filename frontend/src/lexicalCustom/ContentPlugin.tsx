import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

const ContentPlugin = ({ content }: { content: string }) => {
  const [editor] = useLexicalComposerContext();
  const initialLoadCompleted = useRef(false);

  useEffect(() => {
    if (!content || initialLoadCompleted.current) {
      return;
    }
    initialLoadCompleted.current = true;

    try {
      const parsed = JSON.parse(content);
      const newState = editor.parseEditorState(parsed);
      
      editor.update(() => {
        editor.setEditorState(newState);
      }, { tag: 'initial-load' });
      
    } catch (err) {
      console.error("Error parsing editor content:", err);
    }

  }, [editor, content]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default ContentPlugin;