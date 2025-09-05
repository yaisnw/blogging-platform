import AppHeader from "../atoms/AppHeader";
import AppImage from "../atoms/AppImage";
import AppParagraph from "../atoms/AppParagraph";
import styles from '../../styles/postCard.module.css'
import UIstyles from '@/styles/ui.module.css'
import type { MouseEventHandler } from "react";
import { useAppDispatch } from "@/hooks";
import { addDeletingPostIds } from "@/slices/uiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetCommentsByPostIdQuery } from "@/services/commentsApi";

type PostCardProps = {
    postId: number,
    title: string,
    likeCount: number,
    createdAt: string,
    updatedAt: string,
    status: 'draft' | 'published',
    author?: string,
    editButton?: () => void,
    viewButton?: MouseEventHandler<HTMLButtonElement>,
    isDeleting?: boolean
}

const PostCard: React.FC<PostCardProps> = ({ postId, title, author, editButton, likeCount, createdAt, updatedAt, status, viewButton, isDeleting }) => {
    const dispatch = useAppDispatch();
    const deletingPostIds = useSelector((state: RootState) => state.ui.deletingPostIds)
    const { data, isLoading } = useGetCommentsByPostIdQuery(postId);
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

    const handleDeleteCheck = (id: number) => {
        dispatch(addDeletingPostIds(id))
    }

    return (
        <div className={styles.postCard} >
            <AppHeader className={styles.title}>
                {title}
            </AppHeader>
                <span className={status === 'published' ? styles.publishedBadge : styles.draftBadge} >{status?.charAt(0).toUpperCase() + status.slice(1)}</span>
            <section className={styles.postMeta} >
                <section className={styles.engagementBox}>
                    <div className={styles.engagementContent}>
                        <AppParagraph>{likeCount}</AppParagraph>
                        <AppImage className={styles.postCardImage} src="/heart.svg" alt="Heart" />
                    </div>
                    <div className={styles.engagementContent}>
                        {isLoading ? <span className={`${UIstyles.loader} ${UIstyles.miniLoader}`} ></span> : <AppParagraph>{data?.comments.length}</AppParagraph>}
                        <AppImage className={styles.postCardImage} src="/comment.svg" alt='text box' />
                    </div>
                </section>

                {author && <p>By {author}</p>}

            </section>
            <div className={styles.cardFooter} >
                <div className={styles.footerDate} >
                    <p>Created: {formattedCreatedAt}</p>
                    <p>Updated: {formattedUpdatedAt}</p>
                </div>
                <div className={styles.interactionBox} >
                    {isDeleting && <label>
                        <input checked={deletingPostIds.includes(postId)} onChange={() => handleDeleteCheck(postId)} type="checkbox" /> Delete
                    </label>}
                    {editButton && <button onClick={editButton}>Edit Post</button>}
                    <button onClick={viewButton}>View Post</button>
                </div>
            </div>
        </div>
    )
}

export default PostCard;