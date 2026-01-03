import styles from "@/styles/comments.module.css";

const CommentSkeleton = () => (
    <div className={styles.commentCard}>
        <div className={styles.avatarContainer}>
            <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        </div>
        <div className={styles.contentContainer}>
            <div className="skeleton" style={{ width: '120px', height: '1rem', marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ width: '100%', height: '0.8rem' }} />
        </div>
    </div>
);

export default CommentSkeleton;