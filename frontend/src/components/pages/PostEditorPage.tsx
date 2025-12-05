import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PostEditorTemplate from "../templates/PostEditorTemplate";
import Editor from "../organisms/Editor";
import type { RootState } from "@/store";
import { useCreatePostMutation, useGetPostByIdQuery   , useUpdatePostMutation } from "@/services/postsApi";
import { setDraftContent, setDraftTitle } from "@/slices/draftPostSlice";
import { setPostId } from "@/slices/uiSlice";
import AppLoader from "../atoms/AppLoader";
import ErrorState from "../atoms/ErrorState";
import SEO from "../atoms/SEO";
import { PlainTextFromEditorState } from "@/utils/PlainTextFromEditorState";


const PostEditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const postId = useSelector((state: RootState) => state.ui.postId);
  const title = useSelector((state: RootState) => state.post.title);
  const content = useSelector((state: RootState) => state.post.content)
  const { id } = useParams();
  const editorKey = id || 'new-post-key';
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isUpdating, setIsUpdating] = useState(false);
  const [createPost, { isLoading: createPostLoading, isError: createPostError }] = useCreatePostMutation();
  const [updatePost, { isLoading: updatePostLoading, isError: updatePostError }] = useUpdatePostMutation();
  const {data, isLoading: getPostLoading, isError: getPostError, isSuccess: getPostSuccess} = useGetPostByIdQuery(id ? Number(id) : 0, {skip : !id});

  useEffect(() => {
    if (!id) return;
    const fetchDraft = async () => {
      if (data && getPostSuccess) {
        dispatch(setDraftContent(data.content))
        dispatch(setDraftTitle(data.title))
        setIsUpdating(true);
      }
    };
    fetchDraft();
  }, [id, data, dispatch, getPostSuccess]);

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
    dispatch(setDraftTitle(''))
    dispatch(setDraftContent(''))
    dispatch(setPostId(0));
    navigate("/home/dashboard");
  };

  if (createPostLoading || updatePostLoading || getPostLoading ) {
    return (
      <AppLoader mode="page" />
    );
  }

  if (createPostError || updatePostError || getPostError) {
    return (
      <ErrorState message='Something went wrong while uploading the post.' onRetry={() => window.location.reload()} actionLabel="View other posts" onAction={() => navigate('/home/posts')} />
    )
  }

  return (
    <PostEditorTemplate>
      <SEO title={title ? title : 'Post Editor'} description={content ? PlainTextFromEditorState(content).slice(0, 150) : 'Create or edit your post'} />
      <Editor
        key={editorKey}
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
