import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import ToolBar from './ToolBar';
import '../../styles/editor.css'
import { ParagraphNode, RootNode, TextNode } from 'lexical';
import type { EditorState } from 'lexical'
import { HeadingNode } from '@lexical/rich-text';
import React, { useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ImagePlugin } from '@/lexicalCustom/ImagePlugin';
import { ImageNode } from '@/lexicalCustom/ImageNode';
import { useCreatePostMutation } from '@/services/blogsApi';
import { useNavigate } from 'react-router';
import styles from '../../styles/ui.module.css'
import { setPostId } from '@/slices/uiSlice';
import { useAppDispatch } from '@/hooks';
import type { RootState } from "@/store";
import { useSelector } from 'react-redux';


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
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'pending' | 'completed'>('completed')
    const [title, setTitle] = useState<string>();
    const [editorState, setEditorState] = useState<string | undefined>();
    const [createPost, { isLoading, error }] = useCreatePostMutation();
    const postId = useSelector((state: RootState) => state.ui.pendingPostId);

    useEffect(() => {
        console.log(postId)
        if(postId) return;

        const createDraft = async () => {
            try {
                const draft = await createPost({
                    title: title ?? '',
                    content: editorState ?? '',
                    status: 'pending',
                }).unwrap();
                console.log(draft)
                dispatch(setPostId(draft.id));
            } catch (err) {
                console.error("Failed to create draft", err);
            }
        };

        createDraft();
    }, [postId, createPost, dispatch, title, editorState]);

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
            HeadingNode,
            ImageNode
        ]
    };

    const handleSubmit = async (title: string, content: string, status: 'pending' | 'completed') => {
        if (title) {
            await createPost({ title, content, status }).unwrap();
            navigate('/home/myBlogs')
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setTitle(e.target.value)
    }

    return isLoading ? (
        <span className={styles.loader}></span>
    ) : (
        <LexicalComposer initialConfig={initialConfig}>
            <ToolBar className='toolBar' />
            <form className='post-form'>
                <input onChange={handleChange} value={title} type='text' max={20} className='post-input'></input>
                <button className='submit-button' onClick={() => (editorState && title) && handleSubmit(title, editorState, status)}>Submit</button>
                {error && <div className='submit-error'>Could not submit post.</div>}
            </form>
            <div className='editor-container'>
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            className='editor'

                        />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
            </div>
            <HistoryPlugin />
            <AutoFocusPlugin />
            <MyOnChangePlugin onChange={onChange} />
            <ImagePlugin />
        </LexicalComposer>
    )
}
export default Editor