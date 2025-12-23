import { useUploadImageMutation } from "@/services/picturesApi";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $setSelection, type BaseSelection } from "lexical";
import '@/styles/editor.css'
import UIstyles from "@/styles/ui.module.css"
import { useCreatePostMutation, useUpdatePostMutation } from "@/services/postsApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/hooks";
import { setImageUploading, setPostId } from "@/slices/uiSlice";
import ErrorState from "./ErrorState";
import { INSERT_IMAGE_COMMAND } from "@/lexicalCustom/ImageCommand";
import AppLoader from "./AppLoader";
import { createPortal } from "react-dom";

function ImageInsertButton() {
    const dispatch = useAppDispatch();
    const postId = useSelector((state: RootState) => state.ui.postId)
    const [editor] = useLexicalComposerContext();
    const [createPost, { error: submitError }] = useCreatePostMutation();
    const [updatePost, { error: updateError }] = useUpdatePostMutation();
    const [uploadImage, { error: imageError }] = useUploadImageMutation();
    const loading = useSelector((state: RootState) => state.ui.imageUploading)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        editor.focus();
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }
        let savedSelection: BaseSelection | undefined = undefined;
        editor.update(() => {
            savedSelection = $getSelection()?.clone();

        })
        dispatch(setImageUploading(true))
        try {
            let postIdValue = postId;
            if (!postIdValue) {
                const draft = await createPost({
                    title: '',
                    content: '',
                    status: 'draft',
                }).unwrap();
                dispatch(setPostId(draft.id));
                postIdValue = draft.id;
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('postId', postIdValue.toString());
            const response = await uploadImage(formData).unwrap();
            editor.focus(() => {
                editor.update(() => {
                    if ($isRangeSelection(savedSelection)) {
                        $setSelection(savedSelection);
                    }

                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                        src: response,
                        alt: file.name,
                    });
                }, {
                    onUpdate: async () => {
                        const currentContent = JSON.stringify(editor.getEditorState().toJSON());

                        try {
                            await updatePost({
                                postId: postIdValue as number,
                                content: currentContent,
                            }).unwrap();
                        } catch (e) {
                            console.error("Background save failed", e);
                        } finally {
                            dispatch(setImageUploading(false));
                        }
                    }
                });
            })

        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="image-inputBox">
            <input id="imageUpload" className="image-input" type="file" accept="image/*" onChange={handleFileChange} />
            <label className={`${UIstyles.appButton} ${UIstyles.primary} toolbar-button `} htmlFor="imageUpload" >
                Add Image
            </label>

            {(submitError || imageError || updateError) && <ErrorState message="failed to add image" />}
            {loading && createPortal(
                <AppLoader mode="page" />,
                document.body
            )}
        </div>
    )
}
export default ImageInsertButton

