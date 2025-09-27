import React, { useState } from "react";
import AppImage from "../atoms/AppImage";
import UIstyles from "@/styles/ui.module.css";
import styles from "@/styles/comments.module.css";
import AppTextArea from "../atoms/AppTextArea";
import AppButton from "../atoms/AppButton";

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
        <div className={styles.commentCard}>
            <div className={styles.authorBox}>
                <AppImage className={UIstyles.avatar} src={avatar_url} />
                <h3>{username}</h3>
            </div>
            <div className={styles.commentBody}>
                {
                    isEditing
                        ?
                        <div className={styles.editBox} >
                            <AppTextArea value={editContent} onChange={(e) => {
                                setEditContent(e.target.value)
                                e.currentTarget.style.height = "auto"; 
                                e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                            }} className={styles.commentTextArea} name="comment" />
                        </div>
                        :
                        <p >{content}</p>
                }
            </div>
            <div className={styles.footer}>
                <p className={styles.commentDate}>{formattedCreatedAt}</p>
                {createdAt !== updatedAt && <p className={styles.commentDate}>Edited: {formattedUpdatedAt}</p>}
                <div className={styles.interactionBox}>
                    {!isEditing && <button onClick={() => setIsEditing(true)} >Edit</button>}
                    {(!isEditing && deleteComment) && <button onClick={() => deleteComment(commentId)} >Delete</button>}
                    {isEditing && <button onClick={() => setIsEditing(false)} >Cancel</button>}
                    {(isEditing && editComment) && <AppButton onClick={() => editComment(editContent, commentId)} className={styles.commentButton} >Submit</AppButton>}
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
