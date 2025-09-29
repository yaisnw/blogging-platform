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
import HeartButton from "../atoms/HeartButton";
import { Link } from "react-router";

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
    viewButton?: MouseEventHandler<HTMLButtonElement>,
    isDeleting?: boolean
}

const PostCard: React.FC<PostCardProps> = ({ postId, title, authorId, author, avatar_url, editButton, likeCount, hasLiked, createdAt, updatedAt, status, viewButton, isDeleting }) => {
    const dispatch = useAppDispatch();
    const deletingPostIds = useSelector((state: RootState) => state.ui.deletingPostIds)
    const { data, isLoading } = useGetCommentsByPostIdQuery(postId);
    const createdDate = new Date(createdAt);
    const updatedDate = new Date(updatedAt);

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
        <div className={styles.postCard} >
            <AppHeader className={styles.title}>
                {title}
            </AppHeader>
            <span className={status === 'published' ? styles.publishedBadge : styles.draftBadge} >{status?.charAt(0).toUpperCase() + status.slice(1)}</span>
            <section className={styles.postMeta} >
                <section className={styles.engagementBox}>
                    <div className={styles.engagementContent}>
                        <AppParagraph>{likeCount}</AppParagraph>
                        <HeartButton liked={hasLiked} editable={false} />
                    </div>
                    <div className={styles.engagementContent}>
                        {isLoading ? <span className={`${UIstyles.loader} ${UIstyles.miniLoader}`} ></span> : <AppParagraph>{data?.comments.length}</AppParagraph>}
                        <AppImage className={styles.postCardImage} src="/comment.svg" alt='text box' />
                    </div>
                </section>

                {author &&
                    <div className={styles.authorBox} >
                        <p>By <Link to={`/home/profile/${authorId}`} >{author}</Link></p>
                        <img className={UIstyles.avatar} src={avatar_url} alt="default avatar" />
                    </div>
                }

            </section>
            <div className={styles.cardFooter} >
                <div className={styles.footerDate} >
                    <p>Created: {formattedCreatedAt}</p>
                    {isEdited && <p>Updated: {formattedUpdatedAt}</p>}
                </div>
                <div className={styles.interactionBox} >
                    {isDeleting && <label>
                        <input checked={deletingPostIds.includes(postId)} onChange={() => handleDeleteCheck(postId)} type="checkbox" /> Delete
                    </label>}
                    {editButton && <button onClick={editButton}>Edit Post</button>}
                    {status === 'published' && <button onClick={viewButton}>View Post</button>}
                </div>
            </div>
        </div>
    )
}

export default PostCard;