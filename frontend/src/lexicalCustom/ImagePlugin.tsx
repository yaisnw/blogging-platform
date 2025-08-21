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
      ({ src, alt }) => {
        const imageNode = $createImageNode(src, alt ?? "");
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          selection.insertNodes([imageNode]);

          const paragraphNode = $createParagraphNode();
          imageNode.insertAfter(paragraphNode);

          paragraphNode.select();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

    return null;
}
