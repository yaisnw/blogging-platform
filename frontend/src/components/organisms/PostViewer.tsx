import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { ParagraphNode, RootNode, TextNode } from "lexical";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ImageNode } from "@/lexicalCustom/ImageNode";
import { ImagePlugin } from "@/lexicalCustom/ImagePlugin";
import ContentPlugin from "@/lexicalCustom/ContentPlugin";

type Props = {
    content: string;
};

const theme = {
    paragraph: "viewer-paragraph",
    heading: {
        h1: "viewer-heading-h1",
        h2: "viewer-heading-h2",
        h3: "viewer-heading-h3",
    },
    quote: "viewer-quote",
    text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "strike-through",
    },
};

const Viewer: React.FC<Props> = ({ content }) => {
    const initialConfig = {
        namespace: "PostViewer",
        theme,
        onError: console.error,
        nodes: [TextNode, ParagraphNode, RootNode, HeadingNode, QuoteNode, ImageNode],
        editable: false,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
                <RichTextPlugin
                    contentEditable={<ContentEditable className="editor" />}
                    ErrorBoundary={LexicalErrorBoundary}
                />
            </div>
            <ImagePlugin />
            <ContentPlugin content={content} />
        </LexicalComposer>
    );
};


export default Viewer;
