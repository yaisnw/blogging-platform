import React from "react";
import '@/styles/editor.css'

type Props = {
  header: React.ReactNode,
  viewer: React.ReactNode,
  interactionBox: React.ReactNode,
  comments: React.ReactNode[] | React.ReactNode,
};

const PostViewerTemplate: React.FC<Props> = ({ header, viewer, interactionBox, comments }) => {
  return (
    <div >
      {header}
      <div>
        {viewer}
        {interactionBox}
        {comments}
      </div>
    </div>
  );
};

export default PostViewerTemplate;
