import { INSERT_IMAGE_COMMAND } from "@/lexicalCustom/ImageCommand";
import { useUploadImageMutation } from "@/services/picturesApi";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import styles from '../../styles/ui.module.css'
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

function ImageInsertButton() {
    const [editor] = useLexicalComposerContext();
    const [uploadImage, { isLoading, error }] = useUploadImageMutation();
    const postId = useSelector((state: RootState) => state.ui.pendingPostId)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        console.log(file)

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('postId', postId.toString());
            const response = await uploadImage(formData).unwrap();
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                        src: response.url,
                        alt: file.name,
                    });
                }
            })
        }
        catch (e) {
            console.error(e)
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />;
            {isLoading && <span className={styles.loader}></span>}
            {error && <p>Failed to upload image.</p>}
        </div>
    )
}
export default ImageInsertButton