import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PostEditorTemplate from "../templates/PostEditorTemplate";
import type { RootState } from "@/store";
import { useCreatePostMutation, useGetPostByIdQuery, useUpdatePostMutation } from "@/services/postsApi";
import { resetdraftPost, setDraftContent, setDraftTitle } from "@/slices/draftPostSlice";
import AppLoader from "../atoms/AppLoader";
import ErrorState from "../atoms/ErrorState";
import SEO from "../atoms/SEO";
import { PlainTextFromEditorState } from "@/utils/PlainTextFromEditorState";
const Editor = lazy(() => import("../organisms/Editor"));


const PostEditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const draftTitle = useSelector((state: RootState) => state.post.title);
  const draftContent = useSelector((state: RootState) => state.post.content)
  const { id } = useParams();
  const currentPostId = Number(id);
  const editorKey = id || 'new-post-key';
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isUpdating, setIsUpdating] = useState(false);
  const [createPost, { isLoading: createPostLoading, isError: createPostError, isSuccess: createPostSuccess }] = useCreatePostMutation();
  const [updatePost, { isLoading: updatePostLoading, isError: updatePostError, isSuccess: updatePostSuccess }] = useUpdatePostMutation();
  const { data, isLoading: getPostLoading, isError: getPostError, isSuccess: getPostSuccess } = useGetPostByIdQuery(id ? Number(id) : 0, { skip: !id });

  useEffect(() => {
    if (!id) return;
    const fetchDraft = async () => {
      if (data && getPostSuccess) {
        dispatch(setDraftContent(data.content))
        dispatch(setDraftTitle(data.title))
        setIsUpdating(true);
        if (data.status) {
          setStatus(data.status);
        }
      }
    };
    fetchDraft();
  }, [id, data, dispatch, getPostSuccess]);
  useEffect(() => {
    if (createPostSuccess || updatePostSuccess) {
      navigate("/home/dashboard");
    }
  }, [createPostSuccess, updatePostSuccess, navigate]);
  useEffect(() => {
    return () => {
      dispatch(setDraftTitle(''));
      dispatch(setDraftContent(''));
    }
  }, [dispatch]);

  const handleChangeTitle = (val: string) => {
    dispatch(setDraftTitle(val));
  };

  const handleChangeEditor = (val: string) => {
    dispatch(setDraftContent(val));
  };

  const handleChangeStatus = (val: 'draft' | 'published') => setStatus(val);

  const handleSubmit = async () => {
    const finalTitle = draftTitle || 'This post has no title.';

    if (!draftContent) return;

    if (isUpdating) {
      await updatePost({
        postId: currentPostId,
        title: finalTitle,
        content: draftContent,
        status
      }).unwrap();
      
      dispatch(resetdraftPost());
    } else {
      if (!draftTitle) return;
      await createPost({
        title: finalTitle,
        content: draftContent,
        status
      }).unwrap();

      dispatch(resetdraftPost());
    }
  };

  if (createPostLoading || updatePostLoading || getPostLoading) {
    return (
      <main>
        <AppLoader mode="page" />
      </main>
    );
  }

  if (createPostError || updatePostError || getPostError) {
    return (
      <main>
        <ErrorState message="An error occurred while loading the post editor. Please try again." />
      </main>
    )
  }

  if (id && !data) {
    return (
      <main>
        <AppLoader mode="page" />
      </main>
    )
  }
  const initialContent = id ? data?.content : draftContent;
  return (
    <PostEditorTemplate>
      <SEO title={draftTitle ? draftTitle : 'Post Editor'} description={draftContent ? PlainTextFromEditorState(draftContent).slice(0, 150) : 'Create or edit your post'} />
      <Suspense fallback={<AppLoader mode="page" />}>
        <Editor
        key={editorKey}
        title={draftTitle}
        status={status}
        draftResult={initialContent || ''}
        onTitleChange={handleChangeTitle}
        onStatusChange={handleChangeStatus}
        onEditorChange={handleChangeEditor}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
      />
      </Suspense>
    </PostEditorTemplate>
  );
};

export default PostEditorPage;
