import styles from "@/styles/comments.module.css"
import AppButton from "../atoms/AppButton";
import AppLabel from "../atoms/AppLabel";
import AppTextArea from "../atoms/AppTextArea";

type CommentForm = {
    commentContent: string,
    setCommentContent: React.Dispatch<React.SetStateAction<string | undefined>>,
    submitComment: (commentContent: string) => Promise<void>,
} & React.FormHTMLAttributes<HTMLFormElement>;

const CommentForm: React.FC<CommentForm> = ({ commentContent, setCommentContent, submitComment }) => {
    return (
        <form className={styles.commentFormFlex} onSubmit={(e) => {
            e.preventDefault();
            submitComment(commentContent);
        }}>
            <div className={styles.commentFormHeader}>
                <h1>
                    Comments
                </h1>
                <AppButton className={styles.commentButton} type="submit">
                    Submit
                </AppButton>
            </div>
            <AppLabel htmlFor="comment" >Share your thoughts:</AppLabel>
            <div className={styles.commentInputs} >
                <AppTextArea value={commentContent} onChange={(e) => setCommentContent(e.target.value)} className={styles.commentTextArea} id="comment" name="comment" />
            </div>
        </form>
    )
}

export default CommentForm;