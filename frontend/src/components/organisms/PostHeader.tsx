import { Link } from "react-router";
import AppHeader from "../atoms/AppHeading";
import HeartButton from "../atoms/HeartButton";
import styles from "@/styles/postViewer.module.css"
import UIstyles from "@/styles/ui.module.css"
import AppImage from "../atoms/AppImage";

type Props = {
    OnLike: () => void
    likeCount: number,
    liked: boolean,
    title: string,
    authorId: number,
    author: string,
    avatar_url: string,
    createdAt: string,
}

const PostHeader: React.FC<Props> = ({ OnLike, likeCount, liked, title, authorId, author, avatar_url, createdAt }) => {
    const formattedCreatedAt = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return (
        <header className={styles.headerBox} >
            <AppHeader className={styles.postTitle}>{title}</AppHeader>
            <div className={styles.postInfo}>
                <div className={styles.heartContainer} >
                    <h2>{likeCount ?? 0}</h2>
                    <HeartButton OnLike={OnLike} editable={true} liked={liked} />
                </div>
                <div className={styles.authorContainer}>
                    <p>By <Link to={`/home/profile/${authorId}`} >{author}</Link></p>
                    <AppImage src={avatar_url} className={UIstyles.avatar} />
                    <p>• {formattedCreatedAt}</p>
                </div>
            </div>
        </header>
    )
}

export default PostHeader














