import React, { useState } from "react";
import AppImage from "../atoms/AppImage";
import UIstyles from "@/styles/ui.module.css";
import styles from "@/styles/comments.module.css";
import AppTextArea from "../atoms/AppTextArea";
import AppButton from "../atoms/AppButton";
import { motion } from "motion/react"
import AppLink from "../atoms/AppLink";
import { useAppDispatch } from "@/hooks";
import { setPostId } from "@/slices/uiSlice";
import { setDraftTitle } from "@/slices/draftPostSlice";
import slugify from "slugify"
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

type CommentCardProps = {
    postId?: number,
    postTitle?: string,
    commentId: number,
    content: string,
    username: string,
    authorId?: number,
    avatar_url: string,
    createdAt: Date,
    updatedAt: Date,
    editComment?: (commentContent: string, commentId: number) => Promise<void>,
    deleteComment?: (commentId: number) => Promise<void>
} & React.HTMLProps<HTMLDivElement>;

const CommentCard: React.FC<CommentCardProps> = ({
    postId,
    postTitle,
    commentId,
    content,
    username,
    authorId,
    avatar_url,
    createdAt,
    updatedAt,
    editComment,
    deleteComment
}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { pathname } = location;
    const isOnProfilePage = pathname.startsWith('/home/profile');
    const {id} = useSelector((state: RootState) => state.auth.user);
    const isAuthor = authorId === id;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content)
    const slug = slugify(postTitle ?? "", { lower: true, strict: true })

    const handlePostClick = async (id: number) => {
        dispatch(setPostId(id))
        dispatch(setDraftTitle(postTitle ?? ""))
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
    return (
        <motion.article
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={styles.commentCard} aria-labelledby={`comment-${commentId}-author`}>
            <header className={styles.header}>
                <div className={styles.authorBox}>
                    <AppImage className={!isOnProfilePage ? UIstyles.interactiveAvatar : UIstyles.avatar} onClick={isOnProfilePage ? () => undefined : () => navigate(`/home/profile/${authorId}`)} src={avatar_url} alt={`${username} avatar`} />
                    {!isOnProfilePage ? <AppLink to={`/home/profile/${authorId}`} onClick={() => handlePostClick(authorId ?? 0)} className={styles.username} id={`comment-${commentId}-author`}>{username}</AppLink> :
                        <h3 id={`comment-${commentId}-author`}>{username}</h3>}
                </div>
               {isOnProfilePage &&  <AppLink to={`/home/posts/${postId}/${slug}`} onClick={() => handlePostClick(postId ?? 0)} >Go To Post</AppLink>}
            </header>

            <div className={styles.commentBody}>
                {isEditing ? (
                    <form
                        className={styles.editBox}
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (editComment) editComment(editContent, commentId);
                            setIsEditing(false);
                        }}
                    >
                        <AppTextArea
                            value={editContent}
                            onChange={(e) => {
                                setEditContent(e.target.value);
                                e.currentTarget.style.height = "auto";
                                e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                            }}
                            className={styles.commentText}
                            name="comment"
                            aria-label="Edit comment"
                        />
                        <div className={styles.editActions}>
                            <AppButton type="submit">Submit</AppButton>
                            <AppButton type="button" onClick={() => setIsEditing(false)}>
                                Cancel
                            </AppButton>
                        </div>
                    </form>
                ) : (
                    <p>{content}</p>
                )}
            </div>

            <footer className={styles.footer}>
                <time className={styles.commentDate} dateTime={new Date(createdAt).toISOString()}>
                    {formattedCreatedAt}
                </time>
                {createdAt !== updatedAt && (
                    <time className={styles.commentDate} dateTime={new Date(updatedAt).toISOString()}>
                        Edited: {formattedUpdatedAt}
                    </time>
                )}
                { !isOnProfilePage && isAuthor && editComment && deleteComment && (
                    <div className={styles.commentActions}>
                        <AppButton type="button" onClick={() => setIsEditing(true)}>Edit</AppButton>
                        <AppButton type="button" onClick={() => deleteComment(commentId)}>Delete</AppButton>
                    </div>
                )}
            </footer>
        </motion.article>
    );
};

export default CommentCard;
