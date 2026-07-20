import AppHeader from "../atoms/AppHeading";
import styles from "@/styles/postViewer.module.css"
import UIstyles from "@/styles/ui.module.css"
import AppImage from "../atoms/AppImage";
import AppLink from "../atoms/AppLink";


type Props = {
    title: string,
    authorId: number,
    author: string,
    avatar_url: string,
    createdAt: string,
}

// Content only — likes live in PostInteractionBar, next to the comments.
const PostHeader: React.FC<Props> = ({ title, authorId, author, avatar_url, createdAt }) => {
    const formattedCreatedAt = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return (
        <header className={styles.headerBox} >
            <AppHeader className={styles.postTitle}>{title}</AppHeader>
            <div className={styles.postInfo}>
                <div className={styles.authorContainer}>
                    <p>•By <AppLink to={`/home/profile/${authorId}`} >{author}</AppLink></p>
                    <AppImage src={avatar_url} className={UIstyles.interactiveAvatar} alt="Profile picture"/>
                    <p>• {formattedCreatedAt}</p>
                </div>
            </div>
        </header>
    )
}

export default PostHeader














