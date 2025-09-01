import { INSERT_IMAGE_COMMAND } from "@/lexicalCustom/ImageCommand";
import { useUploadImageMutation } from "@/services/picturesApi";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import styles from '../../styles/ui.module.css'
import '@/styles/editor.css'
import { useCreatePostMutation } from "@/services/blogsApi";

function ImageInsertButton() {
    const [editor] = useLexicalComposerContext();
    const [createPost, { isLoading: submitLoading, error: submitError }] = useCreatePostMutation();
    const [uploadImage, { isLoading: imageLoading, error: imageError }] = useUploadImageMutation();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        let postId;
        if (!file) return;
        console.log(file)

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }
        try {
            try {
                const draft = await createPost({
                    title: '',
                    content: '',
                    status: 'pending',
                }).unwrap();
                postId = draft.id
            } catch (err) {
                console.error("Failed to create draft", err);
            }

            if (postId) {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('postId', postId.toString());
                const response = await uploadImage(formData).unwrap();
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                            src: response,
                            alt: file.name,
                        });
                    }
                })
            }
        }
        catch (e) {
            console.error(e)
        }
    };

    return (
        <div className="image-inputBox">
            <input id="imageUpload" className="image-input" type="file" accept="image/*" onChange={handleFileChange} />
            <button className="toolbar-button">
                <label htmlFor="imageUpload" className="custom-file-label">
                    Add Image
                </label>
            </button>
            {(submitError || imageError) && <p>Failed to upload image.</p>}
            {(submitLoading || imageLoading) && (
                <div className={styles.loaderCenter}>
                    <p className={styles.loaderText}>Loading image...</p>
                    <span className={`${styles.loader} ${styles.loaderMini}`}></span>
                </div>
            )}
        </div>
    )
}
export default ImageInsertButton