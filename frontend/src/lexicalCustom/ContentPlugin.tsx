import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

const ContentPlugin = ({ content }: { content: string }) => {
  const [editor] = useLexicalComposerContext();
  const initialized = useRef(false);

  useEffect(() => {
    if (!content) return;

    try {
      const parsed = JSON.parse(content);
      const newState = editor.parseEditorState(parsed);

      editor.update(() => {
        editor.setEditorState(newState);
      });

      initialized.current = true;
    }
    catch (err) {
    console.error("Error parsing editor content:", err);
  }
}, [content, editor]);

return null;
};

export default ContentPlugin;
