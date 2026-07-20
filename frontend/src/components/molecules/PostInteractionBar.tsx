import styles from "@/styles/postViewer.module.css";
import { HeartSVG } from "../atoms/Icons";

type Props = {
    OnLike: () => void;
    likeCount: number;
    liked: boolean;
    commentCount: number;
    canLike?: boolean;
};

/**
 * Groups the post's interactions (like, comment count) into one bar that sits
 * between the post body and the comments. Keeps the header purely content —
 * title, author, date — instead of interleaving an action into it.
 */
const PostInteractionBar: React.FC<Props> = ({ OnLike, likeCount, liked, commentCount, canLike = true }) => {
    const count = likeCount ?? 0;

    return (
        <div className={styles.interactionBar}>
            <button
                type="button"
                className={`${styles.likeButton} ${liked ? styles.likeButtonActive : ''}`}
                onClick={OnLike}
                aria-pressed={canLike ? liked : undefined}
                aria-label={
                    canLike
                        ? `${liked ? 'Unlike' : 'Like'} this post. ${count} ${count === 1 ? 'like' : 'likes'}.`
                        : `${count} ${count === 1 ? 'like' : 'likes'}. Log in to like this post.`
                }
                title={canLike ? (liked ? 'Unlike this post' : 'Like this post') : 'Log in to like this post'}
            >
                {/* editable drives the pointer cursor. No OnLike here — the
                    wrapping button owns the click, so passing it would double-fire. */}
                <HeartSVG className={styles.interactiveImage} editable liked={liked} />
                <span className={styles.likeCount}>
                    {count} {count === 1 ? 'like' : 'likes'}
                </span>
            </button>

            <span className={styles.interactionDivider} aria-hidden="true" />

            <span className={styles.interactionMeta}>
                {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
            </span>
        </div>
    );
};

export default PostInteractionBar;
