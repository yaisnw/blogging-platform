import React from 'react';


type AppParagraphProps = React.HTMLProps<HTMLParagraphElement>;

const AppParagraph: React.FC<AppParagraphProps> = ({children, ...props}) => {
    return <p {...props}>{children}</p>
};

export default AppParagraph;