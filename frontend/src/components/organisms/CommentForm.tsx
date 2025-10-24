import styles from "@/styles/postViewer.module.css"
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
        <section className={styles.interactionFlex}>
            <h1>
                Comments
            </h1>
            <form
                className={styles.commentForm}
                onSubmit={(e) => {
                    e.preventDefault();
                    submitComment(commentContent);
                }}
            >
                <AppLabel htmlFor="comment" >Share your thoughts:</AppLabel>
                <div className={styles.commentInputs} >
                    <AppTextArea value={commentContent} onChange={(e) => setCommentContent(e.target.value)} className={styles.commentText} name="comment" />
                    <AppButton className={styles.commentButton} >Submit</AppButton>
                </div>
            </form>
        </section>
    )
}

export default CommentForm;