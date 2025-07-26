import { useAppSelector } from "../../hooks"
import { useGetMyPostsQuery } from "../../services/blogsApi"
import BlogCard from "../molecules/BlogCard"
import BlogPanel from "../molecules/BlogPanel"
import MyBlogsTemplate from "../templates/MyBlogsTemplate"
import UIstyles from "../../styles/ui.module.css"
import styles from "../../styles/myBlogs.module.css"
import { useNavigate } from "react-router"

const MyBlogsPage = () => {
    const navigate = useNavigate();
    const userId = useAppSelector((state) => state.auth.user.id);
    const { data, isLoading, error } = useGetMyPostsQuery(userId);

    return (
        <div>
            <MyBlogsTemplate panel={<BlogPanel createButton={()=> navigate('/createPost') } editButton={() => navigate('')} deleteButton={() => navigate('')}/>}
                cards={
                    isLoading
                        ? [<div className={styles.centerWrapper}>
                            <span className={UIstyles.loader}></span>
                        </div>]
                        :
                        (
                            !data?.posts?.length
                                ? (error ? [<p className={styles.centerWrapper}>Failed to get posts</p>] : [

                                    <div className={styles.centerWrapper}>
                                        <h1>No posts available</h1>
                                    </div>

                                ])
                                : data.posts.map((post) => (
                                    <BlogCard
                                        key={post.id}
                                        title={post.title}
                                        likeCount={post.likes}
                                        commentCount={1}
                                    />
                                ))
                        )

                } />


        </div>
    )
}

export default MyBlogsPage