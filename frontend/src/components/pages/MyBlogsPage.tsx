import { useAppDispatch, useAppSelector } from "../../hooks"
import { useDeletePostsMutation, useGetMyPostsQuery } from "../../services/blogsApi"
import BlogCard from "../molecules/BlogCard"
import BlogPanel from "../molecules/BlogPanel"
import MyBlogsTemplate from "../templates/MyBlogsTemplate"
import UIstyles from "../../styles/ui.module.css"
import styles from "../../styles/myBlogs.module.css"
import { useNavigate } from "react-router"
import { useJwtAuth } from "@/hooks/useJwtAuth"
import { useEffect, useState } from "react"
import { setPostId } from "@/slices/uiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"


const MyBlogsPage = () => {
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
    // Viewing a public post functionality
    // detailed blog card information
    const handlePostClick = async (id: number) => {
        console.log(id)
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
            <MyBlogsTemplate panel={<div>
                <BlogPanel createButton={() => navigate('/createPost')} deleteButton={() => handleDeleteButton(isDeleting)} confirmDeleteButton={() => handleConfirmDelete(deletingPostIds)} isDeleting={isDeleting} />
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
                                    <BlogCard
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

export default MyBlogsPage