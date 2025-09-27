import { Link } from "react-router";
import AppHeader from "../atoms/AppHeader";
import HeartButton from "../atoms/HeartButton";
import styles from "@/styles/postViewer.module.css"

type Props = {
    OnLike: () => void
    likeCount: number,
    liked: boolean,
    title: string,
    authorId: number,
    author: string
}

const PostHeader: React.FC<Props> = ({ OnLike, likeCount, liked, title, authorId, author }) => {
    return (
        <div className={styles.headerBox} >
            <AppHeader className={styles.postTitle}>{title}</AppHeader>
            <div className={styles.postInfo}>
                <div className={styles.heartContainer} >
                    <h2>{likeCount ?? 0}</h2>
                    <HeartButton OnLike={OnLike} editable={true} liked={liked} />
                </div>
                <Link to={`/home/profile/${authorId}`} >By {author}</Link>
            </div>
        </div>
    )
}

export default PostHeader














// redirect to profile page when clicked on author name