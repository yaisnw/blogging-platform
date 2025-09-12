import { useNavigate, useParams } from "react-router";
import PostViewerTemplate from "../templates/PostViewerTemplate";
import PostViewer from "../organisms/PostViewer";
import { useGetPostByIdQuery, } from "@/services/postsApi";
import styles from '@/styles/ui.module.css'
import InteractionForm from "../organisms/InteractionForm";
import { useEffect, useState } from "react";
import { useAddLikeMutation, useRemoveLikeMutation } from "@/services/likesApi";

const PostViewerPage = () => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: post, isLoading, isError } = useGetPostByIdQuery(Number(id));
    const [addLike] = useAddLikeMutation();
    const [removeLike] = useRemoveLikeMutation();

    useEffect(() => {
        if (post) {
            setLikeCount(post.likeCount ?? 0);
            setLiked(post.hasLiked ?? false);
        }
    }, [post]);

    const likeHandler = async () => {
        if (!id) return;
        const newLiked = !liked;

        setLiked(newLiked);
        setLikeCount(prev => (newLiked ? prev + 1 : Math.max(0, prev - 1)));

        try {
            if (newLiked) {
                await addLike(Number(id)).unwrap();
            } else {
                await removeLike(Number(id)).unwrap();
            }
        } catch {
            setLiked(!newLiked);
            setLikeCount(post?.likeCount || 0);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loaderCenter}>
                <span className={styles.loader}></span>
            </div>
        );
    }
    if (post?.status === 'draft') {
        return (
            <div className={styles.pageError}>
                <h1 className={styles.error}>This post is not completed.</h1>
                <button onClick={() => navigate('/home/posts')} className={styles.ctaButton}>
                    <p>View other posts</p>
                </button>
            </div>
        )
    }
    if (!post || isError) {
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
            title={post.title}
            viewer={<PostViewer content={post.content} />}
            interactionBox={<InteractionForm likeCount={likeCount} liked={liked} OnLike={likeHandler} />}
            comments={[<div></div>, <div></div>]}
        />
    );
};

export default PostViewerPage;





// add post comments and post liking feature