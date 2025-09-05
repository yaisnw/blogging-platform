import { useGetPublishedPostsQuery } from "@/services/postsApi"
import PublicPostsTemplate from "../templates/PublicPostsTemplate"
import PostCard from "../molecules/PostCard"
import styles from '@/styles/ui.module.css'
import { Link, useNavigate } from "react-router"
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
                <h1 className={styles.error}>Failed to get posts</h1>
                <Link className={styles.errorLink} to='/home/posts'>Please try again.</Link>
            </div>
        )
    }
    if (data?.posts.length === 0) {
        <div className={styles.pageError}>
            <h1 className={styles.error}>No Posts Available</h1>
            <Link className={styles.errorLink} to='/home'>Return to the home page</Link>
        </div>
    }

    return (
        <PublicPostsTemplate cards={data?.posts.map(
            (post: blogPost) =>
                <PostCard
                    key={post.id}
                    postId={post.id}
                    title={post.title}
                    likeCount={post.likes}
                    createdAt={post.createdAt}
                    updatedAt={post.updatedAt}
                    status={post.status}
                    author={post.User.username}
                    viewButton={() => handlePostClick(post.id)}
                />
        ) || []} />
    )
}

export default PublicPostsPage