import React from "react";


type Props = {
  children: React.ReactNode[] | React.ReactNode;
};

const PostEditorTemplate: React.FC<Props> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default PostEditorTemplate;
