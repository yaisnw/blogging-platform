import { useGetPublishedPostsQuery } from "@/services/postsApi"
import PublicPostsTemplate from "../templates/PublicPostsTemplate"
import PostCard from "../molecules/PostCard"
import { useNavigate } from "react-router"

import type { blogPost } from "@/types/rtkTypes"
import AppLoader from "../atoms/AppLoader"
import ErrorState from "../atoms/ErrorState"
import SEO from "../atoms/SEO"

const PublicPostsPage = () => {
    const { data, isLoading, isError } = useGetPublishedPostsQuery();
    const navigate = useNavigate();



    if (isLoading) {
        return (
            <AppLoader mode="page" />
        );
    }
    if (isError) {
        return (
            <ErrorState message='Something went wrong while fetching the posts.' onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')} />
        )
    }
    if (data?.posts.length === 0) {
        <ErrorState message='There are no posts currently' actionLabel="Go back to home page" onAction={() => navigate('/home')} />
    }

    return (
        <>
            <SEO title="Public posts" description="Explore the latest posts by other writers." />
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
                        authorId={post.authorId}
                        author={post.User.username}
                        avatar_url={post.User.avatar_url}
                    />
            ) || []} />
        </>
    )
}

export default PublicPostsPage