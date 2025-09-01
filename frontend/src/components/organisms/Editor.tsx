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
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ImagePlugin } from '@/lexicalCustom/ImagePlugin';
import { ImageNode } from '@/lexicalCustom/ImageNode';
import { useCreatePostMutation, useLazyGetPostByIdQuery, useUpdatePostMutation } from '@/services/blogsApi';
import { useNavigate, useParams } from 'react-router';
import styles from '../../styles/ui.module.css'
import type { RootState } from "@/store";
import { useSelector } from 'react-redux';


const theme = {
    ltr: 'ltr',
    rtl: 'rtl',
    quote: 'editor-quote',
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

function DraftPlugin({ draftResult }: { draftResult: string }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        if (!draftResult) return;
        editor.update(() => {
            const parsed = JSON.parse(draftResult)
            const editorState = editor.parseEditorState(parsed);
            editor.setEditorState(editorState);
        });
    }, [draftResult, editor])
    return null
}

function Editor() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'pending' | 'completed'>('completed')
    const [title, setTitle] = useState<string>();
    const [editorState, setEditorState] = useState<string | undefined>();
    const [draftResult, setDraftResult] = useState<string>();
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [createPost, { isLoading: submitLoading, error: submitError }] = useCreatePostMutation();
    const [updatePost, { isLoading: updateLoading, error: updateError }] = useUpdatePostMutation();
    const [trigger, { isLoading: editLoading, error: editError }] = useLazyGetPostByIdQuery();
    const postId = useSelector((state: RootState) => state.ui.pendingPostId);
    const { id } = useParams();


    useEffect(() => {
        const getDraft = async () => {
            if (id) {
                const result = await trigger(Number(id));
                if (result.data) {
                    const draftJson = result.data.content;
                    setTitle(result.data.title);
                    setIsUpdating(true);
                    if (typeof draftJson === "string") {
                        console.log(draftJson)
                        try {
                            setDraftResult(draftJson)

                        } catch (err) {
                            console.error("Failed to parse draft JSON:", err);
                            return;
                        }
                    }
                }
            }
        };

        getDraft();
    }, [id, trigger]);


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
            ImageNode,
            QuoteNode
        ]
    };

    const handleSubmit = async (title: string, content: string, status: 'pending' | 'completed') => {
        if (title) {
            await createPost({ title, content, status }).unwrap();
            navigate('/home/myBlogs')
        }
    }
    const handleUpdate = async (postId: number, title: string, content: string, status: 'pending' | 'completed') => {
        const result = await updatePost({ postId, title, content, status }).unwrap();
        if (result) {
            navigate('/home/myBlogs')
        }

    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setTitle(e.target.value)
    }

    return submitLoading || editLoading || updateLoading ? (
        <div className={styles.loaderCenter}>
            <span className={styles.loader}></span>
        </div>
    ) : (
        <LexicalComposer initialConfig={initialConfig}>
            <ToolBar className='toolBar' />
            <form className='post-form'>
                <input maxLength={80} name='title' onChange={handleChange} value={title ?? ''} type='text' max={20} className='post-input'></input>
                <button type='button' className='submit-button' onClick={(e) => {
                    e.preventDefault();
                    if (isUpdating && editorState && title) {
                        handleUpdate(postId, title, editorState, status);
                    } else if (editorState && title) {
                        handleSubmit(title, editorState, status);
                    }
                }}>{isUpdating ? 'Update' : 'Submit'}</button>
                <label>
                    <input checked={status === 'completed'} onChange={() => setStatus(status === 'completed' ? 'pending' : 'completed')} type="checkbox" /> Save as draft
                </label>
                {submitError && <div className='submit-error'>Could not submit post.</div>}
                {editError && <div className='submit-error'>Could not retrieve draft.</div>}
                {updateError && <div className='submit-error'>Could not update post.</div>}
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
            <DraftPlugin draftResult={draftResult ? draftResult : ''} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <MyOnChangePlugin onChange={onChange} />
            <ImagePlugin />
        </LexicalComposer>
    )
}
export default Editor