import { useAppDispatch, useAppSelector } from "../../hooks";
import { useDeletePostsMutation, useGetMyPostsQuery } from "../../services/postsApi";
import PostCard from "../molecules/PostCard";
import PostPanel from "../molecules/PostPanel";
import DashboardTemplate from "../templates/DashboardTemplate";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { setAlertIgnored, setPostId } from "@/slices/uiSlice";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import AppLoader from "../atoms/AppLoader";
import ErrorState from "../atoms/ErrorState";
import SEO from "../atoms/SEO";
import { resetdraftPost, setDraftContent, setDraftTitle } from "@/slices/draftPostSlice";


const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loggedIn, authChecked } = useAuthStatus();
    const [isDeleting, setIsDeleting] = useState(false);
    const [sort, setSort] = useState('newest');
    const deletingPostIds = useSelector((state: RootState) => state.ui.deletingPostIds);
    const authorId = useAppSelector((state: RootState) => state.auth.user.id);
    const { data, isLoading: getPostsLoading, isError: getPostsError } = useGetMyPostsQuery({ authorId, publishedOnly: false, sort }, {skip: !authorId || authorId === 0,});
    const [deletePosts, { isLoading: deletePostsLoading, isError: deletePostsError }] = useDeletePostsMutation();
    

    useEffect(() => {
        dispatch(setAlertIgnored(false))
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 
    useEffect(() => {
        if (authChecked && !loggedIn) {
            navigate("/login");
        }
    }, [loggedIn, navigate, authChecked]);

    const handleEditButton = (id: number) => {
        dispatch(setDraftTitle(''))
        dispatch(setDraftContent(''))
        dispatch(setPostId(id));
        navigate(`/createPost/${id}`);
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
            <DashboardTemplate
                panel={
                    (!getPostsLoading || !deletePostsLoading) && (
                        <PostPanel
                            createButton={() => { navigate("/createPost"); dispatch(resetdraftPost()) }}
                            deleteButton={handleDeleteButton}
                            confirmDeleteButton={() => handleConfirmDelete(deletingPostIds)}
                            isDeleting={isDeleting}
                            deletingPostIds={deletingPostIds}
                            onSortChange={setSort}
                        />
                    )
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
                        authorId={post.User.id}
                        avatar_url={post.User.avatar_url}
                        editButton={() => handleEditButton(post.id)}
                        isDeleting={isDeleting}
                    />
                )) || [<ErrorState key="no-posts" mode="normal" message="No posts available" actionLabel="Create your first post" />]}
            /></>
    );
};

export default DashboardPage;
