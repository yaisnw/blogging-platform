import { $createParagraphNode, $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $createImageNode } from "./ImageNode";
import { INSERT_IMAGE_COMMAND } from "./ImageCommand";

export function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      ({ src, alt, width }) => {
        editor.update(() => {
          const defaultWidth = width || 300;
          const imageNode = $createImageNode(src ?? "", alt ?? "", defaultWidth);
          const paragraphNode = $createParagraphNode();
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            selection.insertNodes([imageNode, paragraphNode]);

            paragraphNode.select();
          }
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
