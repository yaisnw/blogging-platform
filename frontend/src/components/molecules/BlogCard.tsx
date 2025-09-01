import AppHeader from "../atoms/AppHeader";
import AppImage from "../atoms/AppImage";
import AppParagraph from "../atoms/AppParagraph";
import styles from '../../styles/blogCard.module.css'
import UIstyles from '@/styles/ui.module.css'
import type { MouseEventHandler } from "react";
import { useAppDispatch } from "@/hooks";
import { addDeletingPostIds } from "@/slices/uiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetCommentsByPostIdQuery } from "@/services/commentsApi";

type BlogCardProps = {
    postId: number,
    title: string,
    likeCount: number,
    createdAt: string,
    editButton: () => void,
    viewButton: MouseEventHandler<HTMLButtonElement>,
    isDeleting: boolean
}

const BlogCard: React.FC<BlogCardProps> = ({ postId, title, editButton, likeCount, createdAt, viewButton, isDeleting }) => {
    const dispatch = useAppDispatch();
    const deletingPostIds = useSelector((state: RootState) => state.ui.deletingPostIds)
    const {data, isLoading} = useGetCommentsByPostIdQuery(postId);
    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleDeleteCheck = (id: number) => {
        dispatch(addDeletingPostIds(id))
    }

    return (
        <div className={styles.blogCard} >
            <AppHeader className={styles.title}>{title}</AppHeader>
            <section className={styles.engagementBox}>
                <div className={styles.engagementContent}>
                    <AppParagraph>{likeCount}</AppParagraph>
                    <AppImage className={styles.blogCardImage} src="/heart.svg" alt="Heart" />
                </div>
                <div className={styles.engagementContent}>

                    {isLoading ? <span className={`${UIstyles.loader} ${UIstyles.miniLoader}`} ></span> : <AppParagraph>{data?.comments.length}</AppParagraph>}
                    <AppImage className={styles.blogCardImage} src="/comment.svg" alt='text box' />
                </div>
            </section>
            <div className={styles.cardFooter} >
                <p>{formattedDate}</p>
                <div className={styles.interactionBox} >
                    {isDeleting && <label>
                        <input checked={deletingPostIds.includes(postId)} onChange={() => handleDeleteCheck(postId)} type="checkbox" /> Delete
                    </label>}
                    <button onClick={editButton}>Edit Post</button>
                    <button onClick={viewButton}>View Post</button>
                </div>
            </div>
        </div>
    )
}

export default BlogCard;