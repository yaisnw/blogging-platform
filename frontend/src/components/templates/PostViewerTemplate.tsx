import React from "react";
import '@/styles/editor.css'

type Props = {
  title: string;
  viewer: React.ReactNode;
};

const PostViewerTemplate: React.FC<Props> = ({ title, viewer }) => {
  return (
    <div >
        <h1 className="post-title" >{title}</h1>
      <div>
        {viewer}
      </div>
    </div>
  );
};

export default PostViewerTemplate;
