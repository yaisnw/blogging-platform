import { useGetPublishedPostsQuery } from "@/services/postsApi"
import PublicPostsTemplate from "../templates/PublicPostsTemplate"
import PostCard from "../molecules/PostCard"
import { useNavigate } from "react-router"
import type { blogPost } from "@/types/rtkTypes"
import AppLoader from "../atoms/AppLoader"
import ErrorState from "../atoms/ErrorState"
import SEO from "../atoms/SEO"
import PostPanel from "../molecules/PostPanel"
import { resetdraftPost } from "@/slices/draftPostSlice"
import { useAppDispatch } from "@/hooks"
import { useAuthStatus } from "@/hooks/useAuthStatus"
import AppHeadingTwo from "../atoms/AppHeadingTwo"
import { useState } from "react"
import ReactPaginate from "react-paginate"
import styles from '@/styles/ui.module.css'

const PublicPostsPage = () => {
    const { loggedIn } = useAuthStatus();
    const [sort, setSort] = useState('newest');
    const [currentPage, setCurrentPage] = useState(0);
    const limit = 10;

    const { data, isLoading, isError, isFetching } = useGetPublishedPostsQuery({
        sort,
        page: currentPage + 1,
        limit
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        if (!isLoading && (!data?.posts || data.posts.length === 0)) {
            return <ErrorState mode="normal" message="No public posts available at the moment." />;
        }
        console.log("Total Pages:", totalPages);
        console.log("Styles object:", styles);
        return (
            <>
                {data?.posts.map((post: blogPost) => (
                    <PostCard
                        key={post.id}
                        postId={post.id}
                        title={post.title}
                        likeCount={post.likeCount}
                        hasLiked={post.hasLiked}
                        createdAt={post.createdAt}
                        updatedAt={post.updatedAt}
                        status={post.status}
                        authorId={post.authorId}
                        author={post.User.username}
                        avatar_url={post.User.avatar_url}
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
            {(isLoading || isFetching) && <AppLoader mode="page" />}
            <SEO title="Public posts" description="Explore the latest posts by other writers." />

            <div className={isFetching ? styles.fetchingFade : ""}>
                <PublicPostsTemplate
                    panel={
                        !isLoading && (
                            loggedIn ? (
                                <PostPanel
                                    createButton={() => { navigate("/createPost"); dispatch(resetdraftPost()) }}
                                    onSortChange={(val) => { setSort(val); setCurrentPage(0); }}
                                />
                            ) : (
                                <AppHeadingTwo>Log in to create your own posts.</AppHeadingTwo>
                            )
                        )
                    }
                    cards={renderCards}
                />
            </div>
        </>
    )
}

export default PublicPostsPage