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

const PublicPostsPage = () => {
    const {loggedIn} = useAuthStatus();
    const [sort, setSort] =  useState('newest');
    const { data, isLoading, isError } = useGetPublishedPostsQuery({ sort });
    const dispatch = useAppDispatch(); 
    const navigate = useNavigate();


    if (isError) {
        return (
            <main>
                <ErrorState message='Something went wrong while fetching the posts.'  onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')} />
            </main>
        )
    }
    if (data?.posts.length === 0) {
        <main>
            <ErrorState message='There are no posts currently' actionLabel="Go back to home page" onAction={() => navigate('/home')} />
        </main>
    }

    return (
        <>
            {isLoading &&
                <AppLoader mode="page" />
            }
            <SEO title="Public posts" description="Explore the latest posts by other writers." />
            <PublicPostsTemplate panel={loggedIn ? <PostPanel createButton={() => {navigate("/createPost"); dispatch(resetdraftPost())}} onSortChange={setSort} /> : <AppHeadingTwo>Log in to create your own posts.</AppHeadingTwo>} cards={data?.posts.map(
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