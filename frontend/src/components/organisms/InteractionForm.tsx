import styles from "@/styles/interactionForm.module.css"
import AppButton from "../atoms/AppButton";
import AppLabel from "../atoms/AppLabel";
import AppTextArea from "../atoms/AppTextArea";
import HeartButton from "../atoms/HeartButton";

type CommentFormProps = {
    likeCount: number,
    liked: boolean,
    OnLike: () => void
} & React.FormHTMLAttributes<HTMLFormElement>;

const CommentForm: React.FC<CommentFormProps> = ({ likeCount, liked, OnLike, ...props }) => {
    return (
        <div className={styles.interactionFlex}>
            <form className={styles.commentForm} {...props}>
                <AppLabel htmlFor="comment" >Share your thoughts:</AppLabel>
                <div className={styles.commentInputs} >
                    <AppTextArea className={styles.commentText} name="comment" />
                    <AppButton className={styles.commentButton} >Submit</AppButton>
                </div>
            </form>
            <div className={styles.heartContainer} >
                <h2>{likeCount ?? 0}</h2>
                <HeartButton OnLike={OnLike} editable={true} liked={liked} />
            </div>
        </div>
    )
}

export default CommentForm;