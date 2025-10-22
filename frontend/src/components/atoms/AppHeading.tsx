import React from 'react';


type AppHeadingProps = React.HTMLProps<HTMLHeadingElement>;

const AppHeading: React.FC<AppHeadingProps> = ({ children, ...props}) => {
    return <h1 {...props}>{children}</h1>
};

export default AppHeading;