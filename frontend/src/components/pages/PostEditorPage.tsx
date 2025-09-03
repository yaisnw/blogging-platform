import{ useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import PostEditorTemplate from "../templates/PostEditorTemplate";
import Editor from "../organisms/Editor";
import type { RootState } from "@/store";
import { useCreatePostMutation, useLazyGetPostByIdQuery, useUpdatePostMutation } from "@/services/postsApi";

const PostEditorPage = () => {
  const navigate = useNavigate();
  const postId = useSelector((state: RootState) => state.ui.postId);
  const { id } = useParams();

  const [title, setTitle] = useState<string>('');
  const [editorState, setEditorState] = useState<string>('');
  const [status, setStatus] = useState<'pending' | 'completed'>('completed');
  const [draftResult, setDraftResult] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [trigger] = useLazyGetPostByIdQuery();

  useEffect(() => {
    if (!id) return;
    const fetchDraft = async () => {
      const result = await trigger(Number(id));
      if (result.data) {
        setTitle(result.data.title);
        setDraftResult(result.data.content);
        setIsUpdating(true);
      }
    };
    fetchDraft();
  }, [id, trigger]);

  const handleChangeTitle = (val: string) => setTitle(val);
  const handleChangeStatus = (val: 'pending' | 'completed') => setStatus(val);
  const handleChangeEditor = (val: string) => setEditorState(val);

  const handleSubmit = async () => {
    if (!title || !editorState) return;
    if (isUpdating) {
      await updatePost({ postId, title, content: editorState, status }).unwrap();
    } else {
      await createPost({ title, content: editorState, status }).unwrap();
    }
    navigate("/home/myPosts");
  };

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
