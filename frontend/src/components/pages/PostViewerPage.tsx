import { useNavigate, useParams } from "react-router";
import PostViewerTemplate from "../templates/PostViewerTemplate";
import { useGetPostDetailsQuery } from "@/services/postsApi";
import CommentForm from "../organisms/CommentForm";
import { useEffect, useState } from "react";
import { useAddLikeMutation, useRemoveLikeMutation } from "@/services/likesApi";
import { useAddCommentMutation, useDeleteCommentMutation, useEditCommentMutation } from "@/services/commentsApi";
import type { comment } from "@/types/rtkTypes";
import CommentCard from "../molecules/CommentCard";
import CommentSkeleton from "../skeletons/CommentSkeleton";
import PostHeader from "../organisms/PostHeader";
import PostViewerSkeleton from "../skeletons/PostViewerSkeleton";
import ErrorState from "../atoms/ErrorState";
import SEO from "../atoms/SEO";
import { PlainTextFromEditorState } from "@/utils/PlainTextFromEditorState";
import PostViewer from "../organisms/PostViewer";
import AppLoader from "../atoms/AppLoader";

const PostViewerPage = () => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentContent, setCommentContent] = useState<string | undefined>('');
    const navigate = useNavigate();
    const { id } = useParams();

    const {
        data: details,
        isLoading,
        isError
    } = useGetPostDetailsQuery({ postId: Number(id), page: 1, limit: 10 }, {
        skip: !id,
    });

    const [editComment] = useEditCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
    const [addLike] = useAddLikeMutation();
    const [removeLike] = useRemoveLikeMutation();

    const post = details?.post;
    const comments = details?.comments;

    useEffect(() => {
        if (post) {
            setLikeCount(Number(post.likeCount));
            setLiked(post.hasLiked ?? false);
        }
    }, [post]);

    const handleLike = async () => {
        if (!id) return;
        const newLiked = !liked;

        setLiked(newLiked);
        setLikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));

        try {
            if (newLiked) {
                await addLike(Number(id)).unwrap();
            } else {
                await removeLike(Number(id)).unwrap();
            }
        } catch {
            setLiked(!newLiked);
            setLikeCount(Number(post?.likeCount) || 0);
        }
    };

    const handleCommentSubmit = async (content: string) => {
        if (id) {
            try {
                await addComment({ postId: Number(id), content }).unwrap();
                setCommentContent('');
            } catch (err) {
                console.error("Failed to post comment:", err);
            }
        }
    };

    const handleCommentEdit = async (content: string, commentId: number) => {
        if (id) await editComment({ commentId, content, postId: Number(id) });
    };

    const handleCommentDelete = async (commentId: number) => {
        if (id) await deleteComment({ commentId, postId: Number(id) });
    };

    if (isError || (!isLoading && !post)) {
        return (
            <main>
                <ErrorState
                    message='Something went wrong while fetching the post.'
                    onRetry={() => window.location.reload()}
                    actionLabel="View other posts"
                    onAction={() => navigate('/home/posts')}
                />
            </main>
        );
    }

    if (post?.status === 'draft') {
        return (
            <main>
                <ErrorState
                    message="This post is not completed."
                    actionLabel="View other posts"
                    onAction={() => navigate('/home/posts')}
                />
            </main>
        );
    }

    let commentsSection;
    if (isLoading) {
        commentsSection = Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />);
    } else if (!comments || comments.length === 0) {
        commentsSection = <ErrorState mode="normal" message="There are no comments on this post" />;
    } else {
        commentsSection = comments.map((c: comment) => (
            <CommentCard
                key={c.id}
                commentId={c.id}
                content={c.content}
                username={c.User!.username}
                authorId={c.authorId}
                avatar_url={c.User!.avatar_url}
                createdAt={c.createdAt}
                updatedAt={c.updatedAt!}
                editComment={handleCommentEdit}
                deleteComment={handleCommentDelete}
            />
        ));
    }

    return (
        <>
            <SEO
                title={post?.title || 'Post Viewer'}
                description={post?.content ? PlainTextFromEditorState(post.content).slice(0, 150) : 'View any post'}
                author={post?.User.username || ''}
            />
            {isAddingComment && <AppLoader mode="page" />}
            <PostViewerTemplate
                header={
                    isLoading ? (
                        <PostViewerSkeleton />
                    ) : (
                        <PostHeader
                            likeCount={likeCount}
                            liked={liked}
                            OnLike={handleLike}
                            title={post!.title}
                            authorId={post!.authorId}
                            author={post!.User.username}
                            avatar_url={post!.User.avatar_url}
                            createdAt={post!.createdAt}
                        />
                    )
                }
                viewer={
                    isLoading ? (
                        <PostViewerSkeleton />
                    ) : (
                        <PostViewer content={post!.content} />
                    )
                }
                interactionBox={
                    <CommentForm
                        commentContent={commentContent ?? ""}
                        setCommentContent={setCommentContent}
                        submitComment={handleCommentSubmit}
                    />
                }
                comments={commentsSection}
            />
        </>
    );
};

export default PostViewerPage;