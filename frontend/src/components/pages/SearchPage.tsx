import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { useNavigate } from "react-router"
import PostCard from "../molecules/PostCard"
import TabPanel from "../molecules/TabPanel"
import SearchPageTemplate from "../templates/SearchPageTemplate"
import { skipToken } from "@reduxjs/toolkit/query"
import type { blogPost, responseUser } from "@/types/rtkTypes"
import PublicProfileCard from "../organisms/PublicProfileCard"
import { useSearchPostsQuery } from "@/services/postsApi"
import { useSearchUsersQuery } from "@/services/userApi"
import AppLoader from "../atoms/AppLoader"
import ErrorState from "../atoms/ErrorState"
import SEO from "../atoms/SEO"

const SearchPage = () => {
    const navigate = useNavigate();
    const searchTab = useSelector((state: RootState) => state.ui.searchTab);
    const searchQuery = useSelector((state: RootState) => state.ui.searchQuery);

    const { data: postsResponse, isLoading: postsLoading, isError: postsError } =
        useSearchPostsQuery(searchQuery ? searchQuery : skipToken)

    const { data: usersResponse, isLoading: usersLoading, isError: usersError } =
        useSearchUsersQuery(searchQuery ? searchQuery : skipToken)



    if (postsLoading || usersLoading) {
        return (
            <main>
                <AppLoader mode="page" />
            </main>
        )
    }

    let contentTab
    if (postsError || usersError) {
        contentTab = (
            <main>
                <ErrorState message={`Something went wrong while fetching the ${postsError ? "posts." : "users."}`} onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')} />
            </main>
        )
    } else if (
        (searchTab === "posts" && (!postsResponse?.posts || postsResponse?.posts.length === 0)) ||
        (searchTab === "users" && (!usersResponse?.users || usersResponse?.users.length === 0))
    ) {
        contentTab = (
            <main>
                <ErrorState mode="normal" message={`There are no ${searchTab === "posts" ? "posts" : "users"} matching  '${searchQuery}'`} />
            </main>
        )
    } else {
        contentTab =
            searchTab === "posts" ? (
                postsResponse?.posts.map((post: blogPost) => (
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
                    />
                ))
            ) : (
                usersResponse?.users.map((user: responseUser) => (
                    <PublicProfileCard
                        key={user.id}
                        id={user.id}
                        username={user.username}
                        email={user.email}
                        avatar_url={user.avatar_url}
                    />
                ))
            )
    }

    return (
        <>
            <SEO
                title={`Search: ${searchQuery}`}
                description={`Results for '${searchQuery}' on MyBlog. Discover posts and articles matching your search.`}
            />

            <SearchPageTemplate
                tabPanel={<TabPanel mode="search" />}
                tabContent={contentTab}
            />
        </>
    )
}

export default SearchPage
