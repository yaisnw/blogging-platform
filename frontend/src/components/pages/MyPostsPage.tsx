import { useAppDispatch, useAppSelector } from "../../hooks";
import { useDeletePostsMutation, useGetMyPostsQuery } from "../../services/postsApi";
import PostCard from "../molecules/PostCard";
import PostPanel from "../molecules/PostPanel";
import MyPostsTemplate from "../templates/MyPostsTemplate";
import UIstyles from "../../styles/ui.module.css";
import styles from "../../styles/myPosts.module.css";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { setPostId } from "@/slices/uiSlice";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useAuthStatus } from "@/hooks/useAuthStatus";

const MyPostsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const deletingPostIds = useSelector((state: RootState) => state.ui.deletingPostIds);
    const userId = useAppSelector((state) => state.auth.user.id);
    const { data, isLoading: getPostsLoading, isError: getPostsError } = useGetMyPostsQuery(userId);
    const [deletePosts, { isLoading: deletePostsLoading, isError: deletePostsError }] = useDeletePostsMutation();
    const { loggedIn, authChecked } = useAuthStatus();
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (authChecked && !loggedIn) {
            navigate("/login");
        }
    }, [loggedIn, navigate, authChecked]);

    const handlePostClick = (id: number) => {
        dispatch(setPostId(id));
        navigate(`/home/posts/${id}`);
    };

    const handleEditButton = (id: number) => {
        dispatch(setPostId(id));
        navigate(`/createPost/${id}`);
    };

    const handleDeleteButton = () => {
        setIsDeleting((prev) => !prev);
    };

    const handleConfirmDelete = async (ids: number[]) => {
        try {
            await deletePosts(ids).unwrap();
        } catch {
            // handled by deletePostsError state
        }
    };

    if (getPostsLoading || deletePostsLoading) {
        return (
            <div className={UIstyles.loaderCenter}>
                <span className={UIstyles.loader}></span>
            </div>
        );
    }

    if (getPostsError) {
        return (
            <div className={styles.centerWrapper}>
                <h1 className={styles.error}>Failed to load posts.</h1>
                <button className={UIstyles.ctaButton} onClick={() => window.location.reload()}>
                    <p>Try again</p>
                </button>
            </div>
        );
    }

    if (deletePostsError) {
        return (
            <div className={styles.centerWrapper}>
                <h1 className={styles.error}>Failed to delete selected posts.</h1>
                <button className={UIstyles.ctaButton} onClick={() => window.location.reload()}>
                    <p>Try again</p>
                </button>
            </div>
        );
    }

    if (!data?.posts?.length) {
        return (
            <div className={styles.centerWrapper}>
                <h1>No posts available</h1>
                <button className={UIstyles.ctaButton} onClick={() => navigate("/createPost")}>
                    <p>Create your first post</p>
                </button>
            </div>
        );
    }

    return (
        <MyPostsTemplate
            panel={
                <PostPanel
                    createButton={() => navigate("/createPost")}
                    deleteButton={handleDeleteButton}
                    confirmDeleteButton={() => handleConfirmDelete(deletingPostIds)}
                    isDeleting={isDeleting}
                />
            }
            cards={data.posts.map((post) => (
                <PostCard
                    key={post.id}
                    postId={post.id}
                    title={post.title || "This is an incomplete draft."}
                    likeCount={post.likeCount}
                    hasLiked={post.hasLiked}
                    createdAt={post.createdAt}
                    updatedAt={post.updatedAt}
                    status={post.status}
                    editButton={() => handleEditButton(post.id)}
                    viewButton={() => handlePostClick(post.id)}
                    isDeleting={isDeleting}
                />
            ))}
        />
    );
};

export default MyPostsPage;
