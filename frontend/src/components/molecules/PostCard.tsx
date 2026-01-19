import AppHeader from "../atoms/AppHeading";
import AppImage from "../atoms/AppImage";
import AppParagraph from "../atoms/AppParagraph";
import styles from '../../styles/postCard.module.css'
import UIstyles from '@/styles/ui.module.css'
import { useAppDispatch } from "@/hooks";
import { addDeletingPostIds, setPostId } from "@/slices/uiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetCommentsByPostIdQuery } from "@/services/commentsApi";
import HeartButton from "../atoms/HeartButton";
import { useNavigate } from "react-router";
import AppLoader from "../atoms/AppLoader";
import slugify from "slugify"
import AppButton from "../atoms/AppButton";
import AppInput from "../atoms/AppInput";
import AppLink from "../atoms/AppLink";
import { motion } from "motion/react"
import commentImage from '../../assets/comment.svg'
import EditSVG from "../atoms/EditSVG";
import ViewSVG from "../atoms/ViewSVG";

type PostCardProps = {
    postId: number,
    title: string,
    likeCount: number,
    hasLiked: boolean,
    createdAt: string,
    updatedAt: string,
    status: 'draft' | 'published',
    author?: string,
    authorId?: number,
    avatar_url?: string,
    editButton?: () => void,
    isDeleting?: boolean
}

const PostCard: React.FC<PostCardProps> = ({ postId, title, authorId, author, avatar_url, editButton, likeCount, hasLiked, createdAt, updatedAt, status, isDeleting }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const deletingPostIds = useSelector((state: RootState) => state.ui.deletingPostIds)
    const { data, isLoading } = useGetCommentsByPostIdQuery({ postId, page: 1, limit: 1 });
    const createdDate = new Date(createdAt);
    const updatedDate = new Date(updatedAt);

    const handlePostClick = async (title: string, id: number) => {
        dispatch(setPostId(id))
        navigate(`/home/posts/${id}/${slugify(title, { lower: true, strict: true })}`)
    }


    const formattedCreatedAt = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedUpdatedAt = new Date(updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const isEdited = createdDate.getTime() !== updatedDate.getTime();
    const handleDeleteCheck = (id: number) => {
        dispatch(addDeletingPostIds(id))
    }

    return (
        <motion.article

            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={styles.postCard} aria-labelledby={`post-${postId}-title`}>
            <header className={styles.cardHeader}>
                {isDeleting && (
                        <motion.label
                            initial={{ opacity: 0, }}
                            animate={{ opacity: 1, }}
                            exit={{ opacity: 0, }}
                            transition={{ duration: 0.4 }}
                            className={styles.deleteLabel}>
                            <AppInput
                                checked={deletingPostIds.includes(postId)}
                                onChange={() => handleDeleteCheck(postId)}
                                type="checkbox"
                                aria-label="Select post for deletion"
                            />{" "}
                            Delete
                        </motion.label>
                    )}
                <AppHeader id={`post-${postId}-title`} className={styles.title}>
                    {title}
                </AppHeader>
                <div className={styles.titleSubContainer}>
                    <span className={status === 'published' ? styles.publishedBadge : styles.draftBadge}>
                        {status?.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
            </header>

            <section className={styles.postMeta} aria-label="Post meta">
                <div className={styles.engagementBox}>
                    <div className={styles.engagementContent}>
                        <AppParagraph>{likeCount}</AppParagraph>
                        <HeartButton className={styles.postCardImage} liked={hasLiked} editable={false} />
                    </div>

                    <div className={styles.engagementContent}>
                        {isLoading ? <AppLoader mode="mini" /> : <AppParagraph>{data?.comments.length ?? 0}</AppParagraph>}
                        <AppImage className={styles.postCardImage} src={commentImage} alt="comment icon" />
                    </div>
                </div>

                {author && (
                    <div className={styles.authorBox}>
                        <AppParagraph>
                            By <AppLink to={`/home/profile/${authorId}`}>{author}</AppLink>
                        </AppParagraph>
                        <AppImage loading="lazy" onClick={() => navigate(`/home/profile/${authorId}`)} className={UIstyles.interactiveAvatar} src={avatar_url} alt={`${author} avatar`} />
                    </div>
                )}
            </section>

            <footer className={styles.cardFooter}>
                <div className={styles.footerDate}>
                    <time dateTime={new Date(createdAt).toISOString()}>Created: {formattedCreatedAt}</time>
                    {isEdited && <time dateTime={new Date(updatedAt).toISOString()}>Updated: {formattedUpdatedAt}</time>}
                </div>

                <div className={styles.interactionBox}>

                    {editButton && (
                        <AppButton  type="button" onClick={editButton}>
                            <EditSVG className={UIstyles.buttonSVG} />
                            Edit Post
                        </AppButton>
                    )}
                    {status === 'published' && (
                        <AppButton type="button" onClick={() => handlePostClick(title, postId)}>
                            <ViewSVG className={UIstyles.buttonSVG} />
                            View Post
                        </AppButton>
                    )}

                </div>
            </footer>
        </motion.article>
    );
}

export default PostCard;