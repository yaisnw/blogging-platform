import { useGetPublishedPostsQuery } from "@/services/postsApi"
import PublicPostsTemplate from "../templates/PublicPostsTemplate"
import PostCard from "../molecules/PostCard"
import styles from '@/styles/ui.module.css'
import { useNavigate } from "react-router"
import { useAppDispatch } from "@/hooks"
import { setPostId } from "@/slices/uiSlice"
import type { blogPost } from "@/types/rtkTypes"

const PublicPostsPage = () => {
    const { data, isLoading, isError } = useGetPublishedPostsQuery();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handlePostClick = async (id: number) => {
        dispatch(setPostId(id))
        navigate(`/home/posts/${id}`)
    }

    if (isLoading) {
        return (
            <div className={styles.loaderCenter}>
                <span className={styles.loader}></span>
            </div>
        );
    }
    if (isError) {
        return (
            <div className={styles.pageError}>
                <h1 className={styles.error}>Something went wrong while fetching the posts.</h1>
                <button className={styles.ctaButton} onClick={() => window.location.reload()}>
                    <p >Try again</p>
                </button>
                <button onClick={() => navigate('/home')} className={styles.ctaButton}>
                    <p>Go back to home page</p>
                </button>
            </div>
        )
    }
    if (data?.posts.length === 0) {
        <div className={styles.pageError}>
            <h1 className={styles.error}>No Posts Available</h1>
            <button onClick={() => navigate('/home')} className={styles.ctaButton}>
            <p>Return to the home page</p>
            </button>
        </div>
    }

    return (
        <PublicPostsTemplate cards={data?.posts.map(
            (post: blogPost) =>
                <PostCard
                    key={post.id}
                    postId={post.id}
                    title={post.title}
                    likeCount={post.likeCount}
                    hasLiked={post.hasLiked}
                    createdAt={post.createdAt}
                    updatedAt={post.updatedAt}
                    status={post.status}
                    author={post.User.username}
                    avatar_url={post.User.avatar_url}
                    viewButton={() => handlePostClick(post.id)}
                />
        ) || []} />
    )
}

export default PublicPostsPage