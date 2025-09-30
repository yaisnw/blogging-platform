import { useAppDispatch, useAppSelector } from "../../hooks";
import { useDeletePostsMutation, useGetMyPostsQuery } from "../../services/postsApi";
import PostCard from "../molecules/PostCard";
import PostPanel from "../molecules/PostPanel";
import MyPostsTemplate from "../templates/MyPostsTemplate";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { setPostId } from "@/slices/uiSlice";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import AppLoader from "../atoms/AppLoader";
import ErrorState from "../atoms/ErrorState";

const MyPostsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const deletingPostIds = useSelector((state: RootState) => state.ui.deletingPostIds);
    const authorId = useAppSelector((state: RootState) => state.auth.user.id);
    const { data, isLoading: getPostsLoading, isError: getPostsError } = useGetMyPostsQuery({ authorId, publishedOnly: false });
    const [deletePosts, { isLoading: deletePostsLoading, isError: deletePostsError }] = useDeletePostsMutation();
    const { loggedIn, authChecked } = useAuthStatus();
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (authChecked && !loggedIn) {
            navigate("/login");
        }
    }, [loggedIn, navigate, authChecked]);

    const handleEditButton = (id: number) => {
        dispatch(setPostId(id));
        navigate(`/home/createPost/${id}`);
    };

    const handleDeleteButton = () => {
        setIsDeleting((prev) => !prev);
    };

    const handleConfirmDelete = async (ids: number[]) => {
        await deletePosts(ids).unwrap();
    };

    if (getPostsLoading || deletePostsLoading) {
        return (
            <AppLoader mode="page" />
        );
    }

    if (getPostsError) {
        return (
            <ErrorState message='Failed to load posts.' onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')}  />
        );
    }

    if (deletePostsError) {
        return (
            <ErrorState message='Failed to delete posts.' onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')} />
        );
    }

    if (!data?.posts?.length) {
        return (
            <ErrorState mode="normal" message="No posts available" actionLabel="Create your first post" onAction={()=> navigate('/home/createPost')} />
        );
    }

    return (
        <MyPostsTemplate
            panel={
                <PostPanel
                    createButton={() => navigate("/home/createPost")}
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
                    author={post.User.username}
                    avatar_url={post.User.avatar_url}
                    editButton={() => handleEditButton(post.id)}
                    isDeleting={isDeleting}
                />
            ))}
        />
    );
};

export default MyPostsPage;
