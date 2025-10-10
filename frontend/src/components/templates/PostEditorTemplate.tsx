import React from "react";

type Props = {
  children: React.ReactNode[] | React.ReactNode;
};

const PostEditorTemplate: React.FC<Props> = ({ children }) => {
  return <main>{children}</main>;
};

export default PostEditorTemplate;
