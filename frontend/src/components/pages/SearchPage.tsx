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

const SearchPage = () => {
    const navigate = useNavigate();
    const tabState = useSelector((state: RootState) => state.ui.tabState);
    const searchQuery = useSelector((state: RootState) => state.ui.searchQuery);

    const { data: postsResponse, isLoading: postsLoading, isError: postsError } =
        useSearchPostsQuery(searchQuery ? searchQuery : skipToken)

    const { data: usersResponse, isLoading: usersLoading, isError: usersError } =
        useSearchUsersQuery(searchQuery ? searchQuery : skipToken)



    if (postsLoading || usersLoading) {
        return (
            <AppLoader mode="page" />
        )
    }

    let contentTab
    if (postsError || usersError) {
        contentTab = (
            <ErrorState message={`Something went wrong while fetching the ${postsError ? "posts." : "users."}`} onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')} />
        )
    } else if (
        (tabState === "posts" && (!postsResponse?.posts || postsResponse?.posts.length === 0)) ||
        (tabState === "users" && (!usersResponse?.users || usersResponse?.users.length === 0))
    ) {
        contentTab = (
             <ErrorState mode="normal" message={`There are no ${tabState === "posts" ? "posts" : "users"} matching  '${searchQuery}'`}  />
        )
    } else {
        contentTab =
            tabState === "posts" ? (
                postsResponse?.posts.map((post: blogPost) => (
                    <PostCard
                        key={post.id}
                        postId={post.id}
                        title={post.title}
                        likeCount={post.likeCount}
                        hasLiked={post.hasLiked}
                        createdAt={post.createdAt}
                        updatedAt={post.updatedAt}
                        status={post.status}

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
        <SearchPageTemplate
            tabPanel={<TabPanel mode="search" />}
            tabContent={contentTab}
        />
    )
}

export default SearchPage
