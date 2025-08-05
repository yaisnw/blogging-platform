import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import ToolBar from './ToolBar';
import '../../styles/editor.css'
import { ParagraphNode, RootNode, TextNode } from 'lexical';
import type {EditorState} from 'lexical'
import { HeadingNode } from '@lexical/rich-text';
import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ImagePlugin } from '@/lexicalCustom/ImagePlugin';

const theme = {
    ltr: 'ltr',
    rtl: 'rtl',
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'strike-through',
    },
    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3'
    },
    paragraph: 'editor-paragraph'
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
    console.error(error);
}

function MyOnChangePlugin({ onChange }: { onChange: (editorState: EditorState) => void }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState);
        });
    }, [editor, onChange]);
    return null;
}

function Editor() {
    const [editorState, setEditorState] = useState<string | undefined>();
    function onChange(editorState: EditorState) {
        const editorStateJson = editorState.toJSON();
        setEditorState(JSON.stringify(editorStateJson))
    }
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: [
            TextNode,
            ParagraphNode,
            RootNode,
            HeadingNode
        ]
    };
    return (
        <LexicalComposer initialConfig={initialConfig}>
            <ToolBar className='toolBar' />
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        className='editor'

                    />
                }
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <MyOnChangePlugin onChange={onChange} />
            <ImagePlugin/>
        </LexicalComposer>
    );
}
export default Editor