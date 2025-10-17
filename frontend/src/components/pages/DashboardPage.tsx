import { useAppDispatch, useAppSelector } from "../../hooks";
import { useDeletePostsMutation, useGetMyPostsQuery } from "../../services/postsApi";
import PostCard from "../molecules/PostCard";
import PostPanel from "../molecules/PostPanel";
import MyPostsTemplate from "../templates/DashboardTemplate";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { setPostId } from "@/slices/uiSlice";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import AppLoader from "../atoms/AppLoader";
import ErrorState from "../atoms/ErrorState";
import SEO from "../atoms/SEO";

const DashboardPage = () => {
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
    if (getPostsError) {
        return (
            <main>
                <ErrorState message='Something went wrong while retrieving the post(s).' onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')} />
            </main>
        )
    }
    if (deletePostsError) {
        return (
            <main>
                <ErrorState message='Something went wrong while deleting the post(s).' onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')} />
            </main>
        )
    }
    return (
        <>
            <SEO title="My Posts" description="Manage and view your own posts." />
            {(getPostsLoading || deletePostsLoading) && <AppLoader mode="page" />}
            <MyPostsTemplate
                panel={
                    <PostPanel
                        createButton={() => navigate("/home/createPost")}
                        deleteButton={handleDeleteButton}
                        confirmDeleteButton={() => handleConfirmDelete(deletingPostIds)}
                        isDeleting={isDeleting}
                    />
                }
                cards={data?.posts.map((post) => (
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
                )) || [<ErrorState mode="normal" message="No posts available" actionLabel="Create your first post" />]}
            /></>
    );
};

export default DashboardPage;
