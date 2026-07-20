import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PostEditorTemplate from "../templates/PostEditorTemplate";
import type { RootState } from "@/store";
import { useCreatePostMutation, useGetPostByIdQuery, useUpdatePostMutation } from "@/services/postsApi";
import { resetdraftPost, setDraftContent, setDraftTitle } from "@/slices/draftPostSlice";
import { setPostId } from "@/slices/uiSlice";
import AppLoader from "../atoms/AppLoader";
import ErrorState from "../atoms/ErrorState";
import SEO from "../atoms/SEO";
import { PlainTextFromEditorState } from "@/utils/PlainTextFromEditorState";
import Editor from "../organisms/Editor";

const PostEditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const draftTitle = useSelector((state: RootState) => state.post.title);
  const draftContent = useSelector((state: RootState) => state.post.content)
  const editingPostId = useSelector((state: RootState) => state.ui.postId);
  const { id } = useParams();
  const currentPostId = Number(id);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
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
  // The editor owns ui.postId: seed it from the URL (edit mode) or clear it to 0
  // (fresh post) so a stale id from browsing/commenting can't leak into publish.
  // ImageInsertButton may later set it to a placeholder draft's id.
  useEffect(() => {
    dispatch(setPostId(id ? Number(id) : 0));
    return () => {
      dispatch(setDraftTitle(''));
      dispatch(setDraftContent(''));
      dispatch(setPostId(0));
    }
  }, [dispatch, id]);

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

    // A real post already exists if we're editing (URL :id) or if inserting an
    // image created a placeholder draft (ui.postId). Promote that one instead of
    // creating a second post. Only create when no post exists yet (text-only, no image).
    const existingPostId = isUpdating ? currentPostId : editingPostId;

    if (existingPostId) {
      await updatePost({
        postId: existingPostId,
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

  if (createPostError || updatePostError || getPostError) {
    return (
      <main>
        <ErrorState message="An error occurred while loading the post editor. Please try again." />
      </main>
    )
  }

  if (getPostLoading || (id && !data)) {
    return (
      <main>
        <AppLoader mode="page" />
      </main>
    );
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
        title={draftTitle}
        status={status}
        draftResult={initialContent || ''}
        onTitleChange={handleChangeTitle}
        onStatusChange={handleChangeStatus}
        onEditorChange={handleChangeEditor}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
        isSubmitting={createPostLoading || updatePostLoading}

      />
    </PostEditorTemplate>
  );
};

export default PostEditorPage;
