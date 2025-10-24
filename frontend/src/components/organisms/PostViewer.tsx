import { LexicalComposer } from "@lexical/react/LexicalComposer";
import styles from "@/styles/postViewer.module.css"
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
    ltr: "ltr",
    rtl: "rtl",
    quote: "editor-quote",
    text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "strike-through",
    },
    heading: {
        h1: "editor-heading-h1",
        h2: "editor-heading-h2",
        h3: "editor-heading-h3",
    },
    paragraph: "editor-paragraph",
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
            <div className={styles.viewerContainer}>
                <RichTextPlugin
                    contentEditable={<ContentEditable className={styles.viewer} />}
                    ErrorBoundary={LexicalErrorBoundary}
                />
            </div>
            <ImagePlugin />
            <ContentPlugin content={content} />
        </LexicalComposer>
    );
};


export default Viewer;
