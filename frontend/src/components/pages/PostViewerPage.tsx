
import { Link, useNavigate, useParams } from "react-router";
import PostViewerTemplate from "../templates/PostViewerTemplate";
import PostViewer from "../organisms/PostViewer";
import { useGetPostByIdQuery, } from "@/services/postsApi";
import styles from '@/styles/ui.module.css'

const PostViewerPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isLoading, isError } = useGetPostByIdQuery(Number(id))

    if (isLoading) {
        return (
            <div className={styles.loaderCenter}>
                <span className={styles.loader}></span>
            </div>
        );
    }
    if (data?.status === 'draft') {
        return (
            <div className={styles.pageError}>
                <h1 className={styles.error}>This post is not completed.</h1>
                <button onClick={() => navigate('/home/posts')} className={styles.ctaButton}>
                    <p>View other posts</p>
                </button>
            </div>
        )
    }
    if (!data || isError) {
        return (
            <div className={styles.pageError}>
                <h1 className={styles.error}>Something went wrong while fetching the posts.</h1>
                <button onClick={() => navigate('/home/posts')} className={styles.ctaButton}>
                    <p>View other posts</p>
                </button>
            </div>
        )
    }


return (
        <PostViewerTemplate
            title={data.title}
            viewer={<PostViewer content={data.content} />}
        />
);
};

export default PostViewerPage;
