// organisms/PostViewer/PostViewerSkeleton.tsx
import styles from "@/styles/postViewer.module.css";

const PostViewerSkeleton = () => (
    <div className={styles.viewerContainer}>
        <div className={`${styles.viewer} skeleton`} style={{ height: '400px' }} />
    </div>
);

export default PostViewerSkeleton;