import React from "react";

type HeroTemplateProps = {
  children: React.ReactNode;
};

const HeroTemplate: React.FC<HeroTemplateProps> = ({children, ...props}) => {
    return (
        <div>
            <div {...props}>
                {children}
            </div>
        </div>
    )
}

export default HeroTemplate;