import React from "react";

type HomeTemplateProps = {
  children: React.ReactNode;
};

const HomeTemplate: React.FC<HomeTemplateProps> = ({children, ...props}) => {
    return (
        <div>
            <div {...props}>
                {children}
            </div>
        </div>
    )
}

export default HomeTemplate;