import React, { useState } from "react";
import AppImage from "../atoms/AppImage";
import UIstyles from "@/styles/ui.module.css";
import styles from "@/styles/comments.module.css";
import AppTextArea from "../atoms/AppTextArea";
import AppButton from "../atoms/AppButton";
import { motion } from "motion/react"


type CommentCardProps = {
    commentId: number,
    content: string,
    username: string,
    avatar_url: string,
    createdAt: Date,
    updatedAt: Date,
    editComment?: (commentContent: string, commentId: number) => Promise<void>,
    deleteComment?: (commentId: number) => Promise<void>
} & React.HTMLProps<HTMLDivElement>;

const CommentCard: React.FC<CommentCardProps> = ({
    commentId,
    content,
    username,
    avatar_url,
    createdAt,
    updatedAt,
    editComment,
    deleteComment
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content)

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
            <header className={styles.authorBox}>
                <AppImage className={UIstyles.avatar} src={avatar_url} alt={`${username} avatar`} />
                <h3 id={`comment-${commentId}-author`}>{username}</h3>
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
                            className={styles.commentTextArea}
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
                <div className={styles.interactionBox}>
                    {!isEditing && (
                        <AppButton type="button" onClick={() => setIsEditing(true)}>
                            Edit
                        </AppButton>
                    )}
                    {!isEditing && deleteComment && (
                        <AppButton type="button" onClick={() => deleteComment(commentId)}>
                            Delete
                        </AppButton>
                    )}
                </div>
            </footer>
        </motion.article>
    );
};

export default CommentCard;
