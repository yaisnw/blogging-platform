import React from "react";
import "@/styles/editor.css";

type Props = {
  children: React.ReactNode[] | React.ReactNode;
};

const PostEditorTemplate: React.FC<Props> = ({ children }) => {
  return <main className="mainEditor">{children}</main>;
};

export default PostEditorTemplate;
