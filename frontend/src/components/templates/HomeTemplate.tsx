import React from "react";

type HomeTemplateProps = {
  children: React.ReactNode;
};

const HomeTemplate: React.FC<HomeTemplateProps> = ({ children, ...props }) => {
  return (
    <main {...props}>
      {children}
    </main>
  );
};

export default HomeTemplate;
