import React from "react";


type Props = {
  editor: React.ReactNode;
};

const PostEditorTemplate: React.FC<Props> = ({ editor }) => {
  return (
    <div>
      <main >{editor}</main>
    </div>
  );
};

export default PostEditorTemplate;
