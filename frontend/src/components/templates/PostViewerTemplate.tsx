import React from "react";
import '@/styles/editor.css'

type Props = {
  title: string,
  viewer: React.ReactNode,
  interactionBox: React.ReactNode,
  comments: React.ReactNode[],
};

const PostViewerTemplate: React.FC<Props> = ({ title, viewer, interactionBox, comments }) => {
  return (
    <div >
      <h1 className="post-title" >{title}</h1>
      <div>
        {viewer}
        {interactionBox}
        {comments}
      </div>
    </div>
  );
};

export default PostViewerTemplate;
