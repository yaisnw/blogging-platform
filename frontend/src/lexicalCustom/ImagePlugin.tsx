import {  COMMAND_PRIORITY_EDITOR } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $insertNodes } from "lexical";
import { $createImageNode } from "./ImageNode";
import { INSERT_IMAGE_COMMAND } from "./ImageCommand";

export function ImagePlugin() {
    const [editor] = useLexicalComposerContext();
    
    useEffect(() => {
        return editor.registerCommand(
            INSERT_IMAGE_COMMAND,
            ({ src, alt }) => {
                const imageNode = $createImageNode(src, alt ?? '');
                $insertNodes([imageNode]);
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);       

    return null;
}
