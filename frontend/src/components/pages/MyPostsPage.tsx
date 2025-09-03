import { useAppDispatch, useAppSelector } from "../../hooks"
import { useDeletePostsMutation, useGetMyPostsQuery } from "../../services/postsApi"
import PostCard from "../molecules/PostCard"
import PostPanel from "../molecules/PostPanel"
import MyPostsTemplate from "../templates/MyPostsTemplate"
import UIstyles from "../../styles/ui.module.css"
import styles from "../../styles/myPosts.module.css"
import { useNavigate } from "react-router"
import { useJwtAuth } from "@/hooks/useJwtAuth"
import { useEffect, useState } from "react"
import { setPostId } from "@/slices/uiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"


const MyPostsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const deletingPostIds = useSelector((state: RootState) => state.ui.deletingPostIds);
    const userId = useAppSelector((state) => state.auth.user.id);
    const { data, isLoading: getPostsLoading, error: getPostsError } = useGetMyPostsQuery(userId);
    const [deletePosts, { isLoading: deletePostsLoading, error: deletePostsError }] = useDeletePostsMutation();
    const { loggedIn, authChecked } = useJwtAuth();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);


    useEffect(() => {
        if (authChecked && !loggedIn) {
            navigate('/login')
        }
    }, [loggedIn, navigate, authChecked])

    const handlePostClick = async (id: number) => {
        dispatch(setPostId(id))
        navigate(`/home/posts/${id}`)
    }
    const handleEditButton = async (id: number) => {
        dispatch(setPostId(id))
        navigate(`/createPost/${id}`)
    }
    const handleDeleteButton = (isDeleting: boolean) => {
        if (isDeleting) {
            setIsDeleting(false)
        }
        else {
            setIsDeleting(true)
        }
    }
    const handleConfirmDelete = async (ids: number[]) => {
        await deletePosts(ids)
    }

    return (
        <div>
            <MyPostsTemplate panel={<div>
                <PostPanel createButton={() => navigate('/createPost')} deleteButton={() => handleDeleteButton(isDeleting)} confirmDeleteButton={() => handleConfirmDelete(deletingPostIds)} isDeleting={isDeleting} />
                {deletePostsError && <p>Failed to delete selected posts.</p>}    
            </div>}
                cards={
                    getPostsLoading || deletePostsLoading
                        ? [<div className={UIstyles.loaderContainer}>
                            <span className={UIstyles.loader}></span>
                        </div>]
                        :
                        (
                            !data?.posts?.length
                                ? (getPostsError ? [<p className={styles.centerWrapper}>Failed to get posts</p>] : [

                                    <div className={styles.centerWrapper}>
                                        <h1>No posts available</h1>
                                    </div>

                                ])
                                : data.posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        postId={post.id}
                                        title={post.title ? post.title : 'This is an incomplete draft.'}
                                        likeCount={post.likes}
                                        createdAt={post.createdAt}
                                        editButton={() => handleEditButton(post.id)}
                                        viewButton={() => handlePostClick(post.id)}
                                        isDeleting={isDeleting}
                                    />
                                ))
                        )

                } />
            


        </div>
    )
}

export default MyPostsPage