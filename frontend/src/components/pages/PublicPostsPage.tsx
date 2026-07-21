import { useGetPublishedPostsQuery, useGetMyPostsQuery, useDeletePostsMutation } from "@/services/postsApi"
import PublicPostsTemplate from "../templates/PublicPostsTemplate"
import PostCard from "../molecules/PostCard"
import { useNavigate, useSearchParams } from "react-router"
import type { blogPost } from "@/types/rtkTypes"
import AppLoader from "../atoms/AppLoader"
import ErrorState from "../atoms/ErrorState"
import SEO from "../atoms/SEO"
import PostPanel from "../molecules/PostPanel"
import { resetdraftPost, setDraftContent, setDraftTitle } from "@/slices/draftPostSlice"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useAuthStatus } from "@/hooks/useAuthStatus"
import AppHeadingTwo from "../atoms/AppHeadingTwo"
import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import ReactPaginate from "react-paginate"
import styles from '@/styles/ui.module.css'
import { setPostId, clearDeletingPostIds } from "@/slices/uiSlice"

const PublicPostsPage = () => {
    const { loggedIn } = useAuthStatus();
    const [isDeleting, setIsDeleting] = useState(false);
    const limit = 10;

    // View parameters (which list, how it's ordered, which page) live in the URL
    // so the whole view is shareable and survives refresh and back/forward.
    const [searchParams, setSearchParams] = useSearchParams();
    const showMine = searchParams.get('mine') === 'true' && loggedIn;
    const sort = searchParams.get('sort') ?? 'newest';
    const currentPage = Math.max(0, Number(searchParams.get('page') ?? 1) - 1);

    // Merge into the existing params so changing one doesn't drop the others.
    const updateParams = (changes: Record<string, string | null>) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(changes).forEach(([key, value]) => {
            if (value === null) next.delete(key);
            else next.set(key, value);
        });
        setSearchParams(next);
    };

    const authorId = useAppSelector((state: RootState) => state.auth.user.id);
    const deletingPostIds = useSelector((state: RootState) => state.ui.deletingPostIds);

    // Both queries are declared but only one runs — filtering server-side rather
    // than client-side, because pagination is server-side too: filtering the
    // current page of 10 would hide matches on other pages.
    const publishedQuery = useGetPublishedPostsQuery(
        { sort, page: currentPage + 1, limit },
        { skip: showMine }
    );
    const mineQuery = useGetMyPostsQuery(
        { authorId, publishedOnly: false, sort, page: currentPage + 1, limit },
        { skip: !showMine || !authorId || authorId === 0 }
    );

    const { data, isLoading, isError, isFetching } = showMine ? mineQuery : publishedQuery;

    const [deletePosts, { isLoading: deletePostsLoading }] = useDeletePostsMutation();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handlePageClick = (event: { selected: number }) => {
        updateParams({ page: String(event.selected + 1) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (val: string) => {
        updateParams({ sort: val, page: null });
    };

    const handleFilterChange = (mine: boolean) => {
        // Reset paging and delete mode: page 3 of one list is meaningless in the
        // other, and a pending selection shouldn't survive the switch.
        setIsDeleting(false);
        dispatch(clearDeletingPostIds());
        updateParams({
            mine: mine ? 'true' : null,
            page: null,
            // 'status' only exists on the My posts view (drafts vs published), so
            // it would silently fall through to the default ordering on All posts.
            sort: !mine && sort === 'status' ? null : sort,
        });
    };

    const handleEditButton = (id: number) => {
        dispatch(setDraftTitle(''))
        dispatch(setDraftContent(''))
        dispatch(setPostId(id));
        navigate(`/createPost/${id}`);
    };

    const handleDeleteButton = () => {
        setIsDeleting((prev) => {
            if (prev) dispatch(clearDeletingPostIds());
            return !prev;
        });
    };

    const handleConfirmDelete = async (ids: number[]) => {
        await deletePosts(ids).unwrap();
        dispatch(clearDeletingPostIds());
        setIsDeleting(false);
    };

    if (isError) {
        return (
            <main>
                <ErrorState
                    message='Something went wrong while fetching the posts.'
                    onRetry={() => window.location.reload()}
                    actionLabel="Go back to home page"
                    onAction={() => navigate('/home')}
                />
            </main>
        )
    }

    const totalPages = Math.ceil((data?.totalCount || 0) / limit);

    const renderCards = (() => {
        // Only the first load has nothing to show; refetches keep the previous
        // page in `data` and are dimmed via staleList instead.
        if (isLoading) {
            return <AppLoader mode="normal" />;
        }

        if (!data?.posts || data.posts.length === 0) {
            return showMine ? (
                <ErrorState
                    mode="normal"
                    message="You haven't written any posts yet."
                    actionLabel="Write your first post"
                    onAction={() => navigate('/createPost')}
                />
            ) : (
                <ErrorState
                    mode="normal"
                    message="No public posts yet. Be the first to publish one."
                    actionLabel="Write a post"
                    onAction={() => navigate('/createPost')}
                />
            );
        }
        return (
            <>
                {data?.posts.map((post: blogPost) => (
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
                        authorId={post.authorId ?? authorId}
                        author={post.User?.username}
                        avatar_url={post.User?.avatar_url}
                        editButton={() => handleEditButton(post.id)}
                        isDeleting={showMine && isDeleting}
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
            <SEO
                title={showMine ? "My posts" : "Public posts"}
                description={showMine ? "Manage and view your own posts." : "Explore the latest posts by other writers."}
            />

            {deletePostsLoading && <AppLoader mode="page" />}

            <div>
                <PublicPostsTemplate
                    panel={
                        loggedIn ? (
                            <PostPanel
                                createButton={() => { navigate("/createPost"); dispatch(resetdraftPost()) }}
                                sort={sort}
                                onSortChange={handleSortChange}
                                isDashboard={showMine}
                                showMine={showMine}
                                onFilterChange={handleFilterChange}
                                deleteButton={showMine ? handleDeleteButton : undefined}
                                confirmDeleteButton={() => handleConfirmDelete(deletingPostIds)}
                                isDeleting={showMine && isDeleting}
                                deletingPostIds={deletingPostIds}
                            />
                        ) : (
                            <AppHeadingTwo>Log in to create your own posts.</AppHeadingTwo>
                        )
                    }
                    cards={
                        <div className={isFetching ? styles.staleList : undefined} aria-busy={isFetching}>
                            {renderCards}
                        </div>
                    }
                />
            </div>
        </>
    )
}

export default PublicPostsPage
