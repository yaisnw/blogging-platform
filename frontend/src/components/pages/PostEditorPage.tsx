import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PostEditorTemplate from "../templates/PostEditorTemplate";
import Editor from "../organisms/Editor";
import type { RootState } from "@/store";
import { useCreatePostMutation, useLazyGetPostByIdQuery, useUpdatePostMutation } from "@/services/postsApi";
import styles from "@/styles/ui.module.css"
import { setDraftContent, setDraftTitle } from "@/slices/draftPostSlice";

const PostEditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const postId = useSelector((state: RootState) => state.ui.postId);
  const title = useSelector((state: RootState) => state.post.title);
  const content = useSelector((state: RootState) => state.post.content)
  const { id } = useParams();
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [draftResult, setDraftResult] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [createPost, { isLoading: createPostLoading, isError: createPostError }] = useCreatePostMutation();
  const [updatePost, { isLoading: updatePostLoading, isError: updatePostError }] = useUpdatePostMutation();
  const [trigger] = useLazyGetPostByIdQuery();

  useEffect(() => {
    if (!id) return;
    const fetchDraft = async () => {
      const result = await trigger(Number(id));
      if (result.data) {
        setDraftResult(result.data.content);
        setIsUpdating(true);
      }
    };
    fetchDraft();
  }, [id, trigger]);

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
      console.log(status)
      await updatePost({ postId, title, content, status }).unwrap();
    } else {
      await createPost({ title, content, status }).unwrap();
    }
    navigate("/home/myPosts");
  };

  if (createPostLoading || updatePostLoading) {
    return (
      <div className={styles.loaderCenter}>
        <span className={styles.loader}></span>
      </div>
    );
  }

  if (!createPostError || updatePostError) {
    return (
      <div className={styles.pageError}>
        <h1 className={styles.error}>Something went wrong while uploading the post.</h1>
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
    <PostEditorTemplate
      editor={
        <Editor
          title={title}
          status={status}
          draftResult={draftResult}
          onTitleChange={handleChangeTitle}
          onStatusChange={handleChangeStatus}
          onEditorChange={handleChangeEditor}
          onSubmit={handleSubmit}
          isUpdating={isUpdating}
        />
      }
    />
  );
};

export default PostEditorPage;
