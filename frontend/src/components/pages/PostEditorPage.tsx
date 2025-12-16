import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PostEditorTemplate from "../templates/PostEditorTemplate";
import Editor from "../organisms/Editor";
import type { RootState } from "@/store";
import { useCreatePostMutation, useGetPostByIdQuery, useUpdatePostMutation } from "@/services/postsApi";
import { setDraftContent, setDraftTitle } from "@/slices/draftPostSlice";
import AppLoader from "../atoms/AppLoader";
import ErrorState from "../atoms/ErrorState";
import SEO from "../atoms/SEO";
import { PlainTextFromEditorState } from "@/utils/PlainTextFromEditorState";


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
        console.log("Fetched post data:", data);
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
        if (!draftTitle || !draftContent) return;

        if (isUpdating) {
            await updatePost({ postId: currentPostId, title: draftTitle, content: draftContent, status }).unwrap();
        } else {
            await createPost({ title: draftTitle, content: draftContent, status }).unwrap();
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
    </PostEditorTemplate>
  );
};

export default PostEditorPage;
