import { ImageNode } from "@/lexicalCustom/ImageNode";
import { createHeadlessEditor } from "@lexical/headless";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $getRoot, ParagraphNode, RootNode, TextNode } from "lexical";

export function PlainTextFromEditorState(initialStateJSON: string): string {
    try {
        const editor = createHeadlessEditor({
            namespace: "PlainTextExtractor",
            nodes: [TextNode, ParagraphNode, RootNode, HeadingNode, ImageNode, QuoteNode, ]
        });

        const editorState = editor.parseEditorState(initialStateJSON);
        editor.setEditorState(editorState);

        let plainText = "";
        editorState.read(() => {
            plainText = $getRoot().getTextContent();
        });

        return plainText;
    } catch (err) {
        console.error("Error parsing Lexical state:", err);
        return "";
    }
}
