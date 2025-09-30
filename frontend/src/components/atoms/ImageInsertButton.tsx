import { INSERT_IMAGE_COMMAND } from "@/lexicalCustom/ImageCommand";
import { useUploadImageMutation } from "@/services/picturesApi";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, $getSelection, $insertNodes, $isRangeSelection, $setSelection, type RangeSelection } from "lexical";
import '@/styles/editor.css'
import { useCreatePostMutation } from "@/services/postsApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/hooks";
import { setPostId } from "@/slices/uiSlice";
import { $createLoaderNode } from "@/lexicalCustom/LoaderNode";
import ErrorState from "./ErrorState";

function ImageInsertButton() {
    const dispatch = useAppDispatch();
    const postId = useSelector((state: RootState) => state.ui.postId)
    const [editor] = useLexicalComposerContext();
    const [createPost, {  error: submitError }] = useCreatePostMutation();
    const [uploadImage, {  error: imageError }] = useUploadImageMutation();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        editor.focus();
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }

        let savedSelection: RangeSelection | null = null;

        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                savedSelection = selection.clone();
            }
        });

        let loaderKey: string | null = null;
        editor.update(() => {
            if (savedSelection) {
                $setSelection(savedSelection);
            }
            const loaderNode = $createLoaderNode();
            $insertNodes([loaderNode]);
            loaderKey = loaderNode.getKey();
        });

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
                
            editor.update(() => {
                if (loaderKey) {
                    const loaderNode = $getNodeByKey(loaderKey);
                    if (loaderNode) {
                        loaderNode.remove();
                    }
                }
                if (savedSelection) {
                    $setSelection(savedSelection);
                }
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                    src: response,
                    alt: file.name,
                });
            });
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="image-inputBox">
            <input id="imageUpload" className="image-input" type="file" accept="image/*" onChange={handleFileChange} />
            <label htmlFor="imageUpload" className="custom-file-label toolbar-button">
                Add Image
            </label>

            {(submitError || imageError) && <ErrorState message="failed to add image" />}
        </div>
    )
}
export default ImageInsertButton










// find new method of image uploading that doesnt rely on an existent postId