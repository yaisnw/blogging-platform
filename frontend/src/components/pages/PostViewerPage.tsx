
import { Link, useParams } from "react-router";
import PostViewerTemplate from "../templates/PostViewerTemplate";
import PostViewer from "../organisms/PostViewer";
import { useGetPostByIdQuery, } from "@/services/postsApi";
import styles from '@/styles/ui.module.css'

const PostViewerPage = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useGetPostByIdQuery(Number(id))

    if (isLoading) {
        return (
            <div className={styles.loaderCenter}>
                <span className={styles.loader}></span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={styles.submitError}>
                Could not load the post.
            </div>
        );
    }


    return (
        <div>
            {data.status === 'pending' &&
                <div className={styles.pageError}>
                    <h1 className={styles.error}>This post is not completed</h1>
                    <Link className={styles.errorLink} to='/home/posts'>View other posts</Link>
                </div>}
            {(error || !data) &&
                <div className={styles.pageError}>
                    <h1 className={styles.error}>Failed to get post</h1>
                    <Link className={styles.errorLink} to='/home/posts'>View other posts</Link>
                </div>
            }
            <PostViewerTemplate
                title={data.title}
                viewer={<PostViewer content={data.content} />}
            />
        </div>
    );
};

export default PostViewerPage;
