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
import ReactPaginate from "react-paginate";
import styles from '@/styles/ui.module.css'

const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const limit = 10;
    const { loggedIn, authChecked } = useAuthStatus();
    const [isDeleting, setIsDeleting] = useState(false);
    const [sort, setSort] = useState('newest');
    const deletingPostIds = useSelector((state: RootState) => state.ui.deletingPostIds);
    const authorId = useAppSelector((state: RootState) => state.auth.user.id);
    
    const { data, isLoading: getPostsLoading, isError: getPostsError, isFetching } = useGetMyPostsQuery({
        authorId,
        publishedOnly: false,
        sort,
        page: currentPage + 1,
        limit
    }, { skip: !authorId || authorId === 0 });
    
    const [deletePosts, { isLoading: deletePostsLoading, isError: deletePostsError }] = useDeletePostsMutation();

    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil((data?.totalCount || 0) / limit);

    useEffect(() => {
        dispatch(setAlertIgnored(false))
    }, [dispatch])

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

    if (getPostsError || deletePostsError) {
        return (
            <main>
                <ErrorState 
                    message={getPostsError ? 'Error retrieving posts.' : 'Error deleting post(s).'} 
                    onRetry={() => window.location.reload()} 
                    actionLabel="Go back to home page" 
                    onAction={() => navigate('/home')} 
                />
            </main>
        )
    }

    const renderCards = (() => {
        if (!getPostsLoading && (!data?.posts || data.posts.length === 0)) {
            return <ErrorState mode="normal" message="No posts available" actionLabel="Create your first post" onAction={() => navigate("/createPost")} />;
        }

        return (
            <>
                {data?.posts.map((post) => (
                    <PostCard
                        key={post.id}
                        postId={post.id}
                        title={post.title || "This is an incomplete draft."}
                        likeCount={post.likeCount}
                        commentCount={post.commentCount}
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
                ))}
                {totalPages > 1 && (
                    <div className={styles.paginationWrapper}>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            pageCount={totalPages}
                            previousLabel="< prev"
                            containerClassName={styles.paginationContainer}
                            activeClassName={styles.activePage}
                            pageClassName={styles.pageItem}
                            previousClassName={styles.pageItem}
                            nextClassName={styles.pageItem}
                            breakClassName={styles.pageItem}
                            forcePage={currentPage}
                        />
                    </div>
                )}
            </>
        );
    })();

    return (
        <>
            <SEO title="My Posts" description="Manage and view your own posts." />
    {(getPostsLoading || deletePostsLoading || isFetching) && <AppLoader mode="page" />}
            <DashboardTemplate
                panel={
                    (!getPostsLoading || !deletePostsLoading) && (
                        <PostPanel
                            createButton={() => { navigate("/createPost"); dispatch(resetdraftPost()) }}
                            deleteButton={handleDeleteButton}
                            confirmDeleteButton={() => handleConfirmDelete(deletingPostIds)}
                            isDeleting={isDeleting}
                            deletingPostIds={deletingPostIds}
                            onSortChange={(val) => { setSort(val); setCurrentPage(0); }}
                        />
                    )
                }
                cards={renderCards}
            />
        </>
    );
};

export default DashboardPage;