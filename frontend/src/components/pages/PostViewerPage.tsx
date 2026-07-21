import { useNavigate, useParams } from "react-router";
import PostViewerTemplate from "../templates/PostViewerTemplate";
import { useGetPostDetailsQuery } from "@/services/postsApi";
import CommentForm from "../organisms/CommentForm";
import { useState } from "react";
import { useAddLikeMutation, useRemoveLikeMutation } from "@/services/likesApi";
import { useAddCommentMutation, useDeleteCommentMutation, useEditCommentMutation } from "@/services/commentsApi";
import type { comment } from "@/types/rtkTypes";
import CommentCard from "../molecules/CommentCard";
import CommentSkeleton from "../skeletons/CommentSkeleton";
import PostHeader from "../organisms/PostHeader";
import PostInteractionBar from "../molecules/PostInteractionBar";
import PostViewerSkeleton from "../skeletons/PostViewerSkeleton";
import ErrorState from "../atoms/ErrorState";
import SEO from "../atoms/SEO";
import { PlainTextFromEditorState } from "@/utils/PlainTextFromEditorState";
import PostViewer from "../organisms/PostViewer";
import AppLoader from "../atoms/AppLoader";
import { useAuthStatus } from "@/hooks/useAuthStatus";

const PostViewerPage = () => {
    const { loggedIn } = useAuthStatus();
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

    // Read straight from the RTK Query cache — likesApi already applies the
    // optimistic patch (and undoes it on failure) in onQueryStarted. Mirroring
    // this into local state would give two competing optimistic updates.
    const liked = post?.hasLiked ?? false;
    const likeCount = Number(post?.likeCount ?? 0);

    const handleLike = async () => {
        if (!id) return;
        // Without this the count optimistically bumps, the request 401s, and it
        // silently reverts — looks like a bug to a logged-out reader.
        if (!loggedIn) {
            navigate('/login');
            return;
        }

        try {
            if (liked) {
                await removeLike(Number(id)).unwrap();
            } else {
                await addLike(Number(id)).unwrap();
            }
        } catch {
            // likesApi's patchResult.undo() already rolled the cache back.
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
        // One placeholder, not a guessed count: we don't know how many comments
        // exist until the response lands, and 3 skeletons for a post with none
        // promises content that never arrives.
        commentsSection = <CommentSkeleton />;
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
            <PostViewerTemplate
                header={
                    isLoading ? (
                        <PostViewerSkeleton />
                    ) : (
                        <PostHeader
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
                    <>
                        {!isLoading && (
                            <PostInteractionBar
                                OnLike={handleLike}
                                likeCount={likeCount}
                                liked={liked}
                                canLike={loggedIn}
                                commentCount={details?.totalComments ?? 0}
                            />
                        )}
                        <CommentForm
                            commentContent={commentContent ?? ""}
                            setCommentContent={setCommentContent}
                            submitComment={handleCommentSubmit}
                        />
                        {/* Inline: posting a comment shouldn't block the whole page. */}
                        {isAddingComment && <AppLoader mode="mini" />}
                    </>
                }
                comments={commentsSection}
            />
        </>
    );
};

export default PostViewerPage;