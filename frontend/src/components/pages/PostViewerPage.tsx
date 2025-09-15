import { useNavigate, useParams } from "react-router";
import PostViewerTemplate from "../templates/PostViewerTemplate";
import PostViewer from "../organisms/PostViewer";
import { useGetPostByIdQuery, } from "@/services/postsApi";
import styles from '@/styles/ui.module.css'
import InteractionForm from "../organisms/InteractionForm";
import { useEffect, useState } from "react";
import { useAddLikeMutation, useRemoveLikeMutation } from "@/services/likesApi";
import { useAddCommentMutation, useGetCommentsByPostIdQuery } from "@/services/commentsApi";
import type { comment } from "@/types/rtkTypes";
import CommentCard from "../molecules/CommentCard";

const PostViewerPage = () => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentContent, setCommentContent] = useState<string | undefined>('');
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: post, isLoading: postLoading, isError: postError } = useGetPostByIdQuery(Number(id));
    const { data: commentResponse, isLoading: commentsLoading, isError: commentsError } = useGetCommentsByPostIdQuery(Number(id));
    const [ addComment, {isLoading: commentSubmitLoading, isError: commentSubmitError} ] = useAddCommentMutation();
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

    const handleCommentSubmit = async (commentContent: string) => {
        try {
            if(id) {
                await addComment({postId: Number(id), content: commentContent})
            }
            else {
                throw new Error('No postId available')
            }
        }
        catch(e){
            console.error(e)
        }
    }

    if (postLoading || commentSubmitLoading) {
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
    if (!post || postError) {
        return (
            <div className={styles.pageError}>
                <h1 className={styles.error}>Something went wrong while fetching the post.</h1>
                <button className={styles.ctaButton} onClick={() => window.location.reload()}>
                                    <p >Try again</p>
                                </button>
                <button onClick={() => navigate('/home/posts')} className={styles.ctaButton}>
                    <p>View other posts</p>
                </button>
            </div>
        )
    }
    if(commentSubmitError) {
        return (
            <div className={styles.pageError}>
                <h1 className={styles.error}>Something went wrong while posting the comment.</h1>
                <button className={styles.ctaButton} onClick={() => window.location.reload()}>
                                    <p >Try again</p>
                                </button>
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
            interactionBox={<InteractionForm
                likeCount={likeCount}
                liked={liked}
                OnLike={likeHandler}
                commentContent={commentContent ?? ""}
                setCommentContent={setCommentContent}
                submitComment={handleCommentSubmit}
            />}
            comments={commentResponse?.comments.length === 0 ?
                <div>
                    <h2 className={styles.responseInfo} >There are no comments on this post</h2>
                </div> :
                commentResponse?.comments.map(
                    (comment: comment) =>
                        <CommentCard
                            content={comment.content}
                            username={comment.User.username}
                            avatar_url={comment.User.avatar_url}
                            createdAt={comment.createdAt}
                            isLoading={commentsLoading}
                            isError={commentsError}
                        />
                )}
        />
    );
};

export default PostViewerPage;





