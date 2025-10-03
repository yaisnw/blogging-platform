import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PostEditorTemplate from "../templates/PostEditorTemplate";
import Editor from "../organisms/Editor";
import type { RootState } from "@/store";
import { useCreatePostMutation, useLazyGetPostByIdQuery, useUpdatePostMutation } from "@/services/postsApi";
import { setDraftContent, setDraftTitle } from "@/slices/draftPostSlice";
import { setPostId } from "@/slices/uiSlice";
import AppLoader from "../atoms/AppLoader";
import ErrorState from "../atoms/ErrorState";

const PostEditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const postId = useSelector((state: RootState) => state.ui.postId);
  const title = useSelector((state: RootState) => state.post.title);
  const content = useSelector((state: RootState) => state.post.content)
  const { id } = useParams();
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isUpdating, setIsUpdating] = useState(false);
  const [createPost, { isLoading: createPostLoading, isError: createPostError }] = useCreatePostMutation();
  const [updatePost, { isLoading: updatePostLoading, isError: updatePostError }] = useUpdatePostMutation();
  const [trigger] = useLazyGetPostByIdQuery();

  useEffect(() => {
    if (!id) return;
    const fetchDraft = async () => {
      const result = await trigger(Number(id));
      if (result.data) {
        dispatch(setDraftContent(result.data.content))
        dispatch(setDraftTitle(result.data.title))
        setIsUpdating(true);
      }
    };
    fetchDraft();
  }, [id, trigger, dispatch]);

  const handleChangeTitle = (val: string) => {
    dispatch(setDraftTitle(val));
  };

  const handleChangeEditor = (val: string) => {
    dispatch(setDraftContent(val));
  };

  const handleChangeStatus = (val: 'draft' | 'published') => setStatus(val);

  const handleSubmit = async () => {
    if (!title || !content) return;

    if (isUpdating) {
      await updatePost({ postId, title, content, status }).unwrap();
    } else {
      await createPost({ title, content, status }).unwrap();
    }
    dispatch(setDraftTitle(''), setDraftContent(''), setPostId(0))
    navigate("/home/myPosts");
  };

  if (createPostLoading || updatePostLoading) {
    return (
      <AppLoader mode="page" />
    );
  }

  if (createPostError || updatePostError) {
    return (
      <ErrorState message='Something went wrong while uploading the post.' onRetry={() => window.location.reload()} actionLabel="View other posts" onAction={()=> navigate('/home/posts')} />
    )
  }

  return (
    <PostEditorTemplate>
      <Editor
        title={title}
        status={status}
        draftResult={content}
        onTitleChange={handleChangeTitle}
        onStatusChange={handleChangeStatus}
        onEditorChange={handleChangeEditor}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
      />
    </PostEditorTemplate>
  );
};

export default PostEditorPage;
