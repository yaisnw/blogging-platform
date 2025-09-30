import { useNavigate, useParams } from "react-router";
import PostViewerTemplate from "../templates/PostViewerTemplate";
import PostViewer from "../organisms/PostViewer";
import { useGetPostByIdQuery, } from "@/services/postsApi";
import InteractionForm from "../organisms/CommentForm";
import { useEffect, useState } from "react";
import { useAddLikeMutation, useRemoveLikeMutation } from "@/services/likesApi";
import { useAddCommentMutation, useDeleteCommentMutation, useEditCommentMutation, useGetCommentsByPostIdQuery } from "@/services/commentsApi";
import type { comment } from "@/types/rtkTypes";
import CommentCard from "../molecules/CommentCard";
import PostHeader from "../organisms/PostHeader";
import AppLoader from "../atoms/AppLoader";
import ErrorState from "../atoms/ErrorState";

const PostViewerPage = () => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentContent, setCommentContent] = useState<string | undefined>('');
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: post, isLoading: postLoading, isError: postError } = useGetPostByIdQuery(Number(id));
    const { data: commentResponse, isLoading: commentsLoading, isError: commentsError } = useGetCommentsByPostIdQuery(Number(id));
    const [editComment, { isLoading: editCommentsLoading, isError: editCommentError }] = useEditCommentMutation();
    const [deleteComment, { isLoading: deleteCommentsLoading, isError: deleteCommentError }] = useDeleteCommentMutation();
    const [addComment, { isLoading: commentSubmitLoading, isError: submitCommentError }] = useAddCommentMutation();
    const [addLike] = useAddLikeMutation();
    const [removeLike] = useRemoveLikeMutation();

    useEffect(() => {
        if (post) {
            setLikeCount(post.likeCount ?? 0);
            setLiked(post.hasLiked ?? false);
        }
    }, [post]);

    const handleLike = async () => {
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
            if (id) {
                await addComment({ postId: Number(id), content: commentContent })
                setCommentContent('')
            }
            else {
                throw new Error('No postId available')
            }
        }
        catch (e) {
            console.error(e)
        }
    }

    const handleCommentEdit = async (commentContent: string, commentId: number,) => {
        if (id) {
            await editComment({ commentId, content: commentContent, postId: Number(id) })
        }
        else {
            throw new Error('No postId available')
        }
    }

    const handleCommentDelete = async (commentId: number) => {
        if (id) {
            await deleteComment({ commentId, postId: Number(id) })
        }
    }

    if (postLoading || commentsLoading || editCommentsLoading || commentSubmitLoading || deleteCommentsLoading) {
        return (
            <AppLoader mode="page" />
        );
    }
    if (post?.status === 'draft') {
        return (
            <ErrorState message="This post is not completed." actionLabel="View other posts" onAction={() => navigate('/home/posts')} />
        )
    }
    if (!post || postError) {
        return (
            <ErrorState message='Something went wrong while fetching the post.' onRetry={() => window.location.reload()} actionLabel="View other posts" onAction={() => navigate('/home/posts')} />
        )
    }


    let commentsSection;
    if (commentsError || editCommentError || submitCommentError || deleteCommentError) {
        commentsSection = (
            <ErrorState mode="normal" message={
                commentsError
                    ? "Something went wrong while loading comments."
                    : editCommentError
                        ? "Something went wrong while editing comment."
                        : submitCommentError
                            ? "Something went wrong while posting the comment."
                            : "Something went wrong while deleting the comment."
            } onRetry={() => window.location.reload()} actionLabel="View other posts" onAction={() => navigate('/home/posts')} />
        );
    } else if (!commentResponse?.comments || commentResponse.comments.length === 0) {
        commentsSection = (
            <ErrorState mode="normal" message="There are no comments on this post" />
        );
    } else {
        commentsSection = commentResponse.comments.map((comment: comment) => (
            <CommentCard
                key={comment.id}
                commentId={comment.id}
                content={comment.content}
                username={comment.User.username}
                avatar_url={comment.User.avatar_url}
                createdAt={comment.createdAt}
                updatedAt={comment.updatedAt}
                editComment={handleCommentEdit}
                deleteComment={handleCommentDelete}
            />
        ));
    }


    return (
        <PostViewerTemplate
            header={<PostHeader likeCount={likeCount} liked={liked} OnLike={handleLike} title={post.title} authorId={post.authorId} author={post.User.username} avatar_url={post.User.avatar_url} />}
            viewer={<PostViewer content={post.content} />}
            interactionBox={<InteractionForm
                commentContent={commentContent ?? ""}
                setCommentContent={setCommentContent}
                submitComment={handleCommentSubmit}
            />}
            comments={commentsSection}
        />
    );
};

export default PostViewerPage;





