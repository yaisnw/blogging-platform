import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

const ContentPlugin = ({ content }: { content: string }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!content) {
      return;
    }

    try {
      const parsed = JSON.parse(content);
      
      const currentEditorState = editor.getEditorState();
      const nextState = editor.parseEditorState(parsed);

      if (JSON.stringify(currentEditorState.toJSON()) === JSON.stringify(nextState.toJSON())) {
        return;
      }

      editor.update(() => {
        editor.setEditorState(nextState);
      }, { tag: 'initial-load' });

    } catch (err) {
      console.error("Error parsing editor content:", err);
    }

  }, [editor, content]);

  return null;
};

export default ContentPlugin;