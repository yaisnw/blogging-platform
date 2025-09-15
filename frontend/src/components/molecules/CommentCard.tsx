import React from "react";
import AppImage from "../atoms/AppImage";
import UIstyles from "@/styles/ui.module.css";
import styles from "@/styles/comments.module.css"


type CommentCardProps = {
    content: string,
    username: string,
    avatar_url: string,
    createdAt: Date,
    isLoading: boolean,
    isError: boolean
} & React.HTMLProps<HTMLDivElement>;

const CommentCard: React.FC<CommentCardProps> = ({ content, username, avatar_url, createdAt, isLoading, isError }) => {

    const formattedCreatedAt = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    let commentContent;

    switch (true) {
        case isLoading:
            commentContent = (
                <div className={UIstyles.loaderCenter}>
                    <span className={UIstyles.loader}></span>
                </div>
            );
            break;

        case isError:
            commentContent = (
                <div className={UIstyles.pageError}>
                    <h1 className={UIstyles.error}>
                        Something went wrong while fetching the comments.
                    </h1>
                    <button
                        className={UIstyles.ctaButton}
                        onClick={() => window.location.reload()}
                    >
                        <p>Try again</p>
                    </button>
                </div>
            );
            break;

        default:
            commentContent = (
                <div className={styles.commentCard}>
                    <div className={styles.authorBox} >
                        <AppImage className={UIstyles.avatar} src={avatar_url} />
                        <h3>{username}</h3>
                    </div>
                    <p className={styles.commentContent} >{content}</p>
                    <p className={styles.commentDate} >{formattedCreatedAt}</p>
                </div>
            );
    }

    return commentContent;

}

export default CommentCard;